import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MeetingsService } from '../services/meetings.service';
import { MeetingEntity } from '../entities/meeting.entity';
import { CreateMeetingDto } from '../dtos/create-meeting.dto';
import { IAuthenticatedUser } from 'src/shared-components/interfaces/authenicated-user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('meetings')
@Controller('meetings')
export class MeetingsController {
  @Inject()
  protected readonly meetingsService: MeetingsService;

  @Get()
  @ApiOperation({ summary: 'Get all meetings' })
  @ApiResponse({
    status: 200,
    description: 'List of meetings',
    type: [MeetingEntity],
  })
  async getAll(): Promise<MeetingEntity[]> {
    return this.meetingsService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meeting by ID' })
  @ApiResponse({
    status: 200,
    description: 'Meeting found',
    type: MeetingEntity,
  })
  async getById(@Param('id') id: string): Promise<MeetingEntity | null> {
    return this.meetingsService.getById(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new meeting' })
  @ApiResponse({
    status: 201,
    description: 'Meeting created',
    type: MeetingEntity,
  })
  async create(
    @Body() body: CreateMeetingDto,
    @Req() req: IAuthenticatedUser,
  ): Promise<MeetingEntity> {
    const userId = req.user.id;

    return this.meetingsService.createMeeting({
      ...body,
      createdById: userId,
    });
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a meeting' })
  @ApiResponse({
    status: 200,
    description: 'Meeting updated',
    type: MeetingEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateMeetingDto>,
  ): Promise<MeetingEntity> {
    return this.meetingsService.updateMeeting(id, body);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a meeting' })
  @ApiResponse({ status: 204, description: 'Meeting deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.meetingsService.deleteUser(id);
  }
}
