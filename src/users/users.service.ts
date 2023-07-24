import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './users.schema';
import {
  AuthNewUserDto,
  PasswordUpdateDto,
  ProfileUpdateDto,
} from '../auth/auth-credentials.dto';
import { VerificationCodeDto } from '../auth/dto/verification-code.dto';
import { EmailService } from '../email/email.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
    private readonly filesService: FilesService,
    ) {}

  async findOne(_id: string): Promise<User | undefined> {
    return this.userModel.findOne({ _id }, { password: 0 });
  }

  async findOneByEmailOrNumber(
    emailOrNumber: string,
  ): Promise<User | undefined> {
    return this.userModel.findOne({
      $or: [{ email: emailOrNumber }, { phone: emailOrNumber }],
    });
  }

  async update(_id: string, profileUpdateDto: ProfileUpdateDto): Promise<User> {
    await this.userModel.updateOne({ _id }, profileUpdateDto).exec();
    return this.findOne(_id);
  }

  async setVerificationCode(
    _id: string,
    verificationCodeDto: VerificationCodeDto,
  ): Promise<User> {
    return this.userModel.updateOne({ _id }, verificationCodeDto).exec();
  }

  async removeVerificationCode(_id: string): Promise<User> {
    return this.userModel
      .updateOne({ _id }, { $set: { verification: null } })
      .exec();
  }

  async setPassword(
    _id: string,
    passwordUpdateDto: PasswordUpdateDto,
  ): Promise<User> {
    return this.userModel.updateOne({ _id }, passwordUpdateDto).exec();
  }

  async findAll({ query = {}, projection = {}, options = {} } = {}): Promise<
    User[]
  > {
    return this.userModel
      .find(query, projection, { sort: { order: 1 }, ...options })
      .exec();
  }

  async register(authNewUserDto: AuthNewUserDto) {
    const { password } = authNewUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...authNewUserDto,
      password: hashedPassword,
    });

    try {
      const user = await createdUser.save();

      await this.emailService.sendRawEmail({
        from: process.env.FROM,
        to: user.email,
        subject: 'Welcome to Explore BTK',
        html: `
            <h3>Welcome ${user.name}!</h3>
            <p>You have successfully registered your account.</p>
            `,
      });

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Phone number or Email address already exists',
        );
      }
      return error;
    }
  }
  async remove(id) {
    const user = await this.findOne(id);

    if (user?.avatar) {
      const avatarURL = new URL(user.avatar);
      this.filesService.deletePublicFile(avatarURL.pathname.replace(/^\/|\/$/g, ''));
    }

    return this.userModel.remove({ _id: id });
  }
}
