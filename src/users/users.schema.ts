import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AddressTypes {
  VILLA = 'VILLA',
  TOWER = 'TOWER',
  SCHOOL = 'SCHOOL',
  HOSPITAL = 'HOSPITAL',
  MOSQUE = 'MOSQUE',
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

export enum MembershipStatus {
  ACTIVE = 'active',
  ARCHIVE = 'archive',
}

@Schema() // _id for watermelon DB
export class Location {
  @Prop({ required: true, enum: ['Point'] })
  type: string;

  @Prop({ required: true })
  coordinates: number[];
}
export const locationSchema = SchemaFactory.createForClass(Location);

@Schema() // _id for watermelon DB
export class Address {
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

// verification code object
@Schema()
export class verificationCode {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  createdAt: Date;
}

@Schema({ _id: false })
export class Package {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'Monthly' })
  duration: string;
}
const packageSchema = SchemaFactory.createForClass(Package);

@Schema({ _id: false })
export class Membership {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: packageSchema })
  package: Package;

  @Prop({ required: true })
  billingDate: Date;

  @Prop({
    default: MembershipStatus.ACTIVE,
    enum: [MembershipStatus.ACTIVE, MembershipStatus.ARCHIVE],
  })
  status?: MembershipStatus;
}
const membershipSchema = SchemaFactory.createForClass(Membership);

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

  @Prop()
  avatar: string;

  @Prop()
  fcmToken: string;

  @Prop({ default: true })
  resident: boolean;

  @Prop({ type: [addressSchema] })
  addresses: Address[];

  @Prop({ type: [membershipSchema] })
  memberships: Membership[];

  @Prop({
    default: UserStatus.PENDING,
    enum: [
      UserStatus.PENDING,
      UserStatus.ACTIVE,
      UserStatus.BLOCKED,
      UserStatus.VERIFIED,
    ],
  })
  status: string;

  @Prop({
    type: [String],
    default: [Roles.USER],
    enum: [Roles.ADMIN, Roles.USER],
  })
  roles: string[];

  @Prop({ type: verificationCode })
  verification: verificationCode;
}

export const UserSchema = SchemaFactory.createForClass(User);
