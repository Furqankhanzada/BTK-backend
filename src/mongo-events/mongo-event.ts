import mongoose from 'mongoose';

export abstract class MongoEvent<TDocument extends mongoose.Document> {
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
