import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthAdminDto } from '../dtos/auth-admin.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-admin')
  @ApiBody({
    schema: { example: { email: 'admin@example.com', password: 'secret' } },
  })
  @ApiResponse({
    status: 201,
    description: 'User logged in, returns JWT token',
  })
  @ApiBody({ type: AuthAdminDto })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async login(@Body() body: AuthAdminDto): Promise<AuthResponseDto> {
    return this.authService.loginAdmin(body.email, body.password);
  }
}
