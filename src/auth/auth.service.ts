import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { AuthNewUserDto, AuthCredentialsDto } from './auth-credentials.dto';
import { User } from '../users/users.schema';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.usersService.findOneByEmailOrNumber(
      authCredentialsDto.emailOrNumber,
    );

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(
      authCredentialsDto.password,
      user.password,
    );
    if (valid) {
      return { user, authCredentialsDto };
    }

    return null;
  }

  async login({
    user,
    authCredentialsDto,
  }: {
    user: User;
    authCredentialsDto: AuthCredentialsDto;
  }) {
    const payload = {
      emailOrNumber: authCredentialsDto.emailOrNumber,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(authNewUserDto: AuthNewUserDto) {
    return this.usersService.register(authNewUserDto);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findOneByEmailOrNumber(
      forgotPasswordDto.emailOrNumber,
    );

    if (!user) {
      throw new BadRequestException('Invalid User');
    }
    // TODO: also check user active status when implemented by admin
    // if(user.status !== UserStatus.ACTIVE){
    //     throw new MethodNotAllowedException()
    // }

    // now generate code and save in user doc
    const sixDigitRandomCode = Math.floor(100000 + Math.random() * 900000);
    const hashSixDigitRandomCode = await bcrypt.hash(
      `${user.phone}-${sixDigitRandomCode}`,
      10,
    );
    await this.usersService.setVerificationCode(user._id, {
      verification: {
        code: hashSixDigitRandomCode,
        createdAt: new Date(),
      },
    });

    // send verification code vs email
    return await this.emailService.sendForgotPasswordMail(
      user,
      sixDigitRandomCode,
    );
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto): Promise<any> {
    //Find User existence, if not found return error
    const user = await this.usersService.findOneByEmailOrNumber(
      verifyCodeDto.emailOrNumber,
    );
    if (!user) {
      throw new BadRequestException('Invalid User');
    }

    // verification code not found or already used
    if (!user?.verification?.code) {
      throw new BadRequestException(
        'Looks like verification code has expired.',
      );
    }

    //Find Verification Code and 10 minutes time difference
    const { code, createdAt } = user.verification;
    let minutesDifference = (new Date().getTime() - createdAt.getTime()) / 1000;
    minutesDifference = Math.abs(minutesDifference / 60);
    if (minutesDifference >= 10) {
      // if more then 10 minutes passed throw error
      throw new BadRequestException(
        'Looks like verification code has expired.',
      );
    }

    // verify code
    if (!(await bcrypt.compare(`${user.phone}-${verifyCodeDto.code}`, code))) {
      throw new BadRequestException('Invalid verification code');
    }

    //remove verification code as it's used now
    await this.usersService.removeVerificationCode(user._id);

    // verified successfully! lets return token
    const payload = {
      emailOrNumber: verifyCodeDto.emailOrNumber,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(changePasswordDto.password, 10);

    return this.usersService.setPassword(userId, { password: hashedPassword });
  }
}
