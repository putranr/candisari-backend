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
import { ServiceRequirementService } from './service-requirement.service.js';
import { CreateServiceRequirementDto } from './dto/create-service-requirement.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('service-requirement')
export class ServiceRequirementController {
  constructor(
    private readonly serviceRequirementService: ServiceRequirementService,
  ) {}

  @Get('service/:serviceId')
  async findAll(
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ) {
    const requirements =
      await this.serviceRequirementService.findAll(serviceId);

    return {
      success: true,
      message: 'Daftar persyaratan pelayanan berhasil diambil',
      data: requirements,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(@Body() createDto: CreateServiceRequirementDto) {
    const requirement =
      await this.serviceRequirementService.create(createDto);

    return {
      success: true,
      message: 'Persyaratan pelayanan berhasil dibuat',
      data: requirement,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateServiceRequirementDto>,
  ) {
    const requirement =
      await this.serviceRequirementService.update(id, updateData);

    return {
      success: true,
      message: 'Persyaratan pelayanan berhasil diperbarui',
      data: requirement,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const requirement =
      await this.serviceRequirementService.remove(id);

    return {
      success: true,
      message: 'Persyaratan pelayanan berhasil dihapus',
      data: requirement,
    };
  }
}