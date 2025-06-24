import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from '../entities/meeting.entity';
import { MeetingsRepository } from '../repositories/meetings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity])],
  providers: [MeetingsRepository],
  exports: [MeetingsRepository],
})
export class MeetingDbModule {}
