import { ApiProperty } from '@nestjs/swagger';
import { EMeetingPriority } from '../enums/meeting-priority.enum';

export class CreateMeetingDto {
  @ApiProperty()
  readonly title: string;

  @ApiProperty({ required: false })
  readonly date?: Date;

  @ApiProperty({ required: false })
  readonly description?: string;

  @ApiProperty({ enum: EMeetingPriority, required: false })
  readonly priority?: EMeetingPriority;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'IDs of users invited to the meeting',
  })
  readonly invitedUserIds?: string[];
}
