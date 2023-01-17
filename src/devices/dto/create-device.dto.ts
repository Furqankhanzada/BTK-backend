import { IsNotEmpty, IsString } from "class-validator";

export class CreateDeviceDto {
    @IsString()
    @IsNotEmpty()
    deviceUniqueId: string;

    @IsString()
    @IsNotEmpty()
    fcmToken: string;

    @IsString()
    @IsNotEmpty()
    os: string;

    @IsString()
    @IsNotEmpty()
    osVersion: string;
}