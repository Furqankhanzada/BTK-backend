import { Test, TestingModule } from '@nestjs/testing';
import { BusinessMembersController } from './business-members.controller';
import { BusinessMembersService } from './business-members.service';

describe('BusinessMembersController', () => {
  let controller: BusinessMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessMembersController],
      providers: [BusinessMembersService],
    }).compile();

    controller = module.get<BusinessMembersController>(BusinessMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
