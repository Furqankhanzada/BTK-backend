import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Package } from 'src/users/users.schema';

export class CreateInvitationDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsObject()
  @IsNotEmpty()
  package: Package;

  @IsString()
  @IsNotEmpty()
  billingDate: Date;
}
