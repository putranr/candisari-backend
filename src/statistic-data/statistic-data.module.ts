import { Module } from '@nestjs/common';
import { StatisticDataController } from './statistic-data.controller.js';
import { StatisticDataService } from './statistic-data.service.js';

@Module({
  controllers: [StatisticDataController],
  providers: [StatisticDataService]
})
export class StatisticDataModule {}
