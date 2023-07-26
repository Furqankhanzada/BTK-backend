import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { MembershipStatus, Package } from 'src/users/users.schema';

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

  @IsEnum(MembershipStatus)
  @IsOptional()
  status: MembershipStatus;
}

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {}
