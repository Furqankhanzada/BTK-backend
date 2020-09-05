import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.development.local'],
      }),
      MongooseModule.forRoot(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.sk8if.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`),
      CategoriesModule,
      AuthModule,
      UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
