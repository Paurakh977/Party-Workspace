import { Test, TestingModule } from '@nestjs/testing';
import { SubLevelService } from './sub-level.service';

describe('SubLevelService', () => {
  let service: SubLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubLevelService],
    }).compile();

    service = module.get<SubLevelService>(SubLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
