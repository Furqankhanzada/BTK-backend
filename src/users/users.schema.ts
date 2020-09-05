import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AddressTypes {
  VILLA = 'VILLA',
  TOWER = 'TOWER',
}

export enum UserStatus {
  VERIFIED = 'VERIFIED',
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

interface Address {
  type: AddressTypes,
  unit: string,
  street: string,
  block: string
}

@Schema()
export class User extends Document {
  @Prop({ required: true, index: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, index: true, unique: true, trim: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  resident: boolean;

  @Prop()
  addresses: Address[];

  @Prop({ default: UserStatus.PENDING })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
