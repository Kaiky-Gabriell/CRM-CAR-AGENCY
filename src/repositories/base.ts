import type { Database } from '../types/database.types';
import { supabase } from '../lib/supabase';

export abstract class BaseRepository<T extends keyof Database['public']['Tables']> {
  protected table: T;
  protected companyId: string;

  constructor(table: T, companyId: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!companyId || !uuidRegex.test(companyId)) {
      throw new Error(`Invalid companyId provided to repository for table ${table}`);
    }

    this.table = table;
    this.companyId = companyId;
  }

  protected get query(): any {
    return (supabase as any).from(this.table);
  }

  async getAll() {
    return await this.query.select('*').eq('company_id', this.companyId);
  }

  async getById(id: string) {
    return await this.query.select('*').eq('id', id).eq('company_id', this.companyId).single();
  }

  async create(data: Omit<Database['public']['Tables'][T]['Insert'], 'company_id'>) {
    const payload = { ...data, company_id: this.companyId } as any;
    return await this.query.insert(payload).select().single();
  }

  async update(id: string, data: Omit<Database['public']['Tables'][T]['Update'], 'company_id'>) {
    const safeData = { ...data } as any;
    delete safeData.company_id; // prevent override
    return await this.query.update(safeData).eq('id', id).eq('company_id', this.companyId).select().single();
  }

  async remove(id: string) {
    return await this.query.delete().eq('id', id).eq('company_id', this.companyId);
  }
}
