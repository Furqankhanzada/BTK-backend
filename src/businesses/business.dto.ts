import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Location } from '../users/users.schema';
import { PartialType } from '@nestjs/mapped-types';
import { Facilities, Gallery, OpenHours, PriceRange, BusinessStatus } from './business.schema';

export class CreateBusinessDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Name is too short' })
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
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

    @IsOptional()
    facilities: Facilities[];

    @IsOptional()
    thumbnail: string

    @IsOptional()
    gallery: Gallery[];

    @IsOptional()
    openHours: OpenHours[];

    @IsOptional()
    priceRange: PriceRange[]
}

export class UpdateBusinessDTO extends PartialType(CreateBusinessDTO) {}

export class UpdateBusinessStatusDTO {
    @IsString()
    @IsNotEmpty()
    @IsEnum(BusinessStatus)
    status: BusinessStatus;
}

export class CreateFavoriteDTO {}

export class CreateReviewDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Title is too short' })
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNumber()
    rating: number;
}

export class UpdateReviewUserDTO extends PartialType(CreateReviewDTO) {}
