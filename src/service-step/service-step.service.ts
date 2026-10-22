import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateServiceStepDto } from './dto/create-service-step.dto.js';

@Injectable()
export class ServiceStepService {
  async findAll(serviceId: number) {
    return db.orm.public.ServiceStep
      .where({ serviceId })
      .all();
  }

  async create(createDto: CreateServiceStepDto) {
    return db.orm.public.ServiceStep.create({
      serviceId: createDto.serviceId,
      title: createDto.title,
      description: createDto.description,
      stepNumber: createDto.stepNumber,
    });
  }

  async update(
    id: number,
    updateData: Partial<CreateServiceStepDto>,
  ) {
    const step = await db.orm.public.ServiceStep
      .where({ id })
      .update(updateData);

    if (!step) {
      throw new NotFoundException(
        'Langkah pelayanan tidak ditemukan',
      );
    }

    return step;
  }

  async remove(id: number) {
    const step = await db.orm.public.ServiceStep
      .where({ id })
      .delete();

    if (!step) {
      throw new NotFoundException(
        'Langkah pelayanan tidak ditemukan',
      );
    }

    return step;
  }
}