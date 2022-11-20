import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Location, locationSchema } from '../users/users.schema';

export enum BusinessStatus {
  VERIFIED = 'VERIFIED',
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

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
export class Gallery {
  @Prop()
  image: string;

  @Prop({ default: false })
  cover: boolean;
}
const gallerySchema = SchemaFactory.createForClass(Gallery);

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

@Schema({ _id: false })
export class Facilities {
  @Prop()
  name: string;

  @Prop()
  icon: string;
}
const facilitiesSchema = SchemaFactory.createForClass(Facilities);

@Schema({ _id: false })
export class Favorite {
  @Prop()
  ownerId: string;
}
const favoriteSchema = SchemaFactory.createForClass(Favorite);

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

  @Prop()
  telephone: string;

  @Prop()
  email: string;

  @Prop({ type: [favoriteSchema] })
  favorites: Favorite[];

  @Prop()
  website: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: locationSchema, index: '2dsphere' })
  location: Location;

  @Prop({ type: [openHoursSchema] })
  openHours: OpenHours[];

  @Prop({ type: priceRangeSchema })
  priceRange: PriceRange[];

  @Prop()
  established: Date;

  @Prop({ type: [reviewSchema] })
  reviews: Review[];

  @Prop({ type: [facilitiesSchema] })
  facilities: Facilities[];

  @Prop({ required: true })
  ownerId: string;

  @Prop({ default: 0 })
  views: number;

  @Prop()
  thumbnail: string;

  @Prop({ type: [gallerySchema] })
  gallery: Gallery[];

  @Prop({
    default: BusinessStatus.PENDING,
    enum: [
      BusinessStatus.PENDING,
      BusinessStatus.ACTIVE,
      BusinessStatus.BLOCKED,
      BusinessStatus.VERIFIED,
    ],
  })
  status: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
