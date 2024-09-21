import { Test, TestingModule } from '@nestjs/testing';
import { MembersFinderController } from './members-finder.controller';

describe('MembersFinderController', () => {
  let controller: MembersFinderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersFinderController],
    }).compile();

    controller = module.get<MembersFinderController>(MembersFinderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
