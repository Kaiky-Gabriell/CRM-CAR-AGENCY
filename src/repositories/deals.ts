import { BaseRepository } from './base';

export class DealsRepository extends BaseRepository<'deals'> {
  constructor(companyId: string) {
    super('deals', companyId);
  }
}
