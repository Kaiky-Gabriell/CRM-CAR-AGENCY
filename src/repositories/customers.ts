import { BaseRepository } from './base';

export class CustomersRepository extends BaseRepository<'customers'> {
  constructor(companyId: string) {
    super('customers', companyId);
  }

  // specific methods can be added here
}
