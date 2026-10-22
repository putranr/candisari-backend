import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateServiceRequirementDto } from './dto/create-service-requirement.dto.js';

@Injectable()
export class ServiceRequirementService {
  async findAll(serviceId: number) {
    return db.orm.public.ServiceRequirement.where({ serviceId }).all();
  }

  async create(createDto: CreateServiceRequirementDto) {
    return db.orm.public.ServiceRequirement.create({
      serviceId: createDto.serviceId,
      name: createDto.name,
      description: createDto.description,
      sortOrder: createDto.sortOrder ?? 0,
    });
  }

  async update(
    id: number,
    updateData: Partial<CreateServiceRequirementDto>,
  ) {
    const requirement = await db.orm.public.ServiceRequirement
      .where({ id })
      .update(updateData);

    if (!requirement) {
      throw new NotFoundException('Persyaratan pelayanan tidak ditemukan');
    }

    return requirement;
  }

  async remove(id: number) {
    const requirement = await db.orm.public.ServiceRequirement
      .where({ id })
      .delete();

    if (!requirement) {
      throw new NotFoundException('Persyaratan pelayanan tidak ditemukan');
    }

    return requirement;
  }
}