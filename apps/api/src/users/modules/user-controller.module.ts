import { Module } from '@nestjs/common';
import { UsersModule } from './user.module';
import { UsersDbModule } from './user-db.module';
import { UsersController } from '../controllers/user.controller';

@Module({
  imports: [UsersModule, UsersDbModule],
  controllers: [UsersController],
})
export class UsersControllersModule {}
