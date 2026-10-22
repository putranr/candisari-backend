import { Injectable } from '@nestjs/common';
import { db } from '../prisma/db.js';

@Injectable()
export class AnalyticsService {
  async recordVisit(data: {
    path: string;
    sessionId?: string;
    userAgent?: string;
    ipHash?: string;
  }) {
    return db.orm.public.WebsiteVisit.create({
      path: data.path,
      sessionId: data.sessionId ?? null,
      userAgent: data.userAgent ?? null,
      ipHash: data.ipHash ?? null,
    });
  }

  async getOverview() {
    const visits = await db.orm.public.WebsiteVisit.all();

    const totalVisits = visits.length;

    // Unique visitor berdasarkan session ID
    const uniqueVisitors = new Set(
      visits
        .map((visit) => visit.sessionId)
        .filter((sessionId): sessionId is string => Boolean(sessionId)),
    ).size;

    // Visitor hari ini
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayVisitors = new Set(
      visits
        .filter(
          (visit) =>
            new Date(visit.visitedAt).getTime() >=
            today.getTime(),
        )
        .map((visit) => visit.sessionId)
        .filter((sessionId): sessionId is string => Boolean(sessionId)),
    ).size;

    // Trend visitor per hari
    const dailyVisitors = new Map<string, Set<string>>();

    for (const visit of visits) {
      if (!visit.sessionId) {
        continue;
      }

      const date = new Date(visit.visitedAt)
        .toISOString()
        .slice(0, 10);

      if (!dailyVisitors.has(date)) {
        dailyVisitors.set(date, new Set<string>());
      }

      dailyVisitors.get(date)!.add(visit.sessionId);
    }

    const visitorTrend = Array.from(
      dailyVisitors.entries(),
    )
      .sort(([dateA], [dateB]) =>
        dateA.localeCompare(dateB),
      )
      .map(([date, sessions]) => ({
        date,
        visitors: sessions.size,
      }));

    return {
      totalVisits,
      uniqueVisitors,
      todayVisitors,
      visitorTrend,
    };
  }

  async getVisits() {
    const visits = await db.orm.public.WebsiteVisit.all();

    return visits.sort(
      (a, b) =>
        new Date(b.visitedAt).getTime() -
        new Date(a.visitedAt).getTime(),
    );
  }
}