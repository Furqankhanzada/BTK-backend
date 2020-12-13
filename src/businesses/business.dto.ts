import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Location } from '../users/users.schema';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBusinessDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Name is too short' })
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsString()
    @IsPhoneNumber('PK')
    telephone: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @IsUrl({ require_protocol: true })
    website: string;

    @IsString()
    address: string;

    @IsObject()
    location?: Location;

    @IsOptional()
    @IsString()
    established: Date;

    @IsString()
    category: string;

    @IsOptional()
    @MaxLength(15, {
        each: true,
    })
    tags: string[];
}

export class UpdateBusinessDTO extends PartialType(CreateBusinessDTO) {}

export class CreateReviewDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Title is too short' })
    title: string;

    @IsString()
    description?: string;

    @IsNumber()
    rating: number;
}
