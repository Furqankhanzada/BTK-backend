import { Global, Injectable, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as mongoose from 'mongoose';

abstract class MongoEvent<TDocument extends mongoose.Document> {
  event: string;
  doc: TDocument;
  query: mongoose.Query<any, any>;

  protected constructor(
    event: string,
    doc: TDocument,
    query: mongoose.Query<any, any>
  ) {
    this.event = event;
    this.doc = doc;
    this.query = query;
  }
}

export class MongoPostUpdateOneEvent<
  TDocument extends mongoose.Document
> extends MongoEvent<TDocument> {
  constructor(
    modelName: string,
    doc: TDocument,
    query: mongoose.Query<any, any>
  ) {
    super(modelName + '.post.updateOne', doc, query);
  }
}

@Injectable()
export class MongoEvents {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public forSchema<TDocument extends mongoose.Document>(
    modelName: string,
    schema: mongoose.Schema<TDocument>
  ) {
    const eventEmitter = this.eventEmitter;
    schema.post('updateOne', async function (doc) {
      const _self = this as unknown as mongoose.Query<any, any>;
      const event = new MongoPostUpdateOneEvent(modelName, doc, _self);
      eventEmitter.emit(event.event, event);
    });
    return schema;
  }
}

@Global()
@Module({
  providers: [MongoEvents],
  exports: [MongoEvents]
})
export class MongoEventsModule {}
