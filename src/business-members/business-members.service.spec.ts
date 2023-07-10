import { Test, TestingModule } from '@nestjs/testing';
import { BusinessMembersService } from './business-members.service';

describe('BusinessMembersService', () => {
  let service: BusinessMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessMembersService],
    }).compile();

    service = module.get<BusinessMembersService>(BusinessMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
