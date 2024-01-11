import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
  endOfDay,
  format,
  startOfDay,
} from 'date-fns';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

import { UsersService } from '../users/users.service';
import { Invoice, InvoiceStatus } from './invoice.schema';
import { BusinessesService } from '../businesses/businesses.service';
import { PushNotificationsService } from '../notifications/push-notifications.service';
import { NotificationType } from '../notifications/notification.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/users.schema';

@Injectable()
export class InvoicesService {
  static readonly START_REMINDER_BEFORE_DAYS = 4;
  static readonly STATUS_UNPAID_BEFORE_DAYS = 7;
  private readonly logger = new Logger(InvoicesService.name);
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private readonly usersService: UsersService,
    private readonly businessesService: BusinessesService,
    private readonly pushNotificationsService: PushNotificationsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    const invoice = new this.invoiceModel(createInvoiceDto);
    return invoice.save();
  }

  findAll(filter: FilterQuery<Invoice>, options: QueryOptions<Invoice>) {
    return this.invoiceModel.find(filter, {}, options).exec();
  }
  getCount(filter: FilterQuery<Invoice>) {
    return this.invoiceModel.countDocuments(filter).exec();
  }
  findOne(_id: string) {
    return this.invoiceModel.findOne({ _id }).exec();
  }

  update(_id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceModel.findOneAndUpdate({ _id }, updateInvoiceDto);
  }

  remove(_id: string) {
    return this.invoiceModel.deleteOne({ _id });
  }
  markAsPaid(_id: string) {
    return this.invoiceModel
      .findOneAndUpdate({ _id }, { status: InvoiceStatus.PAID })
      .exec();
  }
  markAsUnpaid(_id: string) {
    return this.invoiceModel
      .findOneAndUpdate({ _id }, { status: InvoiceStatus.UNPAID })
      .exec();
  }
  currentInvoiceExist(ownerId: string, date: Date, startedAt: Date) {
    const { startDate, endDate } = this.calculateActiveMonthDates(
      date,
      startedAt,
    );

    return this.invoiceModel
      .findOne({
        ownerId,
        invoiceDueAt: { $gte: startDate, $lte: endDate },
      })
      .exec();
  }

  calculateActiveMonthDates(date: Date, startedAt: Date) {
    const diffInMonths = differenceInMonths(date, addDays(startedAt, -1));
    const startDate = startOfDay(addMonths(startedAt, diffInMonths));
    const endDate = endOfDay(
      addDays(addMonths(startedAt, diffInMonths + 1), -1),
    );
    return { startDate, endDate };
  }
  async sendNotification(
    user: User,
    title: string,
    message: string,
    link: string,
  ) {
    await this.pushNotificationsService.sendFirebaseMessage(user.fcmToken, {
      title,
      message,
      data: {
        deeplink: link,
      },
      type: NotificationType.USER,
    });
    await this.notificationsService.createNotification({
      userId: user._id,
      title,
      description: message,
      link,
    });
  }
  //TODO: send notification before 3 days every day till due date
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleInvoiceAndSendDueDateNotification(date = new Date()) {
    this.logger.debug('Called EVERY_DAY_AT_8AM');
    const users = await this.usersService.getActiveMembershipUsers(date);
    console.log('users', users.length);
    for (const user of users) {
      for (const membership of user.memberships) {
        const invoice = await this.currentInvoiceExist(
          user._id,
          date,
          membership.startedAt,
        );
        if (invoice) {
          const diffInDays = differenceInDays(invoice.invoiceDueAt, date);
          const link = `explorebtk://memberships/${invoice.business._id}/payments`;
          console.log('invoice present diffInDays', diffInDays);
          if (
            diffInDays <= InvoicesService.START_REMINDER_BEFORE_DAYS &&
            invoice.status !== InvoiceStatus.PAID
          ) {
            console.log('user : ', user._id);
            console.log('send notification : ', user.fcmToken);
            //TODO: Set user fcmTokens
            if (user.fcmToken) {
              const title = `${invoice.business.name} | 💰 Pay your Invoice`;
              const message = `${diffInDays} days left, Your due date is ${format(
                invoice.invoiceDueAt,
                'MMM io, yyyy',
              )}.`;
              await this.sendNotification(user, title, message, link);
            }
          }
          // Mark next month invoice unpaid before (STATUS_UNPAID_BEFORE_DAYS) *7 days
          if (
            diffInDays <= InvoicesService.STATUS_UNPAID_BEFORE_DAYS &&
            invoice.status === InvoiceStatus.PENDING
          ) {
            await this.markAsUnpaid(invoice._id);
            if (user.fcmToken) {
              const title = `${invoice.business.name} | 💰 Pay your Invoice`;
              const message = `Your next month invoice is ready to be paid, Your due date is ${format(
                invoice.invoiceDueAt,
                'MMM io, yyyy',
              )}.`;
              await this.sendNotification(user, title, message, link);
            }
          }
          continue;
        }
        const { endDate: invoiceDueAt } = this.calculateActiveMonthDates(
          date,
          membership.startedAt,
        );

        const business = await this.businessesService.getOne({
          _id: membership.businessId,
        });

        await this.create({
          ownerId: user._id,
          amount: membership.package.amount,
          invoiceDueAt,
          business: { ...business },
          package: membership.package,
        });
      }
    }
  }
}
