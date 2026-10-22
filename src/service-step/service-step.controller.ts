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
import { ServiceStepService } from './service-step.service.js';
import { CreateServiceStepDto } from './dto/create-service-step.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('service-step')
export class ServiceStepController {
  constructor(
    private readonly serviceStepService: ServiceStepService,
  ) {}

  @Get('service/:serviceId')
  async findAll(
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ) {
    const steps =
      await this.serviceStepService.findAll(serviceId);

    return {
      success: true,
      message: 'Daftar langkah pelayanan berhasil diambil',
      data: steps,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(@Body() createDto: CreateServiceStepDto) {
    const step =
      await this.serviceStepService.create(createDto);

    return {
      success: true,
      message: 'Langkah pelayanan berhasil dibuat',
      data: step,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateServiceStepDto>,
  ) {
    const step =
      await this.serviceStepService.update(id, updateData);

    return {
      success: true,
      message: 'Langkah pelayanan berhasil diperbarui',
      data: step,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const step =
      await this.serviceStepService.remove(id);

    return {
      success: true,
      message: 'Langkah pelayanan berhasil dihapus',
      data: step,
    };
  }
}