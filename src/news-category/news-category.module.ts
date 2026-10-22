import { Module } from '@nestjs/common';

import { NewsCategoryController } from './news-category.controller.js';
import { NewsCategoryService } from './news-category.service.js';

@Module({
  controllers: [NewsCategoryController],
  providers: [NewsCategoryService],
})
export class NewsCategoryModule {}