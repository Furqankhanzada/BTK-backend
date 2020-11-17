import {IsNotEmpty, IsString} from "class-validator";

export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty()
    category?: string;

    tags?: [];
    telephone?: number;
    email?: number;
}

export class UpdateContactDto {
    id: string;
    name: string;
    order: number;
}
