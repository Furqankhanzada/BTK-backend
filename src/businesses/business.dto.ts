import { IsEmail, IsNotEmpty, IsObject, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Location } from '../users/users.schema';

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
    established?: string;

    @IsString()
    category: string;

    @MaxLength(15, {
        each: true,
    })
    tags: string[];
}
