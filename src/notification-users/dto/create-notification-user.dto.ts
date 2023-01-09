import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationUserDto {
    @IsString()
    @IsNotEmpty()
    notificationId: string;

    @IsString()
    @IsNotEmpty()
    deviceUniqueId: string;

    @IsNotEmpty()
    read: boolean;
}
