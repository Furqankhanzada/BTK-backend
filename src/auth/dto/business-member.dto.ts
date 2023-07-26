import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { Package } from 'src/users/users.schema';

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
