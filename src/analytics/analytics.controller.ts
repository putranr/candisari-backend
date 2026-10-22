import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  // ==========================================
  // PUBLIC
  // Mencatat kunjungan website
  // ==========================================

  @Post('visits')
  async recordVisit(
    @Body()
    body: {
      path: string;
      sessionId?: string;
      userAgent?: string;
      ipHash?: string;
    },
  ) {
    const data =
      await this.analyticsService.recordVisit(body);

    return {
      success: true,
      message: 'Visit berhasil dicatat',
      data,
    };
  }

  // ==========================================
  // ADMIN / SUPER_ADMIN
  // Ringkasan analytics
  // ==========================================

  @Get('overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async getOverview() {
    return {
      success: true,
      data: await this.analyticsService.getOverview(),
    };
  }

  // ==========================================
  // ADMIN / SUPER_ADMIN
  // Semua data kunjungan
  // ==========================================

  @Get('visits')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async getVisits() {
    return {
      success: true,
      data: await this.analyticsService.getVisits(),
    };
  }
}