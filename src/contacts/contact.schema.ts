import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address } from '../users/users.schema';

export interface OpenHours {
  day: string,
  from: string,
  to: string
}

export interface PriceRange {
  from: string,
  to: string
}

@Schema({ timestamps: true })
export class Review {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  @Prop()
  user: object;
}

const reviewSchema = SchemaFactory.createForClass(Review);

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ required: true, index: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  tags: string[];

  @Prop({ required: true })
  address: Address;

  @Prop({ required: true })
  telephone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  openHours: OpenHours[];

  @Prop()
  priceRange: PriceRange[];

  @Prop()
  established: Date;

  @Prop({ type: reviewSchema })
  reviews: Review[];

}

export const ContactSchema = SchemaFactory.createForClass(Contact);
