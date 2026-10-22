import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateHeroBannerDto } from './dto/create-hero-banner.dto.js';
import { UpdateHeroBannerDto } from './dto/update-hero-banner.dto.js';

@Injectable()
export class HeroBannerService {
  // Publik: banner nonaktif tidak ditampilkan.
  async findAll() {
    const banners = await db.orm.public.HeroBanner.all();

    return banners
      .filter((banner) => banner.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Admin: semua banner, termasuk yang nonaktif.
  async findAllAdmin() {
    const banners = await db.orm.public.HeroBanner.all();

    return banners.sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }

  async findOne(id: number) {
    const banner =
      await db.orm.public.HeroBanner.where({ id }).first();

    if (!banner || !banner.isActive) {
      throw new NotFoundException(
        'Hero banner tidak ditemukan',
      );
    }

    return banner;
  }

  async findOneAdmin(id: number) {
    const banner =
      await db.orm.public.HeroBanner.where({ id }).first();

    if (!banner) {
      throw new NotFoundException(
        'Hero banner tidak ditemukan',
      );
    }

    return banner;
  }

  async create(createData: CreateHeroBannerDto) {
    return db.orm.public.HeroBanner.create({
      title: createData.title,
      subtitle: createData.subtitle,
      image: createData.image,
      buttonText: createData.buttonText,
      buttonUrl: createData.buttonUrl,
      isActive: createData.isActive ?? true,
      sortOrder: createData.sortOrder ?? 0,
    });
  }

  async update(
    id: number,
    updateData: UpdateHeroBannerDto,
  ) {
    await this.findOneAdmin(id);

    const data: Record<string, unknown> = {};

    if (updateData.title !== undefined) data.title = updateData.title;
    if (updateData.subtitle !== undefined) data.subtitle = updateData.subtitle;
    if (updateData.image !== undefined) data.image = updateData.image;
    if (updateData.buttonText !== undefined) data.buttonText = updateData.buttonText;
    if (updateData.buttonUrl !== undefined) data.buttonUrl = updateData.buttonUrl;
    if (updateData.isActive !== undefined) data.isActive = updateData.isActive;
    if (updateData.sortOrder !== undefined) data.sortOrder = updateData.sortOrder;

    return db.orm.public.HeroBanner.where({ id }).update(data);
  }

  async remove(id: number) {
    await this.findOneAdmin(id);

    return db.orm.public.HeroBanner.where({ id }).delete();
  }
}