import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';

@Injectable()
export class DocumentService {
  // Daftar lengkap untuk admin, termasuk dokumen draf.
  async findAll() {
    return db.orm.public.Document.all();
  }

  // Daftar publik: hanya dokumen yang sudah waktunya terbit.
  async findAllPublished() {
    const documents = await db.orm.public.Document.all();
    const now = Date.now();

    return documents.filter((document) => {
      if (!document.publishedAt) return false;

      const publishTime = new Date(document.publishedAt).getTime();

      return Number.isFinite(publishTime) && publishTime <= now;
    });
  }

  // Detail lengkap untuk admin.
  async findOne(id: number) {
    const document = await db.orm.public.Document.first({ id });

    if (!document) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    return document;
  }

  // Detail publik: draf dan dokumen terjadwal tidak ditampilkan.
  async findOnePublished(id: number) {
    const document = await db.orm.public.Document.first({ id });

    const publishTime = document?.publishedAt
      ? new Date(document.publishedAt).getTime()
      : Number.NaN;

    if (
      !document ||
      !Number.isFinite(publishTime) ||
      publishTime > Date.now()
    ) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    return document;
  }

  async create(createDocumentDto: CreateDocumentDto, uploadedBy: number) {
    return db.orm.public.Document.create({
      title: createDocumentDto.title,
      description: createDocumentDto.description,
      fileUrl: createDocumentDto.fileUrl,
      fileName: createDocumentDto.fileName,
      fileType: createDocumentDto.fileType,
      fileSize: createDocumentDto.fileSize,
      category: createDocumentDto.category,
      uploadedBy,
      publishedAt: createDocumentDto.publishedAt,
    });
  }

  async update(id: number, updateData: Partial<CreateDocumentDto>) {
    const document = await db.orm.public.Document.where({ id }).update(updateData);

    if (!document) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    return document;
  }

  async remove(id: number) {
    const document = await db.orm.public.Document.where({ id }).delete();

    if (!document) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    return document;
  }
}
