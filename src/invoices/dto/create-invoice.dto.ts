import { IsDate, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { Business, Package } from '../invoice.schema';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsMongoId()
  ownerId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDate()
  invoiceDueAt: Date;

  @IsNotEmpty()
  business: Business;

  @IsNotEmpty()
  package: Package;
}
