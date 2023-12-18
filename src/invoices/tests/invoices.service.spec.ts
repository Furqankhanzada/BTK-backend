import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { InvoicesService } from '../invoices.service';
import { Invoice } from '../invoice.schema';
import { BusinessesService } from '../../businesses/businesses.service';
import { UsersService } from '../../users/users.service';
import { PushNotificationsService } from '../../notifications/push-notifications.service';
import { Model } from 'mongoose';
import membershipUsers from "./mocks/membershipUsers";

describe('InvoicesService', () => {
  let service: InvoicesService;
  let model: Model<Invoice>;
  let usersService: UsersService;
  let businessesService: BusinessesService;
  let pushNotificationsService: PushNotificationsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getModelToken(Invoice.name),
          useValue: createMock(Model<Invoice>),
        },
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        {
          provide: BusinessesService,
          useValue: createMock<BusinessesService>(),
        },
        {
          provide: PushNotificationsService,
          useValue: createMock<PushNotificationsService>(),
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
    usersService = module.get<UsersService>(UsersService);
    businessesService = module.get<BusinessesService>(BusinessesService);
    pushNotificationsService = module.get<PushNotificationsService>(
      PushNotificationsService,
    );
  });

  describe('handleInvoiceAndSendDueDateNotification', () => {
    it('should create invoice', async () => {
      jest.spyOn(usersService, 'getActiveMembershipUsers').mockResolvedValue(membershipUsers as unknown as any)
      jest.spyOn(service, 'currentInvoiceExist').mockResolvedValue(null)
      await service.handleInvoiceAndSendDueDateNotification();
      expect(usersService.getActiveMembershipUsers).toHaveBeenCalled();
      membershipUsers.forEach((user) => {
        user.memberships.forEach((membership) => {
          expect(service.currentInvoiceExist).toHaveBeenCalledWith({});
        })
      })
      // expect(model.create).toHaveBeenCalledWith({});
    });
  });
});
