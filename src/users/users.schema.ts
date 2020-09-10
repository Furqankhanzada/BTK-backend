import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AddressTypes {
  VILLA = 'VILLA',
  TOWER = 'TOWER',
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  VERIFIED = 'VERIFIED',
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}


@Schema() // _id for watermelon DB
export class Location  {
  @Prop({ required: true, enum: ['Point'] })
  type: string;

  @Prop({ required: true })
  coordinates: number[];
}
const locationSchema = SchemaFactory.createForClass(Location);

@Schema() // _id for watermelon DB
export class Address  {
  @Prop({ required: true, enum: [AddressTypes.VILLA, AddressTypes.TOWER] })
  type: string;

  @Prop()
  unit: string; // Precinct, Midway Commercial

  @Prop()
  street: string; // Road 2, or Street

  @Prop()
  house: string; // House or Flats in tower

  @Prop({ type: locationSchema })
  location: Location;
}
const addressSchema = SchemaFactory.createForClass(Address);


@Schema({ timestamps: true })
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

  @Prop({ type: [addressSchema] })
  addresses: Address[];

  @Prop({ default: UserStatus.PENDING, enum: [UserStatus.PENDING, UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.VERIFIED] })
  status: string;

  @Prop({ type: [String], default: [ Roles.USER ], enum: [Roles.ADMIN, Roles.USER] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
