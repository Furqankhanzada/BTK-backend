import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  telephone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop({ type: openHoursSchema })
  openHours: OpenHours[];

  @Prop({ type: priceRangeSchema })
  priceRange: PriceRange[];

  @Prop()
  established: Date;

  @Prop({ type: reviewSchema })
  reviews: Review[];

}

export const ContactSchema = SchemaFactory.createForClass(Contact);
