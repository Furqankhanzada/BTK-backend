import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  video: string;

  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  type: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
