import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.schema';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { BusinessesModule } from '../businesses/businesses.module'

@Module({
    imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]), BusinessesModule],
    providers: [CategoriesService],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
