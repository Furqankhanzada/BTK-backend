import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import mongoose from 'mongoose';
import { MongoPostUpdateOneEvent } from './mongo-post-update-one-event';
import { MongoPostSaveEvent } from './mongo-post-save-event';

@Injectable()
export class MongoEventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  public forSchema<TDocument extends mongoose.Document>(
    modelName: string,
    schema: mongoose.Schema<TDocument>
  ) {
    const eventEmitter = this.eventEmitter;
    schema.post('save', async function (doc) {
      const _self = this as unknown as mongoose.Query<any, any>;
      const event = new MongoPostSaveEvent(modelName, doc, _self);
      eventEmitter.emit(event.event, event);
    });
    schema.post('updateOne', async function (doc) {
      const _self = this as unknown as mongoose.Query<any, any>;
      const event = new MongoPostUpdateOneEvent(modelName, doc, _self);
      eventEmitter.emit(event.event, event);
    });
    return schema;
  }
}
