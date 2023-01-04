import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class NotificationUser extends Document {
  @Prop({ required: true })
  notificationId: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  read: boolean;
}

export const NotificationUserSchema = SchemaFactory.createForClass(NotificationUser);
