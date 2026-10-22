import { Injectable } from '@nestjs/common';

import { db } from '../prisma/db.js';

@Injectable()
export class ActivityLogsService {
  async findAll() {
    const logs =
      await db.orm.public.ActivityLog.all();

    return logs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
  }

  async create(data: {
    adminId: number;
    action: string;
    module: string;
    entityId?: number;
    description: string;
  }) {
    return db.orm.public.ActivityLog.create({
      adminId: data.adminId,
      action: data.action,
      module: data.module,
      entityId: data.entityId ?? null,
      description: data.description,
    });
  }
}
