import { Module } from '@nestjs/common';

import { OrganizationMemberController } from './organization-member.controller.js';
import { OrganizationMemberService } from './organization-member.service.js';

@Module({
  controllers: [OrganizationMemberController],
  providers: [OrganizationMemberService],
})
export class OrganizationMemberModule {}
