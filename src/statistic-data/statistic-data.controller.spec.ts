import { Test, TestingModule } from '@nestjs/testing';
import { StatisticDataController } from './statistic-data.controller';

describe('StatisticDataController', () => {
  let controller: StatisticDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticDataController],
    }).compile();

    controller = module.get<StatisticDataController>(StatisticDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
