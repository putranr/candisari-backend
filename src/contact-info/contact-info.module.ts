import { Module } from '@nestjs/common';

import { ContactInfoController } from './contact-info.controller.js';
import { ContactInfoService } from './contact-info.service.js';

@Module({
  controllers: [ContactInfoController],
  providers: [ContactInfoService],
})
export class ContactInfoModule {}
