import { Controller, Get, UseGuards } from '@nestjs/common';

import { ActivityLogsService } from './activity-logs.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class ActivityLogsController {
  constructor(
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  @Get()
  async findAll() {
    return {
      success: true,
      data: await this.activityLogsService.findAll(),
    };
  }
}
