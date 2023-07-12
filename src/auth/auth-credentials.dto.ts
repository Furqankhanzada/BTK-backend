import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Membership } from 'src/users/users.schema';

export class AuthNewUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password is too short (6 characters min)' })
  @MaxLength(20, { message: 'Password is too long (20 characters max)' })
  password: string;
}

export class ProfileUpdateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  avatar: string;
}

export class CreateMembershipDto {
  @IsNotEmpty()
  membership: Membership[];
}

export class AuthCredentialsDto {
  @IsNotEmpty()
  emailOrNumber: string;

  @IsNotEmpty()
  password: string;
}

export class PasswordUpdateDto {
  @IsNotEmpty()
  password: string;
}
