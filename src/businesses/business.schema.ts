import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Location, locationSchema } from '../users/users.schema';

@Schema()
export class OpenHours {
  @Prop()
  day: string;

  @Prop()
  from: string;

  @Prop()
  to: string;
}
const openHoursSchema = SchemaFactory.createForClass(OpenHours);

@Schema()
export class PriceRange {
  @Prop()
  from: string;

  @Prop()
  to: string;
}
const priceRangeSchema = SchemaFactory.createForClass(PriceRange);


@Schema()
export class ReviewUser {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  avatar: string;
}
const reviewUserSchema = SchemaFactory.createForClass(ReviewUser);

@Schema({ timestamps: true })
export class Review {
  @Prop()
  title: string;

  @Prop()
  description?: string;

  @Prop()
  rating: number;

  @Prop({ default: false })
  disable?: boolean;

  @Prop({ type: reviewUserSchema })
  owner: ReviewUser;
}
const reviewSchema = SchemaFactory.createForClass(Review);

@Schema({ timestamps: true })
export class Business extends Document {
  @Prop({ required: true, index: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  tags: string[];

  @Prop({ required: true })
  telephone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: locationSchema })
  location: Location;

  @Prop({ type: [openHoursSchema] })
  openHours: OpenHours[];

  @Prop({ type: priceRangeSchema })
  priceRange: PriceRange[];

  @Prop()
  established: Date;

  @Prop({ type: [reviewSchema] })
  reviews: Review[];

  @Prop({ required: true })
  ownerId: string

  @Prop({ default: 0 })
  views: number
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
