import {IsNotEmpty, IsString} from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    icon?: string;
    color?: string;
    image?: string;
    order?: number;
}

export class UpdateCategoryDto {
    id: string;
    name: string;
    order: number;
}
