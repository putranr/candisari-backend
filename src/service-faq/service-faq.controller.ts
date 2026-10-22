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
import { ServiceFaqService } from './service-faq.service.js';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('service-faq')
export class ServiceFaqController {
  constructor(
    private readonly serviceFaqService: ServiceFaqService,
  ) {}

  @Get('service/:serviceId')
  async findAll(
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ) {
    const faqs =
      await this.serviceFaqService.findAll(serviceId);

    return {
      success: true,
      message: 'Daftar FAQ pelayanan berhasil diambil',
      data: faqs,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(@Body() createDto: CreateServiceFaqDto) {
    const faq =
      await this.serviceFaqService.create(createDto);

    return {
      success: true,
      message: 'FAQ pelayanan berhasil dibuat',
      data: faq,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateServiceFaqDto>,
  ) {
    const faq =
      await this.serviceFaqService.update(id, updateData);

    return {
      success: true,
      message: 'FAQ pelayanan berhasil diperbarui',
      data: faq,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const faq =
      await this.serviceFaqService.remove(id);

    return {
      success: true,
      message: 'FAQ pelayanan berhasil dihapus',
      data: faq,
    };
  }
}