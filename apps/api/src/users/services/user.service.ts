import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getAll(): Promise<UserEntity[]> {
    return this.usersRepository.findAll();
  }

  getById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findById(id);
  }

  getByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    return this.usersRepository.create(data);
  }

  async updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    if (data.password && !data.password.startsWith('$2b$')) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.usersRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    return this.usersRepository.delete(id).then(() => undefined);
  }
}
