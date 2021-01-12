import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
    ParseIntPipe,
    ParseArrayPipe,
    DefaultValuePipe,
    ValidationPipe
} from '@nestjs/common';
import { Request } from 'express';
import { CategoriesService } from './categories.service';
import { Category } from './category.schema';
import { CreateCategoryDto } from './create-category.dto';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
    @Post()
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll(
        @Req() request: Request,
        @Query('search') search: string,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
        @Query('fields', new DefaultValuePipe([]), ParseArrayPipe) fields: [string]
    ): Promise<Category[]> {
        const projection: Record<string, number> = {};
        const options: Record<string, any> = { skip, limit };
        const query: Record<string, any> = { name: { $regex: search || '', $options: 'i' } };

        // Bring only required fields
        if(fields.length) {
            fields.forEach((key) => {
                projection[key.trim()] = 1;
            });
        }

        return this.categoriesService.findAll({ query, projection, options });
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
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
