import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../providers/AppProvider';
import { logger } from '../lib/logger';

type Payload = {
  new: Record<string, unknown>;
  old: Record<string, unknown>;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export const useRealtime = (table: string, onUpdate: (payload: Payload) => void) => {
  const { companyId } = useApp();
  const onUpdateRef = useRef(onUpdate);

  // Update ref when onUpdate changes to avoid re-subscribing just because of function reference
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    // CRITICAL: Validate companyId. 
    // Must be a valid UUID to avoid Supabase Realtime errors.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!companyId || !uuidRegex.test(companyId)) {
      if (companyId) {
        logger.warn(`[Realtime] Invalid companyId detected. Subscription aborted.`);
      }
      return;
    }

    let channel = null;

    try {
      // Use a more unique channel name per session to avoid collisions
      const channelName = `realtime:${table}:${companyId}:${Math.random().toString(36).substring(7)}`;
      logger.debug(`[Realtime] Subscribing to: ${table}`);
      
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `company_id=eq.${companyId}`,
          },
          (payload) => {
            try {
              onUpdateRef.current(payload as Payload);
            } catch (err) {
              logger.error(`[Realtime] Callback error:`, err);
            }
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            logger.debug(`[Realtime] Subscribed successfully to ${table}`);
          }
          if (err || status === 'CHANNEL_ERROR') {
            logger.error(`[Realtime] Subscription error:`, err || status);
          }
        });

    } catch (err) {
      logger.error(`[Realtime] Fatal setup error for ${table}:`, err);
    }

    return () => {
      if (channel) {
        logger.debug(`[Realtime] Cleaning up for ${table}`);
        supabase.removeChannel(channel).catch(err => {
          logger.error(`[Realtime] Cleanup error for ${table}:`, err);
        });
      }
    };
  }, [companyId, table]); 
};

