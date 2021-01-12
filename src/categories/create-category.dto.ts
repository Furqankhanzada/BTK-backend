import {IsNotEmpty, IsString, IsOptional, IsHexColor, IsUrl, IsNumber, isPositive, IsPort, IsPositive, Min, IsIn, IsInt, Max} from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    icon: string;

    @IsString()
    @IsHexColor()
    @IsOptional()
    color: string;

    @IsString()
    @IsUrl({ require_protocol: true })
    @IsOptional()
    image: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    order: number;
}

export class UpdateCategoryDto {
    id: string;
    name: string;
    order: number;
}
