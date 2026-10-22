import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateHomeSectionDto } from './dto/create-home-section.dto.js';
import { UpdateHomeSectionDto } from './dto/update-home-section.dto.js';
import { ScheduleHomeSectionDto } from './dto/schedule-home-section.dto.js';
import { ReorderHomeSectionsDto } from './dto/reorder-home-sections.dto.js';

@Injectable()
export class HomeSectionsService {
  // ============================================
  // GET ALL HOME SECTIONS
  // ADMIN / DRAFT
  // ============================================
  async findAll() {
    const sections =
      await db.orm.public.HomeSection.all();

    return sections.sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }

  // ============================================
  // GET PUBLISHED HOME SECTIONS
  // PUBLIC WEBSITE
  // ============================================
  async findPublished() {
    const sections =
      await db.orm.public.HomeSection.all();

    return sections
      .filter(
        (section) =>
          section.status === 'PUBLISHED',
      )
      .sort(
        (a, b) =>
          (a.publishedSortOrder ??
            Number.MAX_SAFE_INTEGER) -
          (b.publishedSortOrder ??
            Number.MAX_SAFE_INTEGER),
      );
  }

  // ============================================
  // PREVIEW HOME SECTIONS
  // ADMIN DRAFT PREVIEW
  // ============================================
  async findPreview() {
    const sections =
      await db.orm.public.HomeSection.all();

    return sections.sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }

  // ============================================
  // GET HOME SECTION BY ID
  // ============================================
  async findOne(id: number) {
    const sections =
      await db.orm.public.HomeSection.all();

    const section = sections.find(
      (item) => item.id === id,
    );

    if (!section) {
      throw new NotFoundException(
        'Home section tidak ditemukan',
      );
    }

    return section;
  }

  // ============================================
  // CREATE HOME SECTION
  // ============================================
  async create(dto: CreateHomeSectionDto) {
    try {
      return await db.orm.public.HomeSection.create({
        sectionKey: dto.sectionKey,
        title: dto.title ?? null,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
      });
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException(
          'sectionKey sudah digunakan',
        );
      }

      throw error;
    }
  }

  // ============================================
  // UPDATE HOME SECTION
  // ============================================
  async update(
    id: number,
    dto: UpdateHomeSectionDto,
  ) {
    await this.findOne(id);

    try {
      return await db.orm.public.HomeSection
        .where({ id })
        .update({
          ...(dto.sectionKey !== undefined && {
            sectionKey: dto.sectionKey,
          }),

          ...(dto.title !== undefined && {
            title: dto.title,
          }),

          ...(dto.isActive !== undefined && {
            isActive: dto.isActive,
          }),

          ...(dto.sortOrder !== undefined && {
            sortOrder: dto.sortOrder,
          }),
        });
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException(
          'sectionKey sudah digunakan',
        );
      }

      throw error;
    }
  }

  // ============================================
  // PUBLISH HOME SECTION
  // ============================================
  async publish(id: number) {
    await this.findOne(id);

    return await db.orm.public.HomeSection
      .where({ id })
      .update({
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        scheduledAt: null,
      });
  }

  // ============================================
  // UNPUBLISH HOME SECTION
  // ============================================
  async unpublish(id: number) {
    await this.findOne(id);

    return await db.orm.public.HomeSection
      .where({ id })
      .update({
        status: 'DRAFT',
        publishedAt: null,
        scheduledAt: null,
      });
  }

  // ============================================
  // SCHEDULE HOME SECTION
  // ============================================
  async schedule(
    id: number,
    dto: ScheduleHomeSectionDto,
  ) {
    await this.findOne(id);

    const scheduledAt = new Date(
      dto.scheduledAt,
    );

    if (
      scheduledAt.getTime() <= Date.now()
    ) {
      throw new ConflictException(
        'Waktu publikasi harus lebih dari waktu sekarang',
      );
    }

    return await db.orm.public.HomeSection
      .where({ id })
      .update({
        status: 'SCHEDULED',
        scheduledAt: scheduledAt.toISOString(),
        publishedAt: null,
      });
  }

  // ============================================
  // REORDER HOME SECTIONS
  // ============================================
  async reorder(
    dto: ReorderHomeSectionsDto,
  ) {
    const sections =
      await db.orm.public.HomeSection.all();

    const existingIds = new Set(
      sections.map(
        (section) => section.id,
      ),
    );

    const uniqueIds = new Set(dto.ids);

    if (
      uniqueIds.size !== dto.ids.length
    ) {
      throw new ConflictException(
        'ID home section tidak boleh duplikat',
      );
    }

    const missingIds = dto.ids.filter(
      (id) => !existingIds.has(id),
    );

    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Home section tidak ditemukan: ${missingIds.join(', ')}`,
      );
    }

    if (
      dto.ids.length !== sections.length
    ) {
      throw new ConflictException(
        'Semua home section harus disertakan saat mengatur ulang urutan',
      );
    }

    for (
      let index = 0;
      index < dto.ids.length;
      index++
    ) {
      await db.orm.public.HomeSection
        .where({
          id: dto.ids[index],
        })
        .update({
          sortOrder: index + 1,
        });
    }

    return await db.orm.public.HomeSection
      .all()
      .then((items) =>
        items.sort(
          (a, b) =>
            a.sortOrder - b.sortOrder,
        ),
      );
  }

  // ============================================
  // PUBLISH ARRANGEMENT
  // ============================================
  async publishArrangement() {
    const sections =
      await db.orm.public.HomeSection.all();

    if (sections.length === 0) {
      throw new NotFoundException(
        'Belum ada home section untuk dipublikasikan',
      );
    }

    for (const section of sections) {
      await db.orm.public.HomeSection
        .where({
          id: section.id,
        })
        .update({
          publishedSortOrder:
            section.sortOrder,
        });
    }

    return await db.orm.public.HomeSection
      .all()
      .then((items) =>
        items.sort(
          (a, b) =>
            (a.publishedSortOrder ??
              Number.MAX_SAFE_INTEGER) -
            (b.publishedSortOrder ??
              Number.MAX_SAFE_INTEGER),
        ),
      );
  }

  // ============================================
  // DELETE HOME SECTION
  // ============================================
  async remove(id: number) {
    await this.findOne(id);

    return await db.orm.public.HomeSection
      .where({ id })
      .delete();
  }
}