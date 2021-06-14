import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {

  @IsString()
  @IsNotEmpty()
  emailOrNumber: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}