import { BaseRepository } from './base';

export class TasksRepository extends BaseRepository<'tasks'> {
  constructor(companyId: string) {
    super('tasks', companyId);
  }
}
