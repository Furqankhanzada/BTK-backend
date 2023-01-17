import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
    link: string;

    @IsString()
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    read: boolean;
}
