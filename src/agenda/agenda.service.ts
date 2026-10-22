import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateAgendaDto } from './dto/create-agenda.dto.js';

@Injectable()
export class AgendaService {
  async findAll() {
    return db.orm.public.Agenda.all();
  }

  async findAllAdmin() {
    return db.orm.public.Agenda.all();
  }

  async findOne(slug: string) {
    const agenda = await db.orm.public.Agenda.first({ slug });

    if (!agenda) {
      throw new NotFoundException('Agenda tidak ditemukan');
    }

    return agenda;
  }

  async findOneAdmin(slug: string) {
    const agenda = await db.orm.public.Agenda.first({ slug });

    if (!agenda) {
      throw new NotFoundException('Agenda tidak ditemukan');
    }

    return agenda;
  }

  async create(
    createAgendaDto: CreateAgendaDto,
    createdBy: number,
  ) {
    return db.orm.public.Agenda.create({
      title: createAgendaDto.title,
      slug: createAgendaDto.slug,
      description: createAgendaDto.description,
      startDate: createAgendaDto.startDate,
      endDate: createAgendaDto.endDate,
      location: createAgendaDto.location,
      image: createAgendaDto.image,
      createdBy,
    });
  }

  async update(
    id: number,
    updateData: Partial<CreateAgendaDto>,
  ) {
    const existing = await db.orm.public.Agenda.first({ id });

    if (!existing) {
      throw new NotFoundException('Agenda tidak ditemukan');
    }

    return db.orm.public.Agenda.where({ id }).update(updateData);
  }

  async remove(id: number) {
    const existing = await db.orm.public.Agenda.first({ id });

    if (!existing) {
      throw new NotFoundException('Agenda tidak ditemukan');
    }

    return db.orm.public.Agenda.where({ id }).delete();
  }
}