import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum NotificationType {
  ANNOUNCEMENT = 'Announcement',
  BUSINESS = 'Business',
  REVIEW = 'Review',
  USER = 'User',
}

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

  @Prop(
    {
      default: NotificationType.ANNOUNCEMENT,
      enum: [
        NotificationType.ANNOUNCEMENT,
        NotificationType.BUSINESS,
        NotificationType.REVIEW,
        NotificationType.USER,
      ],
    }
  )
  type: string;

  @Prop()
  read: boolean;

  @Prop()
  ownerId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
