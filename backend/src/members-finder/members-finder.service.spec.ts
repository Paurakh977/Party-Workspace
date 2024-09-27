import { Test, TestingModule } from '@nestjs/testing';
import { MembersFinderService } from './members-finder.service';

describe('MembersFinderService', () => {
  let service: MembersFinderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersFinderService],
    }).compile();

    service = module.get<MembersFinderService>(MembersFinderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
