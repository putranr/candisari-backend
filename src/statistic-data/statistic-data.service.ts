import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateStatisticDataDto } from './dto/create-statistic-data.dto.js';
import { UpdateStatisticDataDto } from './dto/update-statistic-data.dto.js';

@Injectable()
export class StatisticDataService {
  async findAll(statisticId?: number) {
    if (statisticId) {
      return db.orm.public.StatisticData
        .where({ statisticId })
        .orderBy((model) => model.year.asc())
        .all();
    }

    return db.orm.public.StatisticData
      .orderBy((model) => model.year.asc())
      .all();
  }

  async findOne(id: number) {
    const statisticData =
      await db.orm.public.StatisticData.first({ id });

    if (!statisticData) {
      throw new NotFoundException(
        'Data statistik tidak ditemukan',
      );
    }

    return statisticData;
  }

  async create(
    createStatisticDataDto: CreateStatisticDataDto,
  ) {
    const statistic =
      await db.orm.public.Statistic.first({
        id: createStatisticDataDto.statisticId,
      });

    if (!statistic) {
      throw new NotFoundException(
        'Statistik induk tidak ditemukan',
      );
    }

    try {
      return await db.orm.public.StatisticData.create({
        statisticId:
          createStatisticDataDto.statisticId,
        year:
          createStatisticDataDto.year,
        value:
          createStatisticDataDto.value,
      });
    } catch (error: any) {
      if (error?.sqlState === '23505') {
        throw new ConflictException(
          'Data statistik untuk tahun tersebut sudah ada',
        );
      }

      throw error;
    }
  }

  async update(
    id: number,
    updateData: UpdateStatisticDataDto,
  ) {
    const existing =
      await db.orm.public.StatisticData.first({ id });

    if (!existing) {
      throw new NotFoundException(
        'Data statistik tidak ditemukan',
      );
    }

    const data: Record<string, unknown> = {};

    if (updateData.statisticId !== undefined) {
      const statistic =
        await db.orm.public.Statistic.first({
          id: updateData.statisticId,
        });

      if (!statistic) {
        throw new NotFoundException(
          'Statistik induk tidak ditemukan',
        );
      }

      data.statisticId = updateData.statisticId;
    }

    if (updateData.year !== undefined) {
      data.year = updateData.year;
    }

    if (updateData.value !== undefined) {
      data.value = updateData.value;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Tidak ada data yang diperbarui',
      );
    }

    try {
      return await db.orm.public.StatisticData
        .where({ id })
        .update(data);
    } catch (error: any) {
      if (error?.sqlState === '23505') {
        throw new ConflictException(
          'Data statistik untuk tahun tersebut sudah ada',
        );
      }

      throw error;
    }
  }

  async remove(id: number) {
    const statisticData =
      await db.orm.public.StatisticData
        .where({ id })
        .delete();

    if (!statisticData) {
      throw new NotFoundException(
        'Data statistik tidak ditemukan',
      );
    }

    return statisticData;
  }
}