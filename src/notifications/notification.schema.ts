import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  date: string;

  @Prop()
  link: string;

  @Prop()
  type: string;

  @Prop()
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
