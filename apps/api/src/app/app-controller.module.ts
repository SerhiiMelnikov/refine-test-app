import { Module } from '@nestjs/common';
import { AuthControllerModule } from 'src/auth/modules/auth-controller.module';
import { MeetingsControllerModule } from 'src/meetings/modules/meeting-controller.module';
import { UsersControllersModule } from 'src/users/modules/user-controller.module';

@Module({
  imports: [
    UsersControllersModule,
    AuthControllerModule,
    MeetingsControllerModule,
  ],
})
export class AppControllersModule {}
