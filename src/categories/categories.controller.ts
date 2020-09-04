import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { CategoriesService } from './categories.service';
import { Category } from './category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './create-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll(@Req() request: Request): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.update(id, createCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return `This action removes a #${id} cat`;
    }
}
