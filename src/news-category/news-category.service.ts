import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto.js';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto.js';

@Injectable()
export class NewsCategoryService {
  async findAll() {
    return db.orm.public.NewsCategory.orderBy((model) =>
      model.name.asc(),
    ).all();
  }

  async findOne(id: number) {
    const category = await db.orm.public.NewsCategory.first({ id });

    if (!category) {
      throw new NotFoundException('Kategori berita tidak ditemukan');
    }

    return category;
  }

  async create(createNewsCategoryDto: CreateNewsCategoryDto) {
    try {
      return await db.orm.public.NewsCategory.create({
        name: createNewsCategoryDto.name,
        slug: createNewsCategoryDto.slug,
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'sqlState' in error &&
        error.sqlState === '23505'
      ) {
        throw new ConflictException('Slug kategori berita sudah digunakan');
      }

      throw error;
    }
  }

  async update(id: number, updateNewsCategoryDto: UpdateNewsCategoryDto) {
    const existing = await db.orm.public.NewsCategory.first({ id });

    if (!existing) {
      throw new NotFoundException('Kategori berita tidak ditemukan');
    }

    const data: Record<string, unknown> = {};

    if (updateNewsCategoryDto.name !== undefined) {
      data.name = updateNewsCategoryDto.name;
    }

    if (updateNewsCategoryDto.slug !== undefined) {
      data.slug = updateNewsCategoryDto.slug;
    }

    if (Object.keys(data).length === 0) {
      throw new ConflictException('Tidak ada data yang diperbarui');
    }

    try {
      return await db.orm.public.NewsCategory.where({ id }).update(data);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'sqlState' in error &&
        error.sqlState === '23505'
      ) {
        throw new ConflictException('Slug kategori berita sudah digunakan');
      }

      throw error;
    }
  }

  async remove(id: number) {
    const existing = await db.orm.public.NewsCategory.first({ id });

    if (!existing) {
      throw new NotFoundException('Kategori berita tidak ditemukan');
    }

    const news = await db.orm.public.News.where({ categoryId: id }).all();

    if (news.length > 0) {
      throw new ConflictException(
        'Kategori berita tidak dapat dihapus karena masih digunakan oleh berita',
      );
    }

    const category = await db.orm.public.NewsCategory.where({ id }).delete();

    if (!category) {
      throw new NotFoundException('Kategori berita tidak ditemukan');
    }

    return category;
  }
}
