import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Package {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: string;
}
const packageSchema = SchemaFactory.createForClass(Package);

@Schema({ _id: false })
class Business {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  telephone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop({ required: true })
  address: string;
}
const businessSchema = SchemaFactory.createForClass(Business);

export enum InvoiceStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}
@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop()
  ownerId: string;

  @Prop()
  amount: number;

  @Prop({ required: true, type: packageSchema })
  package: Package;

  @Prop({ required: true, type: businessSchema })
  business: Business;

  @Prop({
    default: InvoiceStatus.UNPAID,
    enum: [InvoiceStatus.PAID, InvoiceStatus.UNPAID],
  })
  status?: InvoiceStatus;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
