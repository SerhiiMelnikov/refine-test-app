import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findById(id: string): Promise<T | null> {
    return this.repository.findOneBy({ id } as unknown as T);
  }

  create(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: string, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
