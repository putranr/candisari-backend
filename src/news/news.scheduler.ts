import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { db } from '../prisma/db.js';

@Injectable()
export class NewsScheduler {
  @Cron('* * * * *')
  async publishScheduledNews() {
    const records = await db.orm.public.News.all();
    const now = Date.now();

    for (const news of records) {
      const scheduledAt = news.scheduledAt;

      if (news.status !== 'SCHEDULED' || !scheduledAt) {
        continue;
      }

      const scheduledTime = new Date(scheduledAt).getTime();

      if (
        !Number.isFinite(scheduledTime) ||
        scheduledTime > now
      ) {
        continue;
      }

      await db.orm.public.News.where({ id: news.id }).update({
        status: 'PUBLISHED',
        publishedAt: new Date(scheduledTime).toISOString(),
        scheduledAt: null,
      });
    }
  }
}