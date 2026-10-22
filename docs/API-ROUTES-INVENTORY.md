# Inventaris Route API — Kecamatan Candisari

Tanggal pemeriksaan: 2026-10-22 13:31:03
Jumlah route terdeteksi: 118

> Inventaris statis berdasarkan decorator controller. Konfigurasi global, DTO, dan perilaku service masih perlu diperiksa.

| Method | Endpoint | Handler | Akses terdeteksi | Controller |
|---|---|---|---|---|
| GET | `/` | getHello | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | app.controller.ts |
| GET | `/activity-logs` | findAll | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | activity-logs.controller.ts |
| POST | `/admin-invitations` | createInvitation | Roles decorator: 'SUPER_ADMIN' | admin-invitations.controller.ts |
| POST | `/admin-invitations/:adminId/resend` | resendInvitation | Roles decorator: 'SUPER_ADMIN' | admin-invitations.controller.ts |
| POST | `/admin-invitations/accept` | acceptInvitation | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | admin-invitations.controller.ts |
| GET | `/admins` | findAll | Roles decorator: 'SUPER_ADMIN' | admins.controller.ts |
| POST | `/admins` | create | Roles decorator: 'SUPER_ADMIN' | admins.controller.ts |
| DELETE | `/admins/:id` | remove | Roles decorator: 'SUPER_ADMIN' | admins.controller.ts |
| GET | `/admins/:id` | findOne | Roles decorator: 'SUPER_ADMIN' | admins.controller.ts |
| PATCH | `/admins/:id` | update | Roles decorator: 'SUPER_ADMIN' | admins.controller.ts |
| PATCH | `/admins/:id/status` | updateStatus | Roles decorator: 'SUPER_ADMIN' | admins.controller.ts |
| GET | `/agenda` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | agenda.controller.ts |
| POST | `/agenda` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | agenda.controller.ts |
| DELETE | `/agenda/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | agenda.controller.ts |
| PATCH | `/agenda/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | agenda.controller.ts |
| GET | `/agenda/:slug` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | agenda.controller.ts |
| GET | `/analytics/overview` | getOverview | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | analytics.controller.ts |
| GET | `/analytics/visits` | getVisits | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | analytics.controller.ts |
| POST | `/analytics/visits` | recordVisit | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | analytics.controller.ts |
| GET | `/announcement` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | announcement.controller.ts |
| POST | `/announcement` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | announcement.controller.ts |
| DELETE | `/announcement/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | announcement.controller.ts |
| GET | `/announcement/:id` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | announcement.controller.ts |
| PATCH | `/announcement/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | announcement.controller.ts |
| POST | `/auth/change-password` | changePassword | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | auth.controller.ts |
| POST | `/auth/forgot-password` | forgotPassword | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | auth.controller.ts |
| POST | `/auth/login` | login | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | auth.controller.ts |
| GET | `/auth/profile` | getProfile | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | auth.controller.ts |
| POST | `/auth/reset-password` | resetPassword | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | auth.controller.ts |
| GET | `/contact-info` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | contact-info.controller.ts |
| PATCH | `/contact-info` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | contact-info.controller.ts |
| POST | `/contact-info` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | contact-info.controller.ts |
| GET | `/dashboard` | getOverview | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | dashboard.controller.ts |
| GET | `/document` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | document.controller.ts |
| POST | `/document` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | document.controller.ts |
| DELETE | `/document/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | document.controller.ts |
| GET | `/document/:id` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | document.controller.ts |
| PATCH | `/document/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | document.controller.ts |
| GET | `/document/admin` | findAllAdmin | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | document.controller.ts |
| GET | `/document/admin/:id` | findOneAdmin | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | document.controller.ts |
| GET | `/hero-banners` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | hero-banner.controller.ts |
| POST | `/hero-banners` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | hero-banner.controller.ts |
| DELETE | `/hero-banners/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | hero-banner.controller.ts |
| GET | `/hero-banners/:id` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | hero-banner.controller.ts |
| PATCH | `/hero-banners/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | hero-banner.controller.ts |
| GET | `/home-sections` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | home-sections.controller.ts |
| POST | `/home-sections` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| DELETE | `/home-sections/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| GET | `/home-sections/:id` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | home-sections.controller.ts |
| PATCH | `/home-sections/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| POST | `/home-sections/:id/publish` | publish | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| POST | `/home-sections/:id/schedule` | schedule | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| POST | `/home-sections/:id/unpublish` | unpublish | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| GET | `/home-sections/preview` | findPreview | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| GET | `/home-sections/public` | findPublished | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | home-sections.controller.ts |
| POST | `/home-sections/publish-arrangement` | publishArrangement | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| POST | `/home-sections/reorder` | reorder | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | home-sections.controller.ts |
| POST | `/media/upload` | FileInterceptor | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | media.controller.ts |
| GET | `/news` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | news.controller.ts |
| POST | `/news` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news.controller.ts |
| DELETE | `/news/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news.controller.ts |
| PATCH | `/news/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news.controller.ts |
| POST | `/news/:id/publish` | publish | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news.controller.ts |
| POST | `/news/:id/schedule` | schedule | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news.controller.ts |
| POST | `/news/:id/unpublish` | unpublish | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news.controller.ts |
| GET | `/news/:slug` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | news.controller.ts |
| GET | `/news/admin` | findAllAdmin | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news.controller.ts |
| GET | `/news/admin/:slug` | findOneAdmin | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news.controller.ts |
| GET | `/news-categories` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | news-category.controller.ts |
| POST | `/news-categories` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news-category.controller.ts |
| DELETE | `/news-categories/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news-category.controller.ts |
| GET | `/news-categories/:id` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | news-category.controller.ts |
| PATCH | `/news-categories/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | news-category.controller.ts |
| GET | `/organization-members` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | organization-member.controller.ts |
| POST | `/organization-members` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | organization-member.controller.ts |
| DELETE | `/organization-members/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | organization-member.controller.ts |
| GET | `/organization-members/:id` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | organization-member.controller.ts |
| PATCH | `/organization-members/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | organization-member.controller.ts |
| GET | `/profile` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | profile.controller.ts |
| PATCH | `/profile` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile.controller.ts |
| POST | `/profile` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile.controller.ts |
| GET | `/profile-sections/admin` | findAllAdmin | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile-sections.controller.ts |
| POST | `/profile-sections/admin` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile-sections.controller.ts |
| DELETE | `/profile-sections/admin/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile-sections.controller.ts |
| GET | `/profile-sections/admin/:id` | findOneAdmin | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile-sections.controller.ts |
| PATCH | `/profile-sections/admin/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile-sections.controller.ts |
| POST | `/profile-sections/admin/:id/publish` | publish | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile-sections.controller.ts |
| POST | `/profile-sections/admin/:id/schedule` | schedule | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile-sections.controller.ts |
| POST | `/profile-sections/admin/:id/unpublish` | unpublish | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | profile-sections.controller.ts |
| GET | `/profile-sections/public` | findPublished | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | profile-sections.controller.ts |
| GET | `/profile-sections/public/:slug` | findPublishedBySlug | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | profile-sections.controller.ts |
| GET | `/service` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | service.controller.ts |
| POST | `/service` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service.controller.ts |
| DELETE | `/service/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service.controller.ts |
| PATCH | `/service/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service.controller.ts |
| GET | `/service/:slug` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | service.controller.ts |
| POST | `/service-faq` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-faq.controller.ts |
| DELETE | `/service-faq/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-faq.controller.ts |
| PATCH | `/service-faq/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-faq.controller.ts |
| GET | `/service-faq/service/:serviceId` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | service-faq.controller.ts |
| POST | `/service-requirement` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-requirement.controller.ts |
| DELETE | `/service-requirement/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-requirement.controller.ts |
| PATCH | `/service-requirement/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-requirement.controller.ts |
| GET | `/service-requirement/service/:serviceId` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | service-requirement.controller.ts |
| POST | `/service-step` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-step.controller.ts |
| DELETE | `/service-step/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-step.controller.ts |
| PATCH | `/service-step/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | service-step.controller.ts |
| GET | `/service-step/service/:serviceId` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | service-step.controller.ts |
| GET | `/statistic` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | statistic.controller.ts |
| POST | `/statistic` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | statistic.controller.ts |
| DELETE | `/statistic/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | statistic.controller.ts |
| GET | `/statistic/:id` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | statistic.controller.ts |
| PATCH | `/statistic/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | statistic.controller.ts |
| GET | `/statistic-data` | findAll | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | statistic-data.controller.ts |
| POST | `/statistic-data` | create | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | statistic-data.controller.ts |
| DELETE | `/statistic-data/:id` | remove | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | statistic-data.controller.ts |
| GET | `/statistic-data/:id` | findOne | Tidak ada guard lokal terdeteksi; cek global guard dan tujuan route | statistic-data.controller.ts |
| PATCH | `/statistic-data/:id` | update | Roles decorator: 'ADMIN', 'SUPER_ADMIN' | statistic-data.controller.ts |
