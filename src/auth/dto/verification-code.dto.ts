import { IsString, IsNotEmpty, IsDate, ValidateNested, IsDefined } from 'class-validator';

export class Data {

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}

export class VerificationCodeDto {
  @ValidateNested({ each: true })
  @IsDefined()
  verification: Data;
}
