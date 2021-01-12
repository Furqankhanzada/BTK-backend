import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './create-category.dto';
import { BusinessesService } from '../businesses/businesses.service';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>, private businessService: BusinessesService) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const createdCategory = new this.categoryModel(createCategoryDto);
        try {
            return await createdCategory.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Category with this name already exist!');
            }
            return error;
        }
    }

    async findAll({
            query = {},
            projection = {},
            options = {}
        } = {}
    ): Promise<Category[]> {
        return this.categoryModel.find(query, projection, { sort: { order: 1 }, ...options }).exec();
    }

    async findOne(_id: string): Promise<Category> {
        return this.categoryModel.findOne({ _id }).exec();
    }

    async update(_id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        try {
            const category = await this.findOne(_id);
        
            const updatedCategory = await this.categoryModel.updateOne({ _id }, updateCategoryDto).exec();

            if(updateCategoryDto.name && updateCategoryDto.name !== category.name ){
                await this.businessService.updateMany({ category: category.name }, { category: updateCategoryDto.name });
            }

            return updatedCategory;
        } catch (error) {
            return error;
        }
    }

    async remove(_id: string): Promise<{ deletedCount?: number }> {
       try {
            const category = await this.findOne(_id);
            const businessesUsingCategory = await this.businessService.findAll({ query: { category: category.name }, projection: { _id: 1 }});

            if(businessesUsingCategory.length){
                throw new ConflictException('Category is in use.');
            }
  
            return this.categoryModel.deleteOne({ _id }).exec();
       } catch (error) {
           return error;
       }
    }
}
