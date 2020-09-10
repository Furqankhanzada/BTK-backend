import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const createdCat = new this.categoryModel(createCategoryDto);
        try {
            return await createdCat.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Category with this name already exist!');
            }
            return error;
        }
    }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().exec();
    }

    async findOne(id: string): Promise<Category> {
        return this.categoryModel.findOne({ id }).exec();
    }

    async update(id: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoryModel.updateOne({ id }, createCategoryDto).exec();
    }
    async delete(id: string): Promise<{ deletedCount?: number }> {
        return this.categoryModel.deleteOne({ id }).exec();
    }
}
