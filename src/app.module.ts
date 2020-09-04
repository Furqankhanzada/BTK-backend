import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb+srv://mobile:ZYlTXYmnk4ijJJlS@cluster0.sk8if.mongodb.net/btk-dev?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
