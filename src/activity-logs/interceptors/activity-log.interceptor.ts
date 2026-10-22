import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';

import { ActivityLogsService } from '../activity-logs.service.js';

@Injectable()
export class ActivityLogInterceptor
  implements NestInterceptor
{
  constructor(
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request =
      context.switchToHttp().getRequest();

    const method = request.method;
    const url =
      request.originalUrl || request.url;

    // ============================================
    // HANYA CATAT OPERASI PERUBAHAN DATA
    // ============================================
    if (
      !['POST', 'PATCH', 'DELETE'].includes(
        method,
      )
    ) {
      return next.handle();
    }

    // ============================================
    // JANGAN CATAT AUTHENTICATION / PASSWORD
    // ============================================
    const ignoredRoutes = [
      '/auth/login',
      '/auth/change-password',
      '/auth/forgot-password',
      '/auth/reset-password',
    ];

    if (
      ignoredRoutes.some((route) =>
        url.startsWith(route),
      )
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (response) => {
        try {
          // ============================================
          // AMBIL ADMIN YANG MELAKUKAN AKSI
          // ============================================
          const adminId =
            request.user?.id;

          // Hanya admin terautentikasi
          if (!adminId) {
            return;
          }

          // ============================================
          // BERSIHKAN URL
          // ============================================
          const cleanPath = url
            .split('?')[0]
            .replace(/^\/+/, '')
            .replace(/\/+$/, '');

          const segments =
            cleanPath.split('/');

          const module =
            segments[0] || 'unknown';

          // ============================================
          // AMBIL ENTITY ID DARI URL
          // Contoh:
          // /news/5
          // /home-sections/3/publish
          // ============================================
          const urlEntityId =
            Number(segments[1]);

          let entityId:
            | number
            | undefined =
            Number.isInteger(
              urlEntityId,
            ) &&
            urlEntityId > 0
              ? urlEntityId
              : undefined;

          // ============================================
          // UNTUK POST CREATE
          // AMBIL ID DARI RESPONSE
          // ============================================
          if (method === 'POST') {
            const responseEntityId =
              response?.id ??
              response?.data?.id ??
              response?.data?.data?.id;

            if (
              typeof responseEntityId ===
                'number' &&
              responseEntityId > 0
            ) {
              entityId =
                responseEntityId;
            }
          }

          // ============================================
          // TENTUKAN ACTION
          // ============================================
          let action = 'UNKNOWN';

          // --------------------------------------------
          // HOMEPAGE / HOME SECTION ACTION
          // --------------------------------------------

          if (
            url.includes(
              '/publish-arrangement',
            )
          ) {
            action =
              'PUBLISH_ARRANGEMENT';
          } else if (
            url.includes('/unpublish')
          ) {
            action = 'UNPUBLISH';
          } else if (
            url.includes('/publish')
          ) {
            action = 'PUBLISH';
          } else if (
            url.includes('/schedule')
          ) {
            action = 'SCHEDULE';
          }

          // --------------------------------------------
          // ACTION CRUD UMUM
          // --------------------------------------------

          else if (method === 'POST') {
            action = 'CREATE';
          } else if (method === 'PATCH') {
            action = 'UPDATE';
          } else if (method === 'DELETE') {
            action = 'DELETE';
          }

          // ============================================
          // DESCRIPTION
          // ============================================
          let description =
            `${action} ${module}`;

          if (
            action ===
            'PUBLISH_ARRANGEMENT'
          ) {
            description =
              'Mempublikasikan susunan Beranda';
          } else if (
            action === 'PUBLISH'
          ) {
            description =
              `Menerbitkan ${module}${
                entityId
                  ? ` #${entityId}`
                  : ''
              }`;
          } else if (
            action === 'UNPUBLISH'
          ) {
            description =
              `Menarik publikasi ${module}${
                entityId
                  ? ` #${entityId}`
                  : ''
              }`;
          } else if (
            action === 'SCHEDULE'
          ) {
            description =
              `Menjadwalkan ${module}${
                entityId
                  ? ` #${entityId}`
                  : ''
              }`;
          } else {
            description =
              `${action} ${module}${
                entityId
                  ? ` #${entityId}`
                  : ''
              }`;
          }

          // ============================================
          // SIMPAN ACTIVITY LOG
          // ============================================
          await this.activityLogsService.create({
            adminId,
            action,
            module,
            entityId,
            description,
          });
        } catch (error) {
          console.error(
            'Gagal membuat activity log:',
            error,
          );
        }
      }),
    );
  }
}