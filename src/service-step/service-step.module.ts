import { Module } from '@nestjs/common';
import { ServiceStepController } from './service-step.controller.js';
import { ServiceStepService } from './service-step.service.js';

@Module({
  controllers: [ServiceStepController],
  providers: [ServiceStepService]
})
export class ServiceStepModule {}
