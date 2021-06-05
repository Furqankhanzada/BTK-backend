import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  // currently we using raw as minimal usage
  async sendRawEmail(options): Promise<void> {
    console.log(process.env)
  await this.mailerService.sendMail(options)
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
        throw new BadRequestException('sorry, Something went wrong, please try again')
      });

  }
}
