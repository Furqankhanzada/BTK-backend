import { PartialType } from "@nestjs/mapped-types";
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

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}