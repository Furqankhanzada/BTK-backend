import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Package } from 'src/users/users.schema';

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
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsObject()
  @IsNotEmpty()
  package: Package;

  @IsString()
  @IsNotEmpty()
  billingDate: Date;

  @IsString()
  @IsOptional()
  status: string;
}

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {}

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
