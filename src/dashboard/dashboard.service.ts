import { Injectable } from '@nestjs/common';
import { db } from '../prisma/db.js';
import { AnalyticsService } from '../analytics/analytics.service.js';

@Injectable()
export class DashboardService {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  async getOverview() {
    const [
      news,
      announcements,
      documents,
      services,
      agendas,
      activityLogs,
    ] = await Promise.all([
      db.orm.public.News.all(),
      db.orm.public.Announcement.all(),
      db.orm.public.Document.all(),
      db.orm.public.Service.all(),
      db.orm.public.Agenda.all(),
      db.orm.public.ActivityLog.all(),
    ]);

    const now = new Date();

    // ==========================================
    // STATISTIK KONTEN
    // ==========================================

    const publishedNews = news.filter(
      (item) => item.status === 'PUBLISHED',
    );

    const publishedAnnouncements = announcements.filter(
      (item) => item.status === 'PUBLISHED',
    );

    const publishedDocuments = documents.filter(
      (item) => item.publishedAt !== null,
    );

    const publishedContent =
      publishedNews.length +
      publishedAnnouncements.length +
      publishedDocuments.length;

    // ==========================================
    // STATISTIK PELAYANAN
    // ==========================================

    const activeServices = services.filter(
      (item) => item.status === 'ACTIVE',
    ).length;

    // ==========================================
    // STATISTIK AGENDA
    // ==========================================

    const upcomingAgenda = agendas.filter(
      (item) =>
        item.status === 'UPCOMING' &&
        new Date(item.startDate).getTime() >= now.getTime(),
    ).length;

    // ==========================================
    // ANALYTICS WEBSITE
    // ==========================================

    const analytics =
      await this.analyticsService.getOverview();

    // ==========================================
    // AKTIVITAS TERBARU
    // ==========================================

    const recentActivity = activityLogs
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    // ==========================================
    // RESPONSE DASHBOARD
    // ==========================================

    return {
      statistics: {
        websiteVisitors: analytics.uniqueVisitors,
        publishedContent,
        activeServices,
        upcomingAgenda,
        documents: documents.length,
      },

      analytics: {
        totalVisits: analytics.totalVisits,
        todayVisitors: analytics.todayVisitors,
        visitorTrend: analytics.visitorTrend,
      },

      recentActivity,
    };
  }
}