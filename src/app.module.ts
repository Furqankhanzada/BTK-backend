import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PlacesModule } from './places/places.module';
import { BusinessesModule } from './businesses/businesses.module';
import { TagsModule } from './tags/tags.module';
import { FilesModule } from './files/files.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local']
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.sk8if.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
    ),
    MailerModule.forRoot({
      transport: {
        host: process.env.SESHOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.SESUSER,
          pass: process.env.SESPASSWORD
        }
      },
      defaults: {
        from: process.env.FROM
      }
    }),
    CategoriesModule,
    AuthModule,
    UsersModule,
    PlacesModule,
    BusinessesModule,
    TagsModule,
    FilesModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
