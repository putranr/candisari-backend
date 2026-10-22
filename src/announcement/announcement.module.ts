import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller.js';
import { AnnouncementService } from './announcement.service.js';

@Module({
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}