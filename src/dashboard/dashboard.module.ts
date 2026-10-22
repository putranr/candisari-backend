import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { AnalyticsModule } from '../analytics/analytics.module.js';

@Module({
  imports: [
    AnalyticsModule,
  ],
  controllers: [
    DashboardController,
  ],
  providers: [
    DashboardService,
  ],
})
export class DashboardModule {}