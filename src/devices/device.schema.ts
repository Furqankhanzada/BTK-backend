import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Device extends Document {
  @Prop({ required: true })
  deviceUniqueId: string;

  @Prop({ required: true })
  fcmToken: string;

  @Prop({ required: true })
  os: string;

  @Prop({ required: true })
  osVersion: string;

  @Prop()
  userId: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
