import { Module } from '@nestjs/common';
import { MeetingDbModule } from './meeting-db.module';
import { MeetingsService } from '../services/meetings.service';

@Module({
  imports: [MeetingDbModule],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
