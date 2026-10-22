import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateServiceDto } from './dto/create-service.dto.js';

@Injectable()
export class ServiceService {
  // Publik: hanya pelayanan yang berstatus ACTIVE.
  async findAll() {
    const services = await db.orm.public.Service.all();

    return services.filter(
      (service) => service.status === 'ACTIVE',
    );
  }

  // Admin: semua pelayanan termasuk INACTIVE.
  async findAllAdmin() {
    return db.orm.public.Service.all();
  }

  async findOne(slug: string) {
    const service = await db.orm.public.Service.first({ slug });

    if (!service || service.status !== 'ACTIVE') {
      throw new NotFoundException('Pelayanan tidak ditemukan');
    }

    return service;
  }

  async findOneAdmin(slug: string) {
    const service = await db.orm.public.Service.first({ slug });

    if (!service) {
      throw new NotFoundException('Pelayanan tidak ditemukan');
    }

    return service;
  }

  async create(
    createServiceDto: CreateServiceDto,
    createdBy: number,
  ) {
    return db.orm.public.Service.create({
      name: createServiceDto.name,
      slug: createServiceDto.slug,
      shortDescription: createServiceDto.shortDescription,
      description: createServiceDto.description,
      icon: createServiceDto.icon,
      estimatedTime: createServiceDto.estimatedTime,
      cost: createServiceDto.cost,
      status: createServiceDto.status ?? 'ACTIVE',
      createdBy,
    });
  }

  async update(
    id: number,
    updateData: Partial<CreateServiceDto>,
  ) {
    const existing = await db.orm.public.Service.first({ id });

    if (!existing) {
      throw new NotFoundException('Pelayanan tidak ditemukan');
    }

    return db.orm.public.Service.where({ id }).update(updateData);
  }

  async remove(id: number) {
    const existing = await db.orm.public.Service.first({ id });

    if (!existing) {
      throw new NotFoundException('Pelayanan tidak ditemukan');
    }

    return db.orm.public.Service.where({ id }).delete();
  }
}