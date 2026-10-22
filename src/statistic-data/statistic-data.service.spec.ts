import { Test, TestingModule } from '@nestjs/testing';
import { StatisticDataService } from './statistic-data.service';

describe('StatisticDataService', () => {
  let service: StatisticDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticDataService],
    }).compile();

    service = module.get<StatisticDataService>(StatisticDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
