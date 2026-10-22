import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProfileSectionsService } from './profile-sections.service.js';
import { CreateProfileSectionDto } from './dto/create-profile-section.dto.js';
import { UpdateProfileSectionDto } from './dto/update-profile-section.dto.js';
import { ScheduleProfileSectionDto } from './dto/schedule-profile-section.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('profile-sections')
export class ProfileSectionsController {
  constructor(
    private readonly profileSectionsService: ProfileSectionsService,
  ) {}

  @Get('public')
  async findPublished() {
    return {
      success: true,
      message: 'Bagian profil berhasil diambil',
      data: await this.profileSectionsService.findPublished(),
    };
  }

  @Get('public/:slug')
  async findPublishedBySlug(@Param('slug') slug: string) {
    return {
      success: true,
      message: 'Detail bagian profil berhasil diambil',
      data: await this.profileSectionsService.findPublishedBySlug(slug),
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findAllAdmin() {
    return {
      success: true,
      message: 'Daftar bagian profil admin berhasil diambil',
      data: await this.profileSectionsService.findAllAdmin(),
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      message: 'Detail bagian profil berhasil diambil',
      data: await this.profileSectionsService.findOneAdmin(id),
    };
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(@Body() dto: CreateProfileSectionDto) {
    return {
      success: true,
      message: 'Bagian profil berhasil dibuat sebagai draf',
      data: await this.profileSectionsService.create(dto),
    };
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileSectionDto,
  ) {
    return {
      success: true,
      message: 'Bagian profil berhasil diperbarui',
      data: await this.profileSectionsService.update(id, dto),
    };
  }

  @Post('admin/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async publish(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      message: 'Bagian profil berhasil diterbitkan',
      data: await this.profileSectionsService.publish(id),
    };
  }

  @Post('admin/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async unpublish(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      message: 'Publikasi bagian profil berhasil ditarik',
      data: await this.profileSectionsService.unpublish(id),
    };
  }

  @Post('admin/:id/schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async schedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ScheduleProfileSectionDto,
  ) {
    return {
      success: true,
      message: 'Publikasi bagian profil berhasil dijadwalkan',
      data: await this.profileSectionsService.schedule(id, dto),
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      message: 'Bagian profil berhasil dihapus',
      data: await this.profileSectionsService.remove(id),
    };
  }
}
