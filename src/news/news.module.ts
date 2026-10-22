import { Module } from '@nestjs/common';
import { NewsController } from './news.controller.js';
import { NewsService } from './news.service.js';
import { NewsScheduler } from './news.scheduler.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [NewsController],
  providers: [NewsService, NewsScheduler],
})
export class NewsModule {}