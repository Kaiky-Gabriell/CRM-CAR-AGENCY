import { useState, useCallback, useEffect } from 'react';
import { FunnelStage } from '../types';
import type { Client, ClientFormData, ActivityLog, DashboardStats } from '../types';
import type { Database } from '../types/database.types';
import { useApp } from '../providers/AppProvider';
import { supabase } from '../lib/supabase';
import { DEFAULT_FOLLOW_UP_DAYS, FUNNEL_STAGES } from '../utils/constants';
import { useRealtime } from './useRealtime';
import { logger } from '../lib/logger';
import { clientFormSchema, activitySchema } from '../lib/validators';

type DealRow = Database['public']['Tables']['deals']['Row'] & {
  customers: Database['public']['Tables']['customers']['Row'] | null;
};
type ActivityRow = Database['public']['Tables']['activities']['Row'];


export function useClients() {
  const { companyId } = useApp();
  const [clients, setClients] = useState<Client[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    // VALIDAÇÃO OBRIGATÓRIA: Não executar se o ID for inválido ou temporário
    if (!companyId) {
      return;
    }

    try {
      const { data: deals, error } = await supabase
        .from('deals')
        .select('*, customers(*)')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (deals) {
        const mapped: Client[] = (deals as unknown as DealRow[]).map((d) => ({
          id: d.id,
          customerId: d.customers?.id || '',
          name: d.customers?.name || 'Sem nome',
          phone: d.customers?.phone || '',
          email: d.customers?.email || '',
          vehicleInterest: d.vehicle_interest || d.title || '',
          estimatedValue: d.estimated_value || 0,
          funnelStage: d.stage as FunnelStage,
          source: (d.customers?.source as import('../types').LeadSource) || 'other',
          notes: d.customers?.notes || '',
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          lastContactAt: d.updated_at,
        }));
        setClients(mapped);
      }
    } catch (err: unknown) {
      logger.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [companyId]);

  const fetchActivities = useCallback(async () => {
    if (!companyId) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      if (data) {
        const mapped: ActivityLog[] = (data as ActivityRow[]).map((a) => {
          const details = a.details as Record<string, any> | null;
          return {
            id: a.id,
            clientId: a.deal_id || a.customer_id || '',
            clientName: details?.clientName || 'Cliente',
            action: a.action as any,
            fromStage: details?.fromStage,
            toStage: details?.toStage,
            timestamp: a.created_at,
          };
        });
        setActivities(mapped);
      }
    } catch (err: unknown) {
      logger.error('Error fetching activities:', err);
    }
  }, [companyId]);

  const refresh = useCallback(async () => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await Promise.all([fetchClients(), fetchActivities()]);
    } finally {
      setLoading(false);
    }
  }, [companyId, fetchClients, fetchActivities]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Hooks realtime refatorados
  useRealtime('deals', refresh);
  useRealtime('customers', refresh);
  useRealtime('activities', fetchActivities);

  const addActivity = async (payload: { clientId: string, clientName: string, action: string, fromStage?: string, toStage?: string }) => {
    if (!companyId) return;
    try {
      const validated = activitySchema.parse(payload);
      await (supabase as any).from('activities').insert({
        company_id: companyId,
        deal_id: validated.clientId,
        action: validated.action,
        details: {
          clientName: validated.clientName,
          fromStage: validated.fromStage,
          toStage: validated.toStage
        }
      });
      fetchActivities();
    } catch (err) {
      logger.error('Error logging activity:', err);
    }
  };


  const addClient = useCallback(async (data: ClientFormData) => {
    if (!companyId) return null;

    try {
      // 1. Validate Input
      const validated = clientFormSchema.parse(data);

      // 2. Inserir Cliente
      const { data: customer, error: custErr } = await (supabase as any)
        .from('customers')
        .insert({
          company_id: companyId,
          name: validated.name,
          phone: validated.phone,
          email: validated.email,
          source: validated.source,
          notes: validated.notes
        })
        .select()
        .single();

      if (custErr || !customer) throw custErr;

      // 3. Inserir Negócio (Deal)
      const { data: deal, error: dealErr } = await (supabase as any)
        .from('deals')
        .insert({
          company_id: companyId,
          customer_id: customer.id,
          title: validated.vehicleInterest || 'Nova Negociação', // Fallback for title
          stage: validated.funnelStage,
          vehicle_interest: validated.vehicleInterest,
          estimated_value: validated.estimatedValue,
          status: 'open'
        })
        .select()
        .single();

      if (dealErr || !deal) throw dealErr;

      refresh();
      addActivity({
        clientId: deal.id,
        clientName: customer.name,
        action: 'created',
        toStage: deal.stage,
      });

      return deal;
    } catch (err: unknown) {
      logger.error('Error adding client:', err);
      return null;
    }
  }, [companyId, refresh]);

  const updateClient = useCallback(async (id: string, data: Partial<ClientFormData>) => {
    if (!companyId) return null;

    const existingClient = clients.find(c => c.id === id);
    if (!existingClient) return null;

    try {
      // Partial validation for updates
      const validated = clientFormSchema.partial().parse(data);

      const dealUpdates: Database['public']['Tables']['deals']['Update'] = {};
      if (validated.funnelStage) dealUpdates.stage = validated.funnelStage;
      if (validated.vehicleInterest) {
        dealUpdates.vehicle_interest = validated.vehicleInterest;
        dealUpdates.title = validated.vehicleInterest;
      }
      if (validated.estimatedValue !== undefined) dealUpdates.estimated_value = validated.estimatedValue;

      if (Object.keys(dealUpdates).length > 0) {
        dealUpdates.updated_at = new Date().toISOString();
        await (supabase as any).from('deals').update(dealUpdates).eq('id', id).eq('company_id', companyId);
      }

      const custUpdates: Database['public']['Tables']['customers']['Update'] = {};
      if (validated.name) custUpdates.name = validated.name;
      if (validated.phone) custUpdates.phone = validated.phone;
      if (validated.email !== undefined) custUpdates.email = validated.email;
      if (validated.notes !== undefined) custUpdates.notes = validated.notes;
      if (validated.source) custUpdates.source = validated.source;

      if (Object.keys(custUpdates).length > 0 && existingClient.customerId) {
        custUpdates.updated_at = new Date().toISOString();
        await (supabase as any).from('customers').update(custUpdates).eq('id', existingClient.customerId).eq('company_id', companyId);
      }

      if (validated.funnelStage && validated.funnelStage !== existingClient.funnelStage) {
        addActivity({
          clientId: id,
          clientName: existingClient.name,
          action: 'moved',
          fromStage: existingClient.funnelStage,
          toStage: validated.funnelStage,
        });
      }

      setClients(prev => prev.map(c => c.id === id ? { ...c, ...validated } : c));
    } catch (err: unknown) {
      logger.error('Error updating client:', err);
    }
    return null;
  }, [companyId, clients]);

  const deleteClient = useCallback(async (id: string) => {
    if (!companyId) return false;
    try {
      await supabase.from('deals').delete().eq('id', id).eq('company_id', companyId);
      setClients(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err: unknown) {
      logger.error('Error deleting client:', err);
      return false;
    }
  }, [companyId]);

  const moveToStage = useCallback(async (id: string, stage: FunnelStage) => {
    return updateClient(id, { funnelStage: stage });
  }, [updateClient]);

  const updateLastContact = useCallback(async (id: string) => {
    if (!companyId) return;
    await (supabase as any).from('deals').update({ updated_at: new Date().toISOString() }).eq('id', id);
  }, [companyId]);

  const getClientsByStage = useCallback((): Record<FunnelStage, Client[]> => {
    const grouped = {} as Record<FunnelStage, Client[]>;
    FUNNEL_STAGES.forEach((s) => {
      grouped[s.key] = [];
    });
    clients.forEach((c) => {
      if (grouped[c.funnelStage]) {
        grouped[c.funnelStage].push(c);
      }
    });
    return grouped;
  }, [clients]);

  const getStats = useCallback((): DashboardStats => {
    const followUpDays = DEFAULT_FOLLOW_UP_DAYS;
    const activeStages = [
      FunnelStage.FIRST_CONTACT, FunnelStage.ANALYZING, FunnelStage.NEGOTIATION, FunnelStage.FINANCING,
    ] as FunnelStage[];
    const activeClients = clients.filter((c) => activeStages.includes(c.funnelStage));
    const closedClients = clients.filter((c) => c.funnelStage === FunnelStage.CLOSING);

    const clientsByStage = {} as Record<FunnelStage, number>;
    FUNNEL_STAGES.forEach((s) => {
      clientsByStage[s.key] = clients.filter((c) => c.funnelStage === s.key).length;
    });

    const clientsBySource = {} as Record<string, number>;
    clients.forEach((c) => {
      clientsBySource[c.source] = (clientsBySource[c.source] || 0) + 1;
    });

    const totalWithOutcome = closedClients.length + clients.filter((c) => c.funnelStage === FunnelStage.LOST).length;
    const conversionRate = totalWithOutcome > 0 ? (closedClients.length / totalWithOutcome) * 100 : 0;
    const totalNegotiationValue = activeClients.reduce((sum, c) => sum + c.estimatedValue, 0);

    return {
      totalClients: clients.length,
      activeClients: activeClients.length,
      conversionRate,
      totalNegotiationValue,
      clientsByStage,
      clientsBySource: clientsBySource as Record<string, number>,
      recentActivities: activities.slice(0, 15),
      followUpNeeded: activeClients.filter((c) => {
        const diff = new Date().getTime() - new Date(c.lastContactAt).getTime();
        return diff / (1000 * 3600 * 24) >= followUpDays;
      }),
    };
  }, [clients, activities]);

  const searchClients = useCallback(
    (query: string, stageFilter?: FunnelStage, sourceFilter?: string): Client[] => {
      let result = clients;
      if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.vehicleInterest.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        );
      }
      if (stageFilter) result = result.filter((c) => c.funnelStage === stageFilter);
      if (sourceFilter) result = result.filter((c) => c.source === sourceFilter);
      return result;
    },
    [clients]
  );

  return {
    clients,
    activities,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    moveToStage,
    updateLastContact,
    getClientsByStage,
    getStats,
    searchClients,
    refresh,
  };
}
