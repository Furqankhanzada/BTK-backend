import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PlaceTypes {
  VILLA = 'VILLA',
  TOWER = 'TOWER',
  SCHOOL = 'SCHOOL',
  HOSPITAL = 'HOSPITAL',
  MOSQUE = 'MOSQUE',
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
export class Place extends Document {
  @Prop({ required: true, enum: [PlaceTypes.VILLA, PlaceTypes.TOWER] })
  type: string;

  @Prop()
  town: string; // Precinct, Midway Commercial

  @Prop()
  unit: string; // Precinct, Midway Commercial

  @Prop()
  street: string; // Road 2, or Street

  @Prop()
  house: string; // House or Flats in tower

  @Prop()
  formatted_address: string // House 1491, Road 2 Precinct 10A, Bahria Town Karachi | Marhaba Supermarket, Road 2 Precinct 10A Bahria Town Karachi

  @Prop({ type: locationSchema })
  location: Location;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
