import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { addDays, endOfDay, startOfDay } from 'date-fns';

import { MembershipStatus, User } from './users.schema';
import {
  AuthNewUserDto,
  PasswordUpdateDto,
  ProfileUpdateDto,
} from '../auth/auth-credentials.dto';
import { VerificationCodeDto } from '../auth/dto/verification-code.dto';
import { EmailService } from '../email/email.service';
import { FilesService } from '../files/files.service';
import { Invitation } from '../invitation/invitation.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) public userModel: Model<User>,
    @InjectModel(Invitation.name) private invitationModel: Model<Invitation>,
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
    return this.userModel.findOneAndUpdate({ _id }, profileUpdateDto).exec();
  }

  async setVerificationCode(
    _id: string,
    verificationCodeDto: VerificationCodeDto,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate({ _id }, verificationCodeDto).exec();
  }

  async removeVerificationCode(_id: string): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ _id }, { $set: { verification: null } })
      .exec();
  }

  async setPassword(
    _id: string,
    passwordUpdateDto: PasswordUpdateDto,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate({ _id }, passwordUpdateDto).exec();
  }

  async findAll({ query = {}, projection = {}, options = {} } = {}): Promise<
    User[]
  > {
    return this.userModel
      .find(query, projection, { sort: { order: 1 }, ...options })
      .exec();
  }

  async register(authNewUserDto: AuthNewUserDto) {
    const { password, email } = authNewUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...authNewUserDto,
      password: hashedPassword,
    });

    // Check if the user's email address exists in the invitations collection
    const invitation = await this.invitationModel.findOne({ email }).exec();

    if (invitation) {
      // Invitation found, add the membership to the user

      const membership = {
        businessId: invitation.businessId,
        email: invitation.email,
        package: invitation.package,
        billingDate: invitation.billingDate,
      };

      createdUser.memberships.push(membership);
    }

    try {
      const createUser = await createdUser.save();

      await this.emailService.sendWelcomeMail(
        createUser.name,
        createUser.email,
      );

      await this.invitationModel.deleteOne({ _id: invitation._id }).exec();

      return createUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Phone number or Email address already exists',
        );
      }
      return error;
    }
  }
  async remove(id: string) {
    const user = await this.findOne(id);

    if (user?.avatar) {
      const avatarURL = new URL(user.avatar);
      this.filesService.deletePublicFile(
        avatarURL.pathname.replace(/^\/|\/$/g, ''),
      );
    }

    return this.userModel.deleteOne({ _id: id });
  }
  getActiveMembershipUsersWhichDueSoon(date = new Date(), beforeDays = 3) {
    const futureDate = addDays(date, beforeDays);
    return this.userModel.find({
      'memberships.billingDate': {
        $gte: startOfDay(date),
        $lte: endOfDay(futureDate),
      },
      'memberships.status': MembershipStatus.ACTIVE,
    });
  }
}
