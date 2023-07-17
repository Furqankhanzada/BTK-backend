import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum StatusType {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  package: string;

  @Prop({
    default: StatusType.UNPAID,
    enum: [StatusType.PAID, StatusType.UNPAID],
  })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
