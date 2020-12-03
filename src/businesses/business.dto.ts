import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBusinessDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Name is too short' })
    name: string;

    @IsString()
    description?: string;

    @IsString()
    telephone: string;

    @IsString()
    @IsEmail()
    email?: string;

    @IsString()
    website?: string;

    @IsString()
    address: string;

    coordinates?: Number[];

    @IsString()
    established?: string;

    @IsString()
    category: string;

    @MaxLength(15, {
        each: true,
    })
    tags: string[];
}
