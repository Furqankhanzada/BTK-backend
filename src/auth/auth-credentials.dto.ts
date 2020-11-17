import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

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
    @MinLength(6, { message: 'Password is too short (8 characters min)' })
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
}

export class AuthCredentialsDto {
    @IsNotEmpty()
    emailOrNumber: string;

    @IsNotEmpty()
    password: string;
}
