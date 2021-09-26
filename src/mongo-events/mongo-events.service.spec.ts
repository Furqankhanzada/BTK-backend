import { Test, TestingModule } from '@nestjs/testing';
import { MongoEventsService } from './mongo-events.service';

describe('MongoEventsService', () => {
  let service: MongoEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoEventsService],
    }).compile();

    service = module.get<MongoEventsService>(MongoEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
