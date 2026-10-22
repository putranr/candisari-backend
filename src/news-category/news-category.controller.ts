import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { NewsCategoryService } from './news-category.service.js';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto.js';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('news-categories')
export class NewsCategoryController {
  constructor(
    private readonly newsCategoryService: NewsCategoryService,
  ) {}

  @Get()
  async findAll() {
    const categories =
      await this.newsCategoryService.findAll();

    return {
      success: true,
      message: 'Daftar kategori berita berhasil diambil',
      data: categories,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category =
      await this.newsCategoryService.findOne(Number(id));

    return {
      success: true,
      message: 'Detail kategori berita berhasil diambil',
      data: category,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(
    @Body() createNewsCategoryDto: CreateNewsCategoryDto,
  ) {
    const category =
      await this.newsCategoryService.create(
        createNewsCategoryDto,
      );

    return {
      success: true,
      message: 'Kategori berita berhasil dibuat',
      data: category,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNewsCategoryDto: UpdateNewsCategoryDto,
  ) {
    const category =
      await this.newsCategoryService.update(
        Number(id),
        updateNewsCategoryDto,
      );

    return {
      success: true,
      message: 'Kategori berita berhasil diperbarui',
      data: category,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const category =
      await this.newsCategoryService.remove(Number(id));

    return {
      success: true,
      message: 'Kategori berita berhasil dihapus',
      data: category,
    };
  }
}