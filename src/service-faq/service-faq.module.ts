import { Module } from '@nestjs/common';
import { ServiceFaqController } from './service-faq.controller.js';
import { ServiceFaqService } from './service-faq.service.js';

@Module({
  controllers: [ServiceFaqController],
  providers: [ServiceFaqService]
})
export class ServiceFaqModule {}
