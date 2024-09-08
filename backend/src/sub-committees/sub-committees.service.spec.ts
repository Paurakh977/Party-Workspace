import { Test, TestingModule } from '@nestjs/testing';
import { SubCommitteesService } from './sub-committees.service';

describe('SubCommitteesService', () => {
  let service: SubCommitteesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubCommitteesService],
    }).compile();

    service = module.get<SubCommitteesService>(SubCommitteesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
