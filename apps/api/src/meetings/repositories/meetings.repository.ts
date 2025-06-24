import { MeetingEntity } from '../entities/meeting.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/shared-components/repositories/base.repository';

@Injectable()
export class MeetingsRepository extends BaseRepository<MeetingEntity> {
  constructor(
    @InjectRepository(MeetingEntity)
    protected readonly repository: Repository<MeetingEntity>,
  ) {
    super(repository);
  }

  async findAll(): Promise<MeetingEntity[]> {
    return this.repository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.createdBy', 'user')
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.date',
        'meeting.priority',
        'meeting.description',
        'meeting.invitedUserIds',
        'user.id',
        'user.fullName',
        'user.email',
      ])
      .getMany();
  }

  findById(id: string): Promise<MeetingEntity | null> {
    return this.repository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.createdBy', 'user')
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.date',
        'meeting.priority',
        'meeting.description',
        'meeting.invitedUserIds',
        'user.id',
        'user.fullName',
        'user.email',
      ])
      .where('meeting.id = :id', { id })
      .getOne();
  }
}
