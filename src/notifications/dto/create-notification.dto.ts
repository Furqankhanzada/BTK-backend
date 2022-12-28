import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

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
    date: string;

    @IsString()
    @IsUrl({ require_protocol: true })
    @IsOptional()
    link: string;

    @IsString()
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    read: boolean;
}
