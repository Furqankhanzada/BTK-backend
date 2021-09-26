import mongoose from 'mongoose';
import { MongoEvent } from './mongo-event';

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
