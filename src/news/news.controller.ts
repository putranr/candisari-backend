import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { NewsService } from './news.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { ScheduleNewsDto } from './dto/schedule-news.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findAllAdmin() {
    return {
      success: true,
      message: 'Daftar berita admin berhasil diambil',
      data: await this.newsService.findAllAdmin(),
    };
  }

  @Get('admin/:slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findOneAdmin(@Param('slug') slug: string) {
    return {
      success: true,
      message: 'Detail berita admin berhasil diambil',
      data: await this.newsService.findOneAdmin(slug),
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      message: 'Daftar berita berhasil diambil',
      data: await this.newsService.findAll(),
    };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return {
      success: true,
      message: 'Detail berita berhasil diambil',
      data: await this.newsService.findOne(slug),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @Req() req: any,
  ) {
    return {
      success: true,
      message: 'Berita berhasil dibuat sebagai draf',
      data: await this.newsService.create(
        createNewsDto,
        req.user.id,
      ),
    };
  }

  @Post(':id/schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async schedule(
    @Param('id') id: string,
    @Body() dto: ScheduleNewsDto,
  ) {
    return {
      success: true,
      message: 'Publikasi berita berhasil dijadwalkan',
      data: await this.newsService.schedule(Number(id), dto),
    };
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async publish(@Param('id') id: string) {
    return {
      success: true,
      message: 'Berita berhasil diterbitkan',
      data: await this.newsService.publish(Number(id)),
    };
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async unpublish(@Param('id') id: string) {
    return {
      success: true,
      message: 'Publikasi berita berhasil ditarik',
      data: await this.newsService.unpublish(Number(id)),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateNewsDto>,
  ) {
    return {
      success: true,
      message: 'Berita berhasil diperbarui',
      data: await this.newsService.update(Number(id), updateData),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async remove(@Param('id') id: string) {
    return {
      success: true,
      message: 'Berita berhasil dihapus',
      data: await this.newsService.remove(Number(id)),
    };
  }
}