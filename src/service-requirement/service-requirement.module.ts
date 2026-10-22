import { Module } from '@nestjs/common';
import { ServiceRequirementController } from './service-requirement.controller.js';
import { ServiceRequirementService } from './service-requirement.service.js';

@Module({
  controllers: [ServiceRequirementController],
  providers: [ServiceRequirementService],
})
export class ServiceRequirementModule {}