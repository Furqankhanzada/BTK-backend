import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb+srv://mobile:ZYlTXYmnk4ijJJlS@cluster0.sk8if.mongodb.net/btk-dev?retryWrites=true&w=majority'),
      CategoriesModule,
      AuthModule,
      UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
