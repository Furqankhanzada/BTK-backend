import mongoose from 'mongoose';
import { MongoEvent } from './mongo-event';

export class MongoPostSaveEvent<
  TDocument extends mongoose.Document
> extends MongoEvent<TDocument> {
  constructor(
    modelName: string,
    doc: TDocument,
    query: mongoose.Query<any, any>
  ) {
    super(modelName + '.post.save', doc, query);
  }
}
