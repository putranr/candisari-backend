import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';

import { db } from '../prisma/db.js';
import { MailService } from '../mail/mail.service.js';
import { CreateAdminInvitationDto } from './dto/create-admin-invitation.dto.js';
import { AcceptAdminInvitationDto } from './dto/accept-admin-invitation.dto.js';

@Injectable()
export class AdminInvitationsService {
  constructor(private readonly mailService: MailService) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async createInvitation(dto: CreateAdminInvitationDto) {
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();

    if (!name) {
      throw new BadRequestException('Nama tidak boleh kosong');
    }

    const existing = await db.orm.public.Admin.first({ email });

    if (existing) {
      throw new ConflictException('Email admin sudah digunakan');
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(
      Date.now() + 60 * 60 * 1000,
    ).toISOString();

    let createdAdmin: any = null;

    try {
      // Akun belum bisa login: password acak dan akun tidak aktif.
      const inaccessiblePassword = await bcrypt.hash(
        randomBytes(48).toString('hex'),
        10,
      );

      createdAdmin = await db.orm.public.Admin.create({
        name,
        email,
        password: inaccessiblePassword,
        role: dto.role ?? 'ADMIN',
        isActive: false,
      });

      await db.orm.public.AdminInvitationToken.create({
        adminId: createdAdmin.id,
        tokenHash,
        expiresAt,
      });

      const frontendUrl = (
        process.env.FRONTEND_URL || 'http://localhost:3000'
      ).replace(/\/+$/, '');

      const inviteUrl =
        `${frontendUrl}/admin/accept-invitation?token=${encodeURIComponent(rawToken)}`;

      await this.mailService.sendAdminInvitationEmail(
        name,
        email,
        inviteUrl,
      );

      return {
        id: createdAdmin.id,
        name: createdAdmin.name,
        email: createdAdmin.email,
        role: createdAdmin.role,
        isActive: false,
        expiresAt,
      };
    } catch (error: any) {
      // Jika penyimpanan atau pengiriman email gagal, coba hapus
      // akun pending yang baru dibuat agar tidak tertinggal.
      if (createdAdmin?.id) {
        try {
          await db.orm.public.Admin
            .where({ id: createdAdmin.id })
            .delete();
        } catch {
          console.error(
            'Pembersihan akun undangan gagal, admin ID:',
            createdAdmin.id,
          );
        }
      }

      if (error?.code === '23505') {
        throw new ConflictException('Email admin sudah digunakan');
      }

      throw error;
    }
  }

  async acceptInvitation(dto: AcceptAdminInvitationDto) {
    const tokenHash = this.hashToken(dto.token);

    const invitation =
      await db.orm.public.AdminInvitationToken.first({
        tokenHash,
      });

    if (!invitation || invitation.usedAt) {
      throw new BadRequestException(
        'Token undangan tidak valid atau sudah digunakan',
      );
    }

    const expiresAt = new Date(invitation.expiresAt).getTime();

    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      throw new BadRequestException(
        'Undangan telah kedaluwarsa. Hubungi Super Admin untuk meminta undangan baru.',
      );
    }

    const admin = await db.orm.public.Admin.first({
      id: invitation.adminId,
    });

    if (!admin || admin.isActive) {
      throw new BadRequestException(
        'Undangan tidak dapat digunakan untuk akun ini',
      );
    }

    // Klaim token terlebih dahulu agar tidak dapat dipakai paralel.
    const claimed = await db.orm.public.AdminInvitationToken
      .where({
        id: invitation.id,
        usedAt: null,
      })
      .update({
        usedAt: new Date().toISOString(),
      });

    if (!claimed) {
      throw new BadRequestException(
        'Token undangan tidak valid atau sudah digunakan',
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

      const activated = await db.orm.public.Admin
        .where({
          id: admin.id,
          isActive: false,
        })
        .update({
          password: hashedPassword,
          isActive: true,
        });

      if (!activated) {
        throw new BadRequestException(
          'Akun tidak dapat diaktifkan menggunakan undangan ini',
        );
      }

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: true,
      };
    } catch (error) {
      // Pulihkan token jika pembaruan akun gagal sehingga proses
      // dapat dicoba ulang selama token belum kedaluwarsa.
      try {
        await db.orm.public.AdminInvitationToken
          .where({ id: invitation.id })
          .update({ usedAt: null });
      } catch {
        console.error(
          'Pemulihan token undangan gagal, token ID:',
          invitation.id,
        );
      }

      throw error;
    }
  }


  async resendInvitation(adminId: number) {
    const admin = await db.orm.public.Admin.first({
      id: adminId,
    });

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    if (admin.isActive) {
      throw new ConflictException(
        'Undangan ulang hanya tersedia untuk akun admin yang belum aktif',
      );
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(
      Date.now() + 60 * 60 * 1000,
    ).toISOString();

    const newInvitation =
      await db.orm.public.AdminInvitationToken.create({
        adminId: admin.id,
        tokenHash,
        expiresAt,
      });

    const frontendUrl = (
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ).replace(/\/+$/, '');

    const inviteUrl =
      `${frontendUrl}/admin/accept-invitation?token=${encodeURIComponent(rawToken)}`;

    try {
      await this.mailService.sendAdminInvitationEmail(
        admin.name,
        admin.email,
        inviteUrl,
        true,
      );
    } catch (error) {
      // Token yang tidak berhasil dikirim tidak boleh digunakan.
      try {
        await db.orm.public.AdminInvitationToken
          .where({ id: newInvitation.id })
          .update({ usedAt: new Date().toISOString() });
      } catch {
        console.error(
          'Gagal menonaktifkan token undangan yang tidak terkirim',
        );
      }

      throw error;
    }

    // Setelah email baru berhasil dikirim, invalidasi undangan
    // lama yang belum digunakan untuk akun ini.
    const allTokens =
      await db.orm.public.AdminInvitationToken.all();

    const oldTokens = allTokens.filter(
      (token) =>
        token.adminId === admin.id &&
        token.id !== newInvitation.id &&
        token.usedAt === null,
    );

    const replacedAt = new Date().toISOString();

    for (const token of oldTokens) {
      await db.orm.public.AdminInvitationToken
        .where({ id: token.id })
        .update({ usedAt: replacedAt });
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: false,
      expiresAt,
    };
  }
}