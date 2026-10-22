import {
  Body,
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { AdminInvitationsService } from './admin-invitations.service.js';
import { CreateAdminInvitationDto } from './dto/create-admin-invitation.dto.js';
import { AcceptAdminInvitationDto } from './dto/accept-admin-invitation.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('admin-invitations')
export class AdminInvitationsController {
  constructor(
    private readonly adminInvitationsService: AdminInvitationsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async createInvitation(
    @Body() dto: CreateAdminInvitationDto,
  ) {
    return {
      success: true,
      message: 'Undangan admin berhasil dikirim',
      data: await this.adminInvitationsService.createInvitation(dto),
    };
  }

  @Post('accept')
  async acceptInvitation(
    @Body() dto: AcceptAdminInvitationDto,
  ) {
    return {
      success: true,
      message: 'Password berhasil dibuat dan akun admin diaktifkan',
      data: await this.adminInvitationsService.acceptInvitation(dto),
    };
  }


  @Post(':adminId/resend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async resendInvitation(
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return {
      success: true,
      message: 'Undangan admin berhasil dikirim ulang',
      data: await this.adminInvitationsService.resendInvitation(adminId),
    };
  }
}