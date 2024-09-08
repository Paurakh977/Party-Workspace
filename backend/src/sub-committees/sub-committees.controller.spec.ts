import { Test, TestingModule } from '@nestjs/testing';
import { SubCommitteesController } from './sub-committees.controller';

describe('SubCommitteesController', () => {
  let controller: SubCommitteesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCommitteesController],
    }).compile();

    controller = module.get<SubCommitteesController>(SubCommitteesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
