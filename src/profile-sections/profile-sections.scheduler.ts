import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { db } from '../prisma/db.js';

@Injectable()
export class ProfileSectionsScheduler {
  @Cron('* * * * *')
  async publishScheduledSections() {
    const sections = await db.orm.public.ProfileSection.all();
    const now = Date.now();

    const dueSections = sections.filter((section) => {
      if (
        section.status !== 'SCHEDULED' ||
        !section.scheduledAt
      ) {
        return false;
      }

      const scheduledTime = new Date(
        section.scheduledAt,
      ).getTime();

      return (
        Number.isFinite(scheduledTime) &&
        scheduledTime <= now
      );
    });

    for (const section of dueSections) {
      await db.orm.public.ProfileSection
        .where({ id: section.id })
        .update({
          status: 'PUBLISHED',
          publishedAt: new Date(
            section.scheduledAt as any,
          ).toISOString(),
          scheduledAt: null,
        });
    }
  }
}
