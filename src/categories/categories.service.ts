import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {
        const categories = [
            { name: 'AC Technicians', icon: 'map-marked-alt', color: '#FF8A65' },
            { name: 'Plumber', icon: 'map-marked-alt', color: '#FF8A65' },
            { name: 'Electricians', icon: 'car', color: 'green' },
            // { name: 'Maintenance', icon: 'car', color: 'green' },
            { name: 'Food', icon: 'car', color: 'green' },

            { name: 'Schools', icon: 'car', color: 'green' },
            { name: 'Colleges', icon: 'car', color: 'green' },
            { name: 'Universities', icon: 'car', color: 'green' },
            { name: 'Institutes', icon: 'car', color: 'green' },
            { name: 'Madrassas', icon: 'car', color: 'green' },
            { name: 'Education', icon: 'car', color: 'green' },

            { name: 'Hospitals', icon: 'car', color: 'green' },
            { name: 'Gyms', icon: 'car', color: 'green', },
           //  { name: 'Health & Fitness', icon: 'car', color: 'green' },
            { name: 'Salons', icon: 'car', color: 'green' },

            { name: 'Entertainment', icon: 'car', color: 'green' },

            { name: 'Real Estate', icon: 'car', color: 'green' }
        ]

        categories.forEach(async(cat) => {
            const category = await this.categoryModel.findOne({ name: cat.name})
            if (!category) this.create(cat).catch((e) => console.log(e))
        })

    }

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

    async update(id: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoryModel.updateOne({ id }, createCategoryDto).exec();
    }
    async delete(id: string): Promise<{ deletedCount?: number }> {
        return this.categoryModel.deleteOne({ id }).exec();
    }
}
