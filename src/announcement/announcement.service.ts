import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';

@Injectable()
export class AnnouncementService {
  private isPubliclyAvailable(announcement: any): boolean {
    if (
      announcement.status !== 'PUBLISHED' ||
      !announcement.publishedAt
    ) {
      return false;
    }

    const now = Date.now();
    const publishedTime = new Date(
      announcement.publishedAt,
    ).getTime();

    if (
      !Number.isFinite(publishedTime) ||
      publishedTime > now
    ) {
      return false;
    }

    if (announcement.expiredAt) {
      const expiredTime = new Date(
        announcement.expiredAt,
      ).getTime();

      if (
        !Number.isFinite(expiredTime) ||
        expiredTime <= now
      ) {
        return false;
      }
    }

    return true;
  }

  // Publik: hanya pengumuman yang sudah terbit dan belum kedaluwarsa.
  async findAll() {
    const announcements =
      await db.orm.public.Announcement.all();

    return announcements.filter((item: any) =>
      this.isPubliclyAvailable(item),
    );
  }

  // Admin: seluruh pengumuman, termasuk draf dan arsip.
  async findAllAdmin() {
    return db.orm.public.Announcement.all();
  }

  async findOne(id: number) {
    const announcements =
      await db.orm.public.Announcement.all();

    const announcement = announcements.find(
      (item: any) =>
        item.id === id &&
        this.isPubliclyAvailable(item),
    );

    if (!announcement) {
      throw new NotFoundException('Pengumuman tidak ditemukan');
    }

    return announcement;
  }

  async findOneAdmin(id: number) {
    const announcement =
      await db.orm.public.Announcement.first({ id });

    if (!announcement) {
      throw new NotFoundException('Pengumuman tidak ditemukan');
    }

    return announcement;
  }

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    createdBy: number,
  ) {
    return db.orm.public.Announcement.create({
      title: createAnnouncementDto.title,
      slug: createAnnouncementDto.slug,
      content: createAnnouncementDto.content,
      priority: createAnnouncementDto.priority ?? 'NORMAL',
      status: createAnnouncementDto.status ?? 'DRAFT',
      publishedAt: createAnnouncementDto.publishedAt ?? null,
      expiredAt: createAnnouncementDto.expiredAt ?? null,
      createdBy,
    });
  }

  async update(
    id: number,
    updateData: Partial<CreateAnnouncementDto>,
  ) {
    const existing =
      await db.orm.public.Announcement.first({ id });

    if (!existing) {
      throw new NotFoundException('Pengumuman tidak ditemukan');
    }

    return db.orm.public.Announcement
      .where({ id })
      .update(updateData);
  }

  async remove(id: number) {
    const existing =
      await db.orm.public.Announcement.first({ id });

    if (!existing) {
      throw new NotFoundException('Pengumuman tidak ditemukan');
    }

    return db.orm.public.Announcement.where({ id }).delete();
  }
}