import { Test, TestingModule } from '@nestjs/testing';
import { ServiceFaqController } from './service-faq.controller';

describe('ServiceFaqController', () => {
  let controller: ServiceFaqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceFaqController],
    }).compile();

    controller = module.get<ServiceFaqController>(ServiceFaqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
