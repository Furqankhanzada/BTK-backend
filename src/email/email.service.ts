import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from '../users/users.schema';

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

  async sendRawEmail(options): Promise<void> {
    console.log(process.env);
    await this.mailerService
      .sendMail(options)
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
        throw new BadRequestException(
          'sorry, Something went wrong, please try again',
        );
      });
  }
}
