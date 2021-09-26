import { Global, Module } from '@nestjs/common';
import { MongoEventsService } from './mongo-events.service';

@Global()
@Module({
  providers: [MongoEventsService],
  exports: [MongoEventsService]
})
export class MongoEventsModule {}
