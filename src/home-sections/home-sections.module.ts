import { Module } from '@nestjs/common';

import { HomeSectionsController } from './home-sections.controller.js';
import { HomeSectionsService } from './home-sections.service.js';
import { HomeSectionsScheduler } from './home-sections.scheduler.js';

@Module({
  controllers: [HomeSectionsController],
  providers: [
    HomeSectionsService,
    HomeSectionsScheduler,
  ],
  exports: [HomeSectionsService],
})
export class HomeSectionsModule {}