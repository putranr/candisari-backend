import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto.js';

@Injectable()
export class ServiceFaqService {
  async findAll(serviceId: number) {
    return db.orm.public.ServiceFAQ
      .where({ serviceId })
      .all();
  }

  async create(createDto: CreateServiceFaqDto) {
    return db.orm.public.ServiceFAQ.create({
      serviceId: createDto.serviceId,
      question: createDto.question,
      answer: createDto.answer,
      sortOrder: createDto.sortOrder ?? 0,
    });
  }

  async update(
    id: number,
    updateData: Partial<CreateServiceFaqDto>,
  ) {
    const faq = await db.orm.public.ServiceFAQ
      .where({ id })
      .update(updateData);

    if (!faq) {
      throw new NotFoundException(
        'FAQ pelayanan tidak ditemukan',
      );
    }

    return faq;
  }

  async remove(id: number) {
    const faq = await db.orm.public.ServiceFAQ
      .where({ id })
      .delete();

    if (!faq) {
      throw new NotFoundException(
        'FAQ pelayanan tidak ditemukan',
      );
    }

    return faq;
  }
}