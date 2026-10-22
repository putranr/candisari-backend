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

import { StatisticService } from './statistic.service.js';
import { CreateStatisticDto } from './dto/create-statistic.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('statistic')
export class StatisticController {
  constructor(
    private readonly statisticService: StatisticService,
  ) {}

  @Get()
  async findAll() {
    const statistics =
      await this.statisticService.findAll();

    return {
      success: true,
      message: 'Daftar statistik berhasil diambil',
      data: statistics,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const statistic =
      await this.statisticService.findOne(id);

    return {
      success: true,
      message: 'Detail statistik berhasil diambil',
      data: statistic,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(
    @Body() createStatisticDto: CreateStatisticDto,
  ) {
    const statistic =
      await this.statisticService.create(
        createStatisticDto,
      );

    return {
      success: true,
      message: 'Statistik berhasil dibuat',
      data: statistic,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateStatisticDto>,
  ) {
    const statistic =
      await this.statisticService.update(
        id,
        updateData,
      );

    return {
      success: true,
      message: 'Statistik berhasil diperbarui',
      data: statistic,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const statistic =
      await this.statisticService.remove(id);

    return {
      success: true,
      message: 'Statistik berhasil dihapus',
      data: statistic,
    };
  }
}