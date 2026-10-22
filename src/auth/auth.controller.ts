import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() body: {
      email: string;
      password: string;
    },
  ) {
    const result = await this.authService.login(
      body.email,
      body.password,
    );

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        id: result.admin.id,
        name: result.admin.name,
        email: result.admin.email,
        role: result.admin.role,
      },
      access_token: result.accessToken,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  getProfile(@Req() req: any) {
    return {
      success: true,
      message: 'Token valid',
      data: req.user,
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async changePassword(
    @Req() req: any,
    @Body() dto: ChangePasswordDto,
  ) {
    const result = await this.authService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );

    return {
      success: true,
      message: 'Password berhasil diubah',
      data: result,
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ) {
    const result = await this.authService.forgotPassword(
      dto.email,
    );

    return {
      success: true,
      ...result,
    };
  }

  @Post('reset-password')
    async resetPassword(
      @Body() dto: ResetPasswordDto,
    ) {
      const result = await this.authService.resetPassword(
        dto.token,
        dto.newPassword,
      );

      return {
        success: true,
        message: 'Password berhasil direset',
        data: result,
      };
    }
}
