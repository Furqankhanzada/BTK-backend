import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Package } from 'src/users/users.schema';

@Schema({ timestamps: true })
export class Invitation extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true, type: Package })
  package: Package;

  @Prop({ required: true })
  billingDate: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
