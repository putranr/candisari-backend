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

import { HomeSectionsService } from './home-sections.service.js';

import { CreateHomeSectionDto } from './dto/create-home-section.dto.js';
import { UpdateHomeSectionDto } from './dto/update-home-section.dto.js';
import { ScheduleHomeSectionDto } from './dto/schedule-home-section.dto.js';
import { ReorderHomeSectionsDto } from './dto/reorder-home-sections.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('home-sections')
export class HomeSectionsController {
  constructor(
    private readonly homeSectionsService: HomeSectionsService,
  ) {}

  // ============================================
  // GET ALL
  // ADMIN / DRAFT
  // ============================================
  @Get()
  async findAll() {
    return {
      success: true,
      data: await this.homeSectionsService.findAll(),
    };
  }

  // ============================================
  // GET PUBLIC / PUBLISHED
  // PUBLIC WEBSITE
  // ============================================
  @Get('public')
  async findPublished() {
    return {
      success: true,
      data: await this.homeSectionsService.findPublished(),
    };
  }

  // ============================================
  // GET PREVIEW
  // ADMIN / SUPER ADMIN
  // ============================================
  @Get('preview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findPreview() {
    return {
      success: true,
      data: await this.homeSectionsService.findPreview(),
    };
  }

  // ============================================
  // REORDER
  // ADMIN / SUPER ADMIN
  // ============================================
  @Post('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async reorder(
    @Body() dto: ReorderHomeSectionsDto,
  ) {
    return {
      success: true,
      message:
        'Urutan home section berhasil diperbarui',
      data:
        await this.homeSectionsService.reorder(dto),
    };
  }

  // ============================================
  // PUBLISH ARRANGEMENT
  // ADMIN / SUPER ADMIN
  // ============================================
  @Post('publish-arrangement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async publishArrangement() {
    return {
      success: true,
      message:
        'Susunan home section berhasil dipublikasikan',
      data:
        await this.homeSectionsService.publishArrangement(),
    };
  }

  // ============================================
  // GET BY ID
  // ============================================
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      success: true,
      data:
        await this.homeSectionsService.findOne(id),
    };
  }

  // ============================================
  // CREATE
  // ADMIN / SUPER ADMIN
  // ============================================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body() dto: CreateHomeSectionDto,
  ) {
    return {
      success: true,
      message:
        'Home section berhasil dibuat',
      data:
        await this.homeSectionsService.create(dto),
    };
  }

  // ============================================
  // UPDATE
  // ADMIN / SUPER ADMIN
  // ============================================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHomeSectionDto,
  ) {
    return {
      success: true,
      message:
        'Home section berhasil diperbarui',
      data:
        await this.homeSectionsService.update(
          id,
          dto,
        ),
    };
  }

  // ============================================
  // PUBLISH
  // ADMIN / SUPER ADMIN
  // ============================================
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async publish(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      success: true,
      message:
        'Home section berhasil diterbitkan',
      data:
        await this.homeSectionsService.publish(id),
    };
  }

  // ============================================
  // UNPUBLISH
  // ADMIN / SUPER ADMIN
  // ============================================
  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async unpublish(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      success: true,
      message:
        'Publikasi home section berhasil ditarik',
      data:
        await this.homeSectionsService.unpublish(id),
    };
  }

  // ============================================
  // SCHEDULE
  // ADMIN / SUPER ADMIN
  // ============================================
  @Post(':id/schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async schedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ScheduleHomeSectionDto,
  ) {
    return {
      success: true,
      message:
        'Home section berhasil dijadwalkan',
      data:
        await this.homeSectionsService.schedule(
          id,
          dto,
        ),
    };
  }

  // ============================================
  // DELETE
  // ADMIN / SUPER ADMIN
  // ============================================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      success: true,
      message:
        'Home section berhasil dihapus',
      data:
        await this.homeSectionsService.remove(id),
    };
  }
}