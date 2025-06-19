import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../services/user.service';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Inject()
  protected readonly usersService: UsersService;

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserEntity],
  })
  async getAll(): Promise<UserEntity[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserEntity })
  async getById(@Param('id') id: string): Promise<UserEntity | null> {
    return this.usersService.getById(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserEntity })
  async create(@Body() body: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(body);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserEntity })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateUserDto>,
  ): Promise<UserEntity> {
    return this.usersService.updateUser(id, body);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
