import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateStatisticDto } from './dto/create-statistic.dto.js';

@Injectable()
export class StatisticService {
  async findAll() {
    return db.orm.public.Statistic.all();
  }

  async findOne(id: number) {
    const statistic =
      await db.orm.public.Statistic.first({ id });

    if (!statistic) {
      throw new NotFoundException(
        'Statistik tidak ditemukan',
      );
    }

    return statistic;
  }

  async create(createStatisticDto: CreateStatisticDto) {
    const statistic =
      await db.orm.public.Statistic.create({
        title: createStatisticDto.title,
        description: createStatisticDto.description,
        unit: createStatisticDto.unit,
        category: createStatisticDto.category,
      });

    return statistic;
  }

  async update(
    id: number,
    updateData: Partial<CreateStatisticDto>,
  ) {
    const statistic =
      await db.orm.public.Statistic
        .where({ id })
        .update(updateData);

    if (!statistic) {
      throw new NotFoundException(
        'Statistik tidak ditemukan',
      );
    }

    return statistic;
  }

  async remove(id: number) {
    const statistic =
      await db.orm.public.Statistic
        .where({ id })
        .delete();

    if (!statistic) {
      throw new NotFoundException(
        'Statistik tidak ditemukan',
      );
    }

    return statistic;
  }
}