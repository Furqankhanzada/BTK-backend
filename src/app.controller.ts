import { initializeApp, cert } from 'firebase-admin/app';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    initializeApp({
      credential: cert(JSON.parse(process.env.GOOGLE_ACCOUNT_CREDENTIALS)),
    });
  }
}
