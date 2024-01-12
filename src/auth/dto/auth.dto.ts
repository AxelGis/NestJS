import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../../entities/user.entity';

export class RegisterDto implements Partial<User> {
  @MinLength(2)
  @MaxLength(25)
  @IsString()
  @ApiProperty({ default: 'user' })
  username: string;

  @IsEmail()
  @ApiProperty({ default: 'user@user.com' })
  email: string;

  @MinLength(6)
  @MaxLength(50)
  @IsString()
  @ApiProperty({ default: '123456' })
  password: string;

  @IsString()
  @IsOptional()
  role?: string;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty({ default: 'user@user.com' })
  email: string;

  @IsString()
  @ApiProperty({ default: '123456' })
  password: string;
}
