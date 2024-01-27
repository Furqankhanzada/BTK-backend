import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ _id: false })
export class Package {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: string;
}
const packageSchema = SchemaFactory.createForClass(Package);

@Schema({ _id: false })
export class Business {
  @Prop({ type: SchemaTypes.ObjectId })
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  telephone?: string;

  @Prop()
  email?: string;

  @Prop()
  website?: string;

  @Prop({ required: true })
  address: string;
}
const businessSchema = SchemaFactory.createForClass(Business);

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  UNPAID = 'unpaid',
}
@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ requited: true, type: SchemaTypes.ObjectId })
  ownerId: Types.ObjectId;

  @Prop({ requited: true })
  amount: number;

  @Prop()
  paidAt: Date;

  @Prop({ requited: true })
  invoiceDueAt: Date;

  @Prop({ required: true, type: packageSchema })
  package: Package;

  @Prop({ required: true, type: businessSchema })
  business: Business;

  @Prop({
    default: InvoiceStatus.PENDING,
    enum: [InvoiceStatus.PAID, InvoiceStatus.UNPAID, InvoiceStatus.PENDING],
  })
  status?: InvoiceStatus;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
