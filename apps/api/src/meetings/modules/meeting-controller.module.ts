import { Module } from '@nestjs/common';
import { MeetingsModule } from './meeting.module';
import { MeetingDbModule } from './meeting-db.module';
import { MeetingsController } from '../controllers/meetings.controller';

@Module({
  imports: [MeetingsModule, MeetingDbModule],
  controllers: [MeetingsController],
})
export class MeetingsControllerModule {}
