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

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { HeroBannerService } from './hero-banner.service.js';
import { CreateHeroBannerDto } from './dto/create-hero-banner.dto.js';
import { UpdateHeroBannerDto } from './dto/update-hero-banner.dto.js';

@Controller('hero-banners')
export class HeroBannerController {
  constructor(
    private readonly heroBannerService: HeroBannerService,
  ) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  findAllAdmin() {
    return this.heroBannerService.findAllAdmin();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.heroBannerService.findOneAdmin(id);
  }

  @Get()
  findAll() {
    return this.heroBannerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.heroBannerService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() createData: CreateHeroBannerDto) {
    return this.heroBannerService.create(createData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateHeroBannerDto,
  ) {
    return this.heroBannerService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.heroBannerService.remove(id);
  }
}