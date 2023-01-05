import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class NotificationUser extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  notificationId: Types.ObjectId;

  @Prop()
  userId: string;

  @Prop()
  deviceUniqueId: string;

  @Prop()
  read: boolean;
}

export const NotificationUserSchema = SchemaFactory.createForClass(NotificationUser);
