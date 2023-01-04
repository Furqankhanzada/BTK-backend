import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNotificationUserDto {
    @IsString()
    @IsNotEmpty()
    notificationId: string;

    @IsString()
    @IsOptional()
    read: boolean;
}
