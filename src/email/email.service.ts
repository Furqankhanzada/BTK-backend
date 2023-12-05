import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from '../users/users.schema';
import { Business } from '../businesses/business.schema';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  sendForgotPasswordMail(user: User, code: number) {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      template: './forgot-password', // `.hbs` extension is appended automatically
      context: {
        name: user.name,
        code,
      },
    });
  }
  sendInvitationToJoinBusiness(business: Business, to: string) {
    return this.mailerService.sendMail({
      to,
      subject: `Join ${business.name}`,
      template: './business-invitation',
      context: {
        businessName: business.name,
        email: to,
      },
    });
  }
  sendWelcomeMail(name: string, to: string) {
    return this.mailerService.sendMail({
      to,
      subject: `Welcome to Explore BTK`,
      template: './welcome',
      context: {
        name,
      },
    });
  }
}
