import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller.js';
import { StatisticService } from './statistic.service.js';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService]
})
export class StatisticModule {}
