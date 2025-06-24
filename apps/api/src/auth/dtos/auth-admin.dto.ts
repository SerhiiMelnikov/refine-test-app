import { ApiProperty } from '@nestjs/swagger';

export class AuthAdminDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
