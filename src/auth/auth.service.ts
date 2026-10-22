import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { db } from '../prisma/db.js';
import { createHash, randomBytes } from 'node:crypto';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async findAdmin(email: string) {
    return db.orm.public.Admin.first({
      email,
    });
  }

  async login(email: string, password: string) {
    const admin = await this.findAdmin(email);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException(
        'Email atau password salah',
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      admin.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Email atau password salah',
      );
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      admin,
      accessToken,
    };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const admin = await db.orm.public.Admin.first({
      id: userId,
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException(
        'Akun tidak ditemukan atau tidak aktif',
      );
    }

    const passwordValid = await bcrypt.compare(
      currentPassword,
      admin.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Password lama salah',
      );
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'Password baru harus berbeda dari password lama',
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10,
    );

    await db.orm.public.Admin
      .where({ id: userId })
      .update({
        password: hashedPassword,
      });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  }

  async forgotPassword(email: string) {
    const admin = await db.orm.public.Admin.first({
      email,
    });

    // Jangan membocorkan apakah email terdaftar
    if (!admin || !admin.isActive) {
      return {
        message:
          'Jika email terdaftar, link reset password akan dikirim.',
      };
    }

    // Invalidasi token reset sebelumnya
    await db.orm.public.PasswordResetToken
      .where({
        adminId: admin.id,
        usedAt: null,
      })
      .update({
        usedAt: new Date().toISOString(),
      });

    // Generate token random 32 byte
    const rawToken = randomBytes(32).toString('hex');

    // Simpan hash token, bukan token asli
    const tokenHash = createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // Token berlaku 60 menit
    const expiresAt = new Date(
      Date.now() + 60 * 60 * 1000,
    ).toISOString();

    await db.orm.public.PasswordResetToken.create({
      adminId: admin.id,
      tokenHash,
      expiresAt,
    });

    // URL reset password untuk frontend
    const frontendUrl =
      process.env.FRONTEND_URL ||
      'http://localhost:3000';

    const resetUrl =
      `${frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    // Kirim link reset password melalui email
    await this.mailService.sendPasswordResetEmail(
      admin.email,
      resetUrl,
    );

    return {
      message:
        'Jika email terdaftar, link reset password akan dikirim.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ) {
    // Hash token yang dikirim user
    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    // Cari token berdasarkan hash
    const resetToken =
      await db.orm.public.PasswordResetToken.first({
        tokenHash,
      });

    // Token tidak ditemukan
    if (!resetToken) {
      throw new BadRequestException(
        'Token reset password tidak valid',
      );
    }

    // Token sudah pernah digunakan
    if (resetToken.usedAt) {
      throw new BadRequestException(
        'Token reset password sudah digunakan',
      );
    }

    // Token sudah expired
    if (
      new Date(resetToken.expiresAt).getTime() <=
      Date.now()
    ) {
      throw new BadRequestException(
        'Token reset password sudah kedaluwarsa',
      );
    }

    // Cari admin pemilik token
    const admin = await db.orm.public.Admin.first({
      id: resetToken.adminId,
    });

    if (!admin || !admin.isActive) {
      throw new BadRequestException(
        'Akun tidak ditemukan atau tidak aktif',
      );
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10,
    );

    // Update password
    await db.orm.public.Admin
      .where({ id: admin.id })
      .update({
        password: hashedPassword,
      });

    // Tandai token sudah digunakan
    await db.orm.public.PasswordResetToken
      .where({ id: resetToken.id })
      .update({
        usedAt: new Date().toISOString(),
      });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  }
}