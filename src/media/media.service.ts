import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';

type UploadKind = 'image' | 'document';

@Injectable()
export class MediaService {
  private configureCloudinary(): void {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new ServiceUnavailableException(
        'Konfigurasi Cloudinary belum lengkap',
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  async upload(file: Express.Multer.File | undefined, kind?: string) {
    if (!file) {
      throw new BadRequestException(
        'File wajib diunggah dengan field "file"',
      );
    }

    if (kind !== 'image' && kind !== 'document') {
      throw new BadRequestException(
        'Parameter type harus image atau document',
      );
    }

    const uploadKind: UploadKind = kind;
    const extension = extname(file.originalname).toLowerCase();

    const allowedMimeTypes: Record<UploadKind, Record<string, string>> = {
      image: {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
      },
      document: {
        '.pdf': 'application/pdf',
        '.docx':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xlsx':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    };

    const expectedMime = allowedMimeTypes[uploadKind][extension];

    if (!expectedMime || file.mimetype !== expectedMime) {
      throw new BadRequestException(
        uploadKind === 'image'
          ? 'Format yang didukung: JPG, PNG, WEBP'
          : 'Format yang didukung: PDF, DOCX, XLSX',
      );
    }

    const maxSize =
      uploadKind === 'image'
        ? 5 * 1024 * 1024
        : 10 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException(
        uploadKind === 'image'
          ? 'Ukuran gambar maksimal 5 MB'
          : 'Ukuran dokumen maksimal 10 MB',
      );
    }

    this.configureCloudinary();

    const baseName =
      basename(file.originalname, extension)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'file';

    const uniqueName = `${Date.now()}-${randomUUID()}-${baseName}`;
    const folder =
      uploadKind === 'image'
        ? 'candisari/images'
        : 'candisari/documents';

    const publicId =
      uploadKind === 'image'
        ? uniqueName
        : `${uniqueName}${extension}`;

    try {
      const result = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder,
              public_id: publicId,
              resource_type: uploadKind === 'image' ? 'image' : 'raw',
              overwrite: false,
            },
            (error, uploadedFile) => {
              if (error) {
                reject(error);
                return;
              }

              if (!uploadedFile) {
                reject(new Error('Cloudinary tidak mengembalikan hasil'));
                return;
              }

              resolve(uploadedFile);
            },
          );

          stream.end(file.buffer);
        },
      );

      return {
        originalName: file.originalname,
        fileName: basename(result.public_id),
        publicId: result.public_id,
        url: result.secure_url,
        resourceType: result.resource_type,
        format: result.format,
        fileSize: result.bytes,
      };
    } catch (error) {
      console.error('Upload Cloudinary gagal:', error);

      throw new InternalServerErrorException(
        'Gagal mengunggah file. Silakan coba lagi.',
      );
    }
  }
}

