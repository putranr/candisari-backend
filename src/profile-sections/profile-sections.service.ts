import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateProfileSectionDto } from './dto/create-profile-section.dto.js';
import { UpdateProfileSectionDto } from './dto/update-profile-section.dto.js';
import { ScheduleProfileSectionDto } from './dto/schedule-profile-section.dto.js';

@Injectable()
export class ProfileSectionsService {
  private async getAllRecords() {
    return db.orm.public.ProfileSection.all();
  }

  private sortRecords<T extends { sortOrder: number; id: number }>(
    records: T[],
  ) {
    return records.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.id - b.id,
    );
  }

  private isPublishedAndAvailable(section: any): boolean {
    if (section.status !== 'PUBLISHED' || !section.publishedAt) {
      return false;
    }

    const publishedTime = new Date(section.publishedAt).getTime();

    return (
      Number.isFinite(publishedTime) &&
      publishedTime <= Date.now()
    );
  }

  async findAllAdmin() {
    return this.sortRecords(await this.getAllRecords());
  }

  async findOneAdmin(id: number) {
    const records = await this.getAllRecords();
    const section = records.find((item) => item.id === id);

    if (!section) {
      throw new NotFoundException(
        'Bagian profil tidak ditemukan',
      );
    }

    return section;
  }

  async findPublished() {
    const records = await this.getAllRecords();

    return this.sortRecords(
      records.filter((section) =>
        this.isPublishedAndAvailable(section),
      ),
    );
  }

  async findPublishedBySlug(slug: string) {
    const records = await this.getAllRecords();

    const section = records.find(
      (item) =>
        item.slug === slug &&
        this.isPublishedAndAvailable(item),
    );

    if (!section) {
      throw new NotFoundException(
        'Bagian profil tidak ditemukan',
      );
    }

    return section;
  }

  async create(dto: CreateProfileSectionDto) {
    try {
      return await db.orm.public.ProfileSection.create({
        title: dto.title,
        slug: dto.slug,
        sectionType: dto.sectionType,
        sortOrder: dto.sortOrder ?? 0,
        summary: dto.summary ?? null,
        content: dto.content,
        coverImage: dto.coverImage ?? null,
        status: 'DRAFT',
        publishedAt: null,
        scheduledAt: null,
      });
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException(
          'Slug bagian profil sudah digunakan',
        );
      }

      throw error;
    }
  }

  async update(id: number, dto: UpdateProfileSectionDto) {
    await this.findOneAdmin(id);

    const data: Record<string, unknown> = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.sectionType !== undefined) {
      data.sectionType = dto.sectionType;
    }
    if (dto.sortOrder !== undefined) {
      data.sortOrder = dto.sortOrder;
    }
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.coverImage !== undefined) {
      data.coverImage = dto.coverImage;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Tidak ada data yang dikirim untuk diperbarui',
      );
    }

    try {
      return await db.orm.public.ProfileSection
        .where({ id })
        .update(data as any);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException(
          'Slug bagian profil sudah digunakan',
        );
      }

      throw error;
    }
  }

  async publish(id: number) {
    await this.findOneAdmin(id);

    return db.orm.public.ProfileSection
      .where({ id })
      .update({
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        scheduledAt: null,
      });
  }

  async unpublish(id: number) {
    await this.findOneAdmin(id);

    return db.orm.public.ProfileSection
      .where({ id })
      .update({
        status: 'DRAFT',
        publishedAt: null,
        scheduledAt: null,
      });
  }

  async schedule(
    id: number,
    dto: ScheduleProfileSectionDto,
  ) {
    await this.findOneAdmin(id);

    const scheduledAt = new Date(dto.scheduledAt);

    if (
      !Number.isFinite(scheduledAt.getTime()) ||
      scheduledAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException(
        'Jadwal publikasi harus berada di masa depan',
      );
    }

    return db.orm.public.ProfileSection
      .where({ id })
      .update({
        status: 'SCHEDULED',
        scheduledAt: scheduledAt.toISOString(),
        publishedAt: null,
      });
  }

  async remove(id: number) {
    await this.findOneAdmin(id);

    return db.orm.public.ProfileSection
      .where({ id })
      .delete();
  }
}
