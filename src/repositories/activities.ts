import { BaseRepository } from './base';

export class ActivitiesRepository extends BaseRepository<'activities'> {
  constructor(companyId: string) {
    super('activities', companyId);
  }
}
