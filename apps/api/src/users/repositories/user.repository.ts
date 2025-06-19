import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>,
  ) {}

  findAll() {
    return this.repository.find();
  }

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  create(user: Partial<UserEntity>) {
    return this.repository.save(user);
  }

  async update(id: string, data: Partial<UserEntity>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
