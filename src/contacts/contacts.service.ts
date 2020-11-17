import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './contact.schema';
import { Model } from 'mongoose';
import { CreateContactDto } from './contact.dto';

@Injectable()
export class ContactsService {
    constructor(@InjectModel(Contact.name) private contactModel: Model<Contact>) {}

    async create(createContactDto: CreateContactDto): Promise<Contact> {
        const createdContact = new this.contactModel(createContactDto);
        try {
            return await createdContact.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Category with this name already exist!');
            }
            return error;
        }
    }

    async findAll({
                      query = {},
                      projection = {},
                      options = {}
                  } = {}
    ): Promise<Contact[]> {
        return this.contactModel.find(query, projection, { sort: { order: 1 }, ...options }).exec();
    }

    async findOne(_id: string): Promise<Contact> {
        return this.contactModel.findOne({ _id }).exec();
    }

    async update(id: string, createContactDto: CreateContactDto): Promise<Contact> {
        return this.contactModel.updateOne({ id }, {}).exec();
    }
    async delete(id: string): Promise<{ deletedCount?: number }> {
        return this.contactModel.deleteOne({ id }).exec();
    }
}
