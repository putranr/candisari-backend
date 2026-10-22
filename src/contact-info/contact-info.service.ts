import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateContactInfoDto } from './dto/create-contact-info.dto.js';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto.js';

@Injectable()
export class ContactInfoService {
  async findOne() {
    const contact =
      await db.orm.public.ContactInfo.first({});

    if (!contact) {
      throw new NotFoundException(
        'Contact info belum tersedia',
      );
    }

    return contact;
  }

  async create(createData: CreateContactInfoDto) {
    const existing =
      await db.orm.public.ContactInfo.first({});

    if (existing) {
      throw new BadRequestException(
        'Contact info sudah ada. Gunakan PATCH untuk mengubah data.',
      );
    }

    return db.orm.public.ContactInfo.create({
      address: createData.address,
      phone: createData.phone,
      email: createData.email,
      whatsapp: createData.whatsapp,
    });
  }

  async update(updateData: UpdateContactInfoDto) {
    const existing =
      await db.orm.public.ContactInfo.first({});

    if (!existing) {
      throw new NotFoundException(
        'Contact info belum tersedia',
      );
    }

    const data: Record<string, unknown> = {};

    if (updateData.address !== undefined) {
      data.address = updateData.address;
    }

    if (updateData.phone !== undefined) {
      data.phone = updateData.phone;
    }

    if (updateData.email !== undefined) {
      data.email = updateData.email;
    }

    if (updateData.whatsapp !== undefined) {
      data.whatsapp = updateData.whatsapp;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Tidak ada data yang diubah.',
      );
    }

    return db.orm.public.ContactInfo
      .where({ id: existing.id })
      .update({
        ...data,
      });
  }
}
