import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { Payment } from './payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const createdPayment = new this.paymentModel(createPaymentDto);
    return await createdPayment.save();
  }

  async findOne(id: string) {
    return this.paymentModel.findById(id).exec();
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentModel.findByIdAndUpdate(id, updatePaymentDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return this.paymentModel.findByIdAndRemove(id).exec();
  }
}
