import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-admin')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.loginAdmin(body.email, body.password);
  }
}
