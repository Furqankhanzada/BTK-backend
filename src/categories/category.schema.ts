import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 0 })
  order: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
