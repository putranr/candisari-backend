import { Module } from '@nestjs/common';

import { HeroBannerController } from './hero-banner.controller.js';
import { HeroBannerService } from './hero-banner.service.js';

@Module({
  controllers: [HeroBannerController],
  providers: [HeroBannerService],
})
export class HeroBannerModule {}
