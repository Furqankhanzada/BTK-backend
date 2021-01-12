import { PartialType } from '@nestjs/mapped-types';
import { IsHexColor, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from "class-validator";

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

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
