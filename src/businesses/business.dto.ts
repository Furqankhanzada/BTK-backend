import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Location } from '../users/users.schema';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBusinessDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Name is too short' })
    name: string;

    @IsString()
    description?: string;

    @IsString()
    @IsPhoneNumber('PK')
    telephone: string;

    @IsString()
    @IsEmail()
    email?: string;

    @IsString()
    @IsUrl({ require_protocol: true })
    website?: string;

    @IsString()
    address: string;

    @IsObject()
    location?: Location;

    @IsString()
    established?: Date;

    @IsString()
    category: string;

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
