import { Test, TestingModule } from '@nestjs/testing';
import { SubLevelController } from './sub-level.controller';

describe('SubLevelController', () => {
  let controller: SubLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubLevelController],
    }).compile();

    controller = module.get<SubLevelController>(SubLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
