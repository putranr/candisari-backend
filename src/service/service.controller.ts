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
import { ServiceService } from './service.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findAllAdmin() {
    return {
      success: true,
      message: 'Daftar pelayanan admin berhasil diambil',
      data: await this.serviceService.findAllAdmin(),
    };
  }

  @Get('admin/:slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findOneAdmin(@Param('slug') slug: string) {
    return {
      success: true,
      message: 'Detail pelayanan admin berhasil diambil',
      data: await this.serviceService.findOneAdmin(slug),
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      message: 'Daftar pelayanan berhasil diambil',
      data: await this.serviceService.findAll(),
    };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return {
      success: true,
      message: 'Detail pelayanan berhasil diambil',
      data: await this.serviceService.findOne(slug),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Req() req: any,
  ) {
    return {
      success: true,
      message: 'Pelayanan berhasil dibuat',
      data: await this.serviceService.create(
        createServiceDto,
        req.user.id,
      ),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateServiceDto>,
  ) {
    return {
      success: true,
      message: 'Pelayanan berhasil diperbarui',
      data: await this.serviceService.update(
        Number(id),
        updateData,
      ),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async remove(@Param('id') id: string) {
    return {
      success: true,
      message: 'Pelayanan berhasil dihapus',
      data: await this.serviceService.remove(Number(id)),
    };
  }
}