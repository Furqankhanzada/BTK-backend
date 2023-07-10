import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Member {
  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  userPhone: string;
}
const memberSchema = SchemaFactory.createForClass(Member);

@Schema({ timestamps: true })
export class BusinessMembers extends Document {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true, type: [memberSchema] })
  members: Member[];
}
export const businessMembersSchema = SchemaFactory.createForClass(BusinessMembers);
