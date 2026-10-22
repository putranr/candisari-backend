import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { ScheduleNewsDto } from './dto/schedule-news.dto.js';

@Injectable()
export class NewsService {
  private isPublishedAndAvailable(news: any): boolean {
    if (news.status !== 'PUBLISHED' || !news.publishedAt) {
      return false;
    }

    const publishedTime = new Date(news.publishedAt).getTime();

    return Number.isFinite(publishedTime) &&
      publishedTime <= Date.now();
  }

  // API publik: hanya berita yang sudah terbit dan waktunya tiba.
  async findAll() {
    const records = await db.orm.public.News.all();

    return records
      .filter((item: any) => this.isPublishedAndAvailable(item))
      .sort(
        (a: any, b: any) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      );
  }

  // API admin: seluruh berita, termasuk draf dan berita terjadwal.
  async findAllAdmin() {
    const records = await db.orm.public.News.all();

    return records.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
  }

  // API publik: detail berita harus sudah diterbitkan.
  async findOne(slug: string) {
    const records = await db.orm.public.News.all();

    const news = records.find(
      (item: any) =>
        item.slug === slug &&
        this.isPublishedAndAvailable(item),
    );

    if (!news) {
      throw new NotFoundException('Berita tidak ditemukan');
    }

    return news;
  }

  // API admin: detail berdasarkan slug tanpa filter publikasi.
  async findOneAdmin(slug: string) {
    const news = await db.orm.public.News.first({ slug });

    if (!news) {
      throw new NotFoundException('Berita tidak ditemukan');
    }

    return news;
  }

  async create(createNewsDto: CreateNewsDto, authorId: number) {
    return db.orm.public.News.create({
      title: createNewsDto.title,
      slug: createNewsDto.slug,
      excerpt: createNewsDto.excerpt,
      content: createNewsDto.content,
      image: createNewsDto.image,
      categoryId: createNewsDto.categoryId,
      authorId,
      status: 'DRAFT',
      publishedAt: null,
      scheduledAt: null,
    });
  }

  async update(id: number, updateData: Partial<CreateNewsDto>) {
    const existing = await db.orm.public.News.first({ id });

    if (!existing) {
      throw new NotFoundException('Berita tidak ditemukan');
    }

    return db.orm.public.News.where({ id }).update(updateData);
  }

  // Jadwalkan penerbitan pada waktu mendatang.
  async schedule(id: number, dto: ScheduleNewsDto) {
    const existing = await db.orm.public.News.first({ id });

    if (!existing) {
      throw new NotFoundException('Berita tidak ditemukan');
    }

    const scheduledTime = new Date(dto.scheduledAt).getTime();

    if (!Number.isFinite(scheduledTime)) {
      throw new BadRequestException(
        'Waktu publikasi tidak valid',
      );
    }

    if (scheduledTime <= Date.now()) {
      throw new BadRequestException(
        'Waktu publikasi harus berada di masa mendatang',
      );
    }

    return db.orm.public.News.where({ id }).update({
      status: 'SCHEDULED',
      scheduledAt: new Date(scheduledTime).toISOString(),
      publishedAt: null,
    });
  }

  // Publikasi langsung membatalkan jadwal yang tersisa.
  async publish(id: number) {
    const existing = await db.orm.public.News.first({ id });

    if (!existing) {
      throw new NotFoundException('Berita tidak ditemukan');
    }

    return db.orm.public.News.where({ id }).update({
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      scheduledAt: null,
    });
  }

  // Menarik publikasi sekaligus membersihkan jadwal.
  async unpublish(id: number) {
    const existing = await db.orm.public.News.first({ id });

    if (!existing) {
      throw new NotFoundException('Berita tidak ditemukan');
    }

    return db.orm.public.News.where({ id }).update({
      status: 'DRAFT',
      publishedAt: null,
      scheduledAt: null,
    });
  }

  async remove(id: number) {
    const news = await db.orm.public.News.where({ id }).delete();

    if (!news) {
      throw new NotFoundException('Berita tidak ditemukan');
    }

    return news;
  }
}