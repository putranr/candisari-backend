import { Test, TestingModule } from '@nestjs/testing';
import { ServiceStepController } from './service-step.controller.js';

describe('ServiceStepController', () => {
  let controller: ServiceStepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceStepController],
    }).compile();

    controller = module.get<ServiceStepController>(ServiceStepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
