import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  image: string;

  @Prop()
  link: string;

  @Prop()
  type: string;

  @Prop()
  read: boolean;

  @Prop()
  ownerId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
