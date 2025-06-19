import { Module } from '@nestjs/common';
import { UsersDbModule } from './user-db.module';
import { UsersService } from '../services/user.service';

@Module({
  imports: [UsersDbModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
