import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { db } from '../prisma/db.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';

@Injectable()
export class AdminsService {
  private sanitizeAdmin(admin: any) {
    const { password, ...safeAdmin } = admin;
    return safeAdmin;
  }

  async findAll() {
    const admins = await db.orm.public.Admin.all();

    return admins
      .map((admin: any) => this.sanitizeAdmin(admin))
      .sort((a: any, b: any) => a.id - b.id);
  }

  async findOne(id: number) {
    const admin = await db.orm.public.Admin.first({ id });

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    return this.sanitizeAdmin(admin);
  }

  async create(dto: CreateAdminDto) {
    const existing = await db.orm.public.Admin.first({
      email: dto.email,
    });

    if (existing) {
      throw new ConflictException('Email admin sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = await db.orm.public.Admin.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 'ADMIN',
      isActive: dto.isActive ?? true,
    });

    return this.sanitizeAdmin(admin);
  }

  async update(id: number, dto: UpdateAdminDto, currentUserId: number) {
    const admin = await db.orm.public.Admin.first({ id });

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    if (id === currentUserId && dto.isActive === false) {
      throw new ForbiddenException(
        'SUPER_ADMIN tidak dapat menonaktifkan dirinya sendiri',
      );
    }

    if (id === currentUserId && dto.role === 'ADMIN') {
      throw new ForbiddenException(
        'SUPER_ADMIN tidak dapat menurunkan role dirinya sendiri',
      );
    }

    if (dto.email && dto.email !== admin.email) {
      const existing = await db.orm.public.Admin.first({
        email: dto.email,
      });

      if (existing) {
        throw new ConflictException('Email admin sudah digunakan');
      }
    }

    const data: Record<string, unknown> = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Tidak ada data yang diubah');
    }

    const updated = await db.orm.public.Admin
      .where({ id })
      .update(data);

    return this.sanitizeAdmin(updated);
  }

  async updateStatus(
    id: number,
    isActive: boolean,
    currentUserId: number,
  ) {
    const admin = await db.orm.public.Admin.first({ id });

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    if (id === currentUserId && !isActive) {
      throw new ForbiddenException(
        'SUPER_ADMIN tidak dapat menonaktifkan dirinya sendiri',
      );
    }

    const updated = await db.orm.public.Admin
      .where({ id })
      .update({ isActive });

    return this.sanitizeAdmin(updated);
  }

  async remove(id: number, currentUserId: number) {
    const admin = await db.orm.public.Admin.first({ id });

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    if (id === currentUserId) {
      throw new ForbiddenException(
        'SUPER_ADMIN tidak dapat menghapus dirinya sendiri',
      );
    }

    await db.orm.public.Admin
      .where({ id })
      .delete();

    return {
      id,
      deleted: true,
    };
  }
}
