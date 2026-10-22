import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';

import { NewsModule } from './news/news.module.js';
import { AgendaModule } from './agenda/agenda.module.js';
import { ServiceModule } from './service/service.module.js';
import { ServiceRequirementModule } from './service-requirement/service-requirement.module.js';
import { ServiceStepModule } from './service-step/service-step.module.js';
import { ServiceFaqModule } from './service-faq/service-faq.module.js';

import { DocumentModule } from './document/document.module.js';
import { AnnouncementModule } from './announcement/announcement.module.js';
import { StatisticModule } from './statistic/statistic.module.js';
import { StatisticDataModule } from './statistic-data/statistic-data.module.js';

import { NewsCategoryModule } from './news-category/news-category.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { OrganizationMemberModule } from './organization-member/organization-member.module.js';
import { ContactInfoModule } from './contact-info/contact-info.module.js';
import { HeroBannerModule } from './hero-banner/hero-banner.module.js';

import { AdminsModule } from './admins/admins.module.js';
import { AdminInvitationsModule } from './admin-invitations/admin-invitations.module.js';
import { MailModule } from './mail/mail.module.js';

import { ActivityLogsModule } from './activity-logs/activity-logs.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ActivityLogInterceptor } from './activity-logs/interceptors/activity-log.interceptor.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { HomeSectionsModule } from './home-sections/home-sections.module.js';
import { ProfileSectionsModule } from './profile-sections/profile-sections.module.js';
import { ScheduleModule } from '@nestjs/schedule';

import { MediaModule } from './media/media.module.js';

@Module({
  imports: [
    MediaModule,
    ActivityLogsModule,
    DashboardModule,
    PrismaModule,
    AuthModule,

    NewsModule,
    AgendaModule,
    ServiceModule,
    ServiceRequirementModule,
    ServiceStepModule,
    ServiceFaqModule,

    DocumentModule,
    AnnouncementModule,
    StatisticModule,
    StatisticDataModule,

    NewsCategoryModule,
    ProfileModule,
    OrganizationMemberModule,
    ContactInfoModule,
    HeroBannerModule,

    AdminsModule,
    AdminInvitationsModule,
    MailModule,
    AnalyticsModule,
    HomeSectionsModule,
    ProfileSectionsModule,
    ScheduleModule.forRoot(),
  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
  ],
})
export class AppModule {}
