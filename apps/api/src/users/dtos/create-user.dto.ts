import { ApiProperty } from '@nestjs/swagger';
import { EUserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ enum: EUserRole })
  readonly role!: EUserRole;
}
