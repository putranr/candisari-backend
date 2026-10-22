import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AnnouncementService } from './announcement.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('announcement')
export class AnnouncementController {
  constructor(
    private readonly announcementService: AnnouncementService,
  ) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findAllAdmin() {
    return {
      success: true,
      message: 'Daftar pengumuman admin berhasil diambil',
      data: await this.announcementService.findAllAdmin(),
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      message: 'Detail pengumuman admin berhasil diambil',
      data: await this.announcementService.findOneAdmin(id),
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      message: 'Daftar pengumuman berhasil diambil',
      data: await this.announcementService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      message: 'Detail pengumuman berhasil diambil',
      data: await this.announcementService.findOne(id),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @Req() req: any,
  ) {
    return {
      success: true,
      message: 'Pengumuman berhasil dibuat',
      data: await this.announcementService.create(
        createAnnouncementDto,
        req.user.id,
      ),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateAnnouncementDto>,
  ) {
    return {
      success: true,
      message: 'Pengumuman berhasil diperbarui',
      data: await this.announcementService.update(id, updateData),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      message: 'Pengumuman berhasil dihapus',
      data: await this.announcementService.remove(id),
    };
  }
}