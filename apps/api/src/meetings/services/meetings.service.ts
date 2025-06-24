import { Injectable, NotFoundException } from '@nestjs/common';
import { MeetingEntity } from '../entities/meeting.entity';
import { MeetingsRepository } from '../repositories/meetings.repository';
import { CreateMeetingDto } from '../dtos/create-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(private readonly meetingsRepository: MeetingsRepository) {}

  getAll(): Promise<MeetingEntity[]> {
    return this.meetingsRepository.findAll();
  }

  getById(id: string): Promise<MeetingEntity | null> {
    return this.meetingsRepository.findById(id);
  }

  async createMeeting(
    data: CreateMeetingDto & { createdById: string },
  ): Promise<MeetingEntity> {
    return this.meetingsRepository.create(data);
  }

  async updateMeeting(
    id: string,
    data: Partial<MeetingEntity>,
  ): Promise<MeetingEntity> {
    const updated = await this.meetingsRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    return this.meetingsRepository.delete(id).then(() => undefined);
  }
}
