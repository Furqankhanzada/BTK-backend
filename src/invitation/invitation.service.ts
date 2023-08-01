import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, ConflictException } from '@nestjs/common';

import { CreateInvitationDto } from './invitation.dto';
import { Invitation } from './invitation.schema';

import { EmailService } from '../email/email.service';
import { BusinessesService } from '../businesses/businesses.service';

@Injectable()
export class InvitationService {
  constructor(
    private emailService: EmailService,
    private readonly businessesService: BusinessesService,
    @InjectModel(Invitation.name) private invitationModel: Model<Invitation>,
  ) {}

  async create(createInvitationDto: CreateInvitationDto) {
    //Check if invitation exists for current busienss
    const invitationExist = await this.invitationModel
      .findOne({
        email: createInvitationDto.email,
        businessId: createInvitationDto.businessId,
      })
      .exec();

    // Throw conflict if invitation exists
    if (invitationExist) {
      throw new ConflictException('Invitation already sent to this user.');
    }

    // Save Invitation in collection
    const invitation = new this.invitationModel({
      email: createInvitationDto.email,
      businessId: createInvitationDto.businessId,
      package: createInvitationDto.package,
      billingDate: createInvitationDto.billingDate,
    });
    await invitation.save();

    // Send Email to user
    const business = await this.businessesService.findOne(
      createInvitationDto.businessId,
    );
    await this.emailService.sendRawEmail({
      from: process.env.FROM,
      to: createInvitationDto.email,
      subject: `Join ${business.name}`,
      html: `
        <h3>Hi, ${createInvitationDto.email}</h3>
        <p>You are invited to join ${business.name}, Please <a href="http://onelink.to/xwhffr">Download the Explore BTK</a> and register your account with same email: ${createInvitationDto.email}</p>
        `,
    });

    return { message: 'invitation-sent' };
  }
}
