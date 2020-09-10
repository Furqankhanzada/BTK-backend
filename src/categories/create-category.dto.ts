export class CreateCategoryDto {
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
