import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { StatisticDataService } from './statistic-data.service.js';
import { CreateStatisticDataDto } from './dto/create-statistic-data.dto.js';
import { UpdateStatisticDataDto } from './dto/update-statistic-data.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('statistic-data')
export class StatisticDataController {
  constructor(
    private readonly statisticDataService: StatisticDataService,
  ) {}

  @Get()
  async findAll(
    @Query('statisticId') statisticId?: string,
  ) {
    const data =
      await this.statisticDataService.findAll(
        statisticId
          ? Number(statisticId)
          : undefined,
      );

    return {
      success: true,
      message: 'Data statistik berhasil diambil',
      data,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data =
      await this.statisticDataService.findOne(id);

    return {
      success: true,
      message: 'Detail data statistik berhasil diambil',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(
    @Body()
    createStatisticDataDto: CreateStatisticDataDto,
  ) {
    const data =
      await this.statisticDataService.create(
        createStatisticDataDto,
      );

    return {
      success: true,
      message: 'Data statistik berhasil dibuat',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateStatisticDataDto,
  ) {
    const data =
      await this.statisticDataService.update(
        id,
        updateData,
      );

    return {
      success: true,
      message: 'Data statistik berhasil diperbarui',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data =
      await this.statisticDataService.remove(id);

    return {
      success: true,
      message: 'Data statistik berhasil dihapus',
      data,
    };
  }
}