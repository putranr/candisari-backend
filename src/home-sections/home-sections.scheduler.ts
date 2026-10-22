import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { db } from '../prisma/db.js';

@Injectable()
export class HomeSectionsScheduler {
  private readonly logger = new Logger(
    HomeSectionsScheduler.name,
  );

  @Cron('* * * * *')
  async publishScheduledSections() {
    const sections =
      await db.orm.public.HomeSection.all();

    const now = Date.now();

    const scheduledSections = sections.filter(
      (section) =>
        section.status === 'SCHEDULED' &&
        section.scheduledAt !== null &&
        new Date(section.scheduledAt).getTime() <= now,
    );

    for (const section of scheduledSections) {
      await db.orm.public.HomeSection
        .where({ id: section.id })
        .update({
          status: 'PUBLISHED',
          publishedAt: section.scheduledAt,
          scheduledAt: null,
        });

      this.logger.log(
        `Home section #${section.id} otomatis diterbitkan`,
      );
    }
  }
}