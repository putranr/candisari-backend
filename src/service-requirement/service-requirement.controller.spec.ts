import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRequirementController } from './service-requirement.controller';

describe('ServiceRequirementController', () => {
  let controller: ServiceRequirementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceRequirementController],
    }).compile();

    controller = module.get<ServiceRequirementController>(ServiceRequirementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
