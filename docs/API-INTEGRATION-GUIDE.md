# Kecamatan Candisari — Panduan Integrasi API untuk Frontend

**Versi:** 2.0 — diperbarui 22 Oktober 2026  
**Status:** panduan integrasi berdasarkan inventaris controller dan validasi manual yang dilaporkan. Bukan pengganti kontrak OpenAPI yang dihasilkan otomatis; detail respons dan relasi untuk beberapa modul masih perlu dikonfirmasi dari DTO/service.

## 1. Base URL dan autentikasi

Base URL pengembangan:

```text
http://localhost:3000
```

Endpoint admin menggunakan bearer token kecuali disebutkan lain:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

Gunakan token di environment Postman/frontend development; jangan menaruh token atau secret dalam source code, log, tangkapan layar, atau Git. `SUPER_ADMIN` dibutuhkan untuk pengelolaan admin dan undangan; sebagian besar aksi CMS menerima `ADMIN` dan `SUPER_ADMIN`.

Global `ValidationPipe` terdeteksi pada `src/main.ts`, dengan `whitelist: true` dan `forbidNonWhitelisted: true`. Pastikan DTO disertakan pada semua body endpoint agar kebijakan ini benar-benar berlaku.

## 2. Bentuk respons

Banyak controller memakai envelope berikut, tetapi beberapa endpoint mengembalikan data langsung. Frontend harus mengacu pada respons endpoint masing-masing.

```json
{
  "success": true,
  "message": "Pesan hasil operasi",
  "data": {}
}
```

Tangani status HTTP `4xx`/`5xx`, state loading, empty state, dan error. Jangan berasumsi semua controller punya response envelope yang identik.

## 3. Auth, admin, dan undangan

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/auth/login` | Publik |
| GET | `/auth/profile` | ADMIN / SUPER_ADMIN |
| POST | `/auth/change-password` | ADMIN / SUPER_ADMIN |
| POST | `/auth/forgot-password` | Publik |
| POST | `/auth/reset-password` | Publik; token reset harus valid dan belum kedaluwarsa |
| GET | `/admins` | SUPER_ADMIN |
| POST | `/admins` | SUPER_ADMIN |
| GET | `/admins/:id` | SUPER_ADMIN |
| PATCH | `/admins/:id` | SUPER_ADMIN |
| PATCH | `/admins/:id/status` | SUPER_ADMIN |
| DELETE | `/admins/:id` | SUPER_ADMIN |
| POST | `/admin-invitations` | SUPER_ADMIN |
| POST | `/admin-invitations/:adminId/resend` | SUPER_ADMIN |
| POST | `/admin-invitations/accept` | Publik; token undangan wajib valid |

## 4. Dashboard, analytics, dan activity log

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/dashboard` | ADMIN / SUPER_ADMIN |
| GET | `/analytics/overview` | ADMIN / SUPER_ADMIN |
| GET | `/analytics/visits` | ADMIN / SUPER_ADMIN |
| POST | `/analytics/visits` | Publik; validasi dan rate limiting layak dipastikan |
| GET | `/activity-logs` | ADMIN / SUPER_ADMIN |

## 5. Berita

| Method | Endpoint | Akses / tujuan |
|---|---|---|
| GET | `/news` | Publik; hanya berita yang telah terbit dan waktunya tiba |
| GET | `/news/:slug` | Publik; detail berita yang telah terbit |
| GET | `/news/admin` | ADMIN / SUPER_ADMIN; semua berita termasuk draf/terjadwal |
| GET | `/news/admin/:slug` | ADMIN / SUPER_ADMIN |
| POST | `/news` | ADMIN / SUPER_ADMIN; membuat draf |
| PATCH | `/news/:id` | ADMIN / SUPER_ADMIN |
| DELETE | `/news/:id` | ADMIN / SUPER_ADMIN |
| POST | `/news/:id/publish` | ADMIN / SUPER_ADMIN; publikasi langsung |
| POST | `/news/:id/unpublish` | ADMIN / SUPER_ADMIN; menarik publikasi dan membersihkan jadwal |
| POST | `/news/:id/schedule` | ADMIN / SUPER_ADMIN; menjadwalkan publikasi |
| GET | `/news-categories` | Endpoint daftar kategori |
| GET | `/news-categories/:id` | Endpoint detail kategori |
| POST | `/news-categories` | Role/guard mengikuti controller aktual |
| PATCH | `/news-categories/:id` | Role/guard mengikuti controller aktual |
| DELETE | `/news-categories/:id` | Role/guard mengikuti controller aktual |

Contoh request jadwal News:

```http
POST /news/6/schedule
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "scheduledAt": "2026-10-23T09:00:00+07:00"
}
```

Waktu harus berada di masa mendatang. Scheduler memeriksa berita setiap menit selama proses backend aktif. Ketika jatuh tempo, status menjadi `PUBLISHED`, `publishedAt` diisi, dan `scheduledAt` dikosongkan. Fitur ini telah divalidasi manual oleh developer.

## 6. Agenda

| Method | Endpoint | Akses / tujuan |
|---|---|---|
| GET | `/agenda` | Publik; daftar agenda dengan status lifecycle yang tersimpan |
| GET | `/agenda/:slug` | Publik; detail agenda |
| GET | `/agenda/admin` | ADMIN / SUPER_ADMIN; daftar lengkap untuk CMS |
| GET | `/agenda/admin/:slug` | ADMIN / SUPER_ADMIN; detail CMS |
| POST | `/agenda` | ADMIN / SUPER_ADMIN |
| PATCH | `/agenda/:id` | ADMIN / SUPER_ADMIN |
| DELETE | `/agenda/:id` | ADMIN / SUPER_ADMIN |

Enum status Agenda saat ini: `UPCOMING`, `ONGOING`, `FINISHED`, `CANCELLED`. Ini merupakan status siklus acara, bukan status draft/published. Endpoint publik saat ini mengembalikan status yang tersimpan tanpa filter status. Pastikan desain frontend memang ingin menampilkan agenda berstatus `CANCELLED`/`FINISHED`; jangan menganggap Agenda sudah mempunyai workflow schedule/publish seperti News.

DTO Agenda menerima `title`, `slug`, `description`, dan `startDate` sebagai field wajib; `endDate`, `location`, dan `image` opsional. Tanggal menggunakan format date-time yang valid; `image` harus berupa URL bila diberikan.

## 7. Pengumuman

| Method | Endpoint | Akses / tujuan |
|---|---|---|
| GET | `/announcement` | Publik; pengumuman terbit, waktu terbit sudah tiba, dan belum kedaluwarsa |
| GET | `/announcement/:id` | Publik; detail dengan filter publik yang sama |
| GET | `/announcement/admin` | ADMIN / SUPER_ADMIN; semua status |
| GET | `/announcement/admin/:id` | ADMIN / SUPER_ADMIN; detail semua status |
| POST | `/announcement` | ADMIN / SUPER_ADMIN |
| PATCH | `/announcement/:id` | ADMIN / SUPER_ADMIN |
| DELETE | `/announcement/:id` | ADMIN / SUPER_ADMIN |

Kondisi publik: `status = PUBLISHED`, `publishedAt` tidak null dan `publishedAt <= sekarang`. Jika `expiredAt` terisi, waktunya harus masih di masa mendatang. Tes manual publik/admin untuk perubahan filter ini dilaporkan sesuai.

Field create DTO: `title`, `slug`, `content` wajib; `priority` opsional (`NORMAL`, `IMPORTANT`, `URGENT`); `status` opsional (`DRAFT`, `PUBLISHED`, `ARCHIVED`); `publishedAt` dan `expiredAt` opsional berupa tanggal ISO. Jika status diatur `PUBLISHED`, pengumuman tetap tidak akan terlihat publik apabila `publishedAt` kosong atau di masa depan.

Belum ada endpoint khusus schedule/publish/unpublish Announcement. Jika workflow Figma memerlukan itu, perlu diputuskan implementasi dan transisi status tersendiri.

## 8. Pelayanan publik

| Method | Endpoint | Akses / tujuan |
|---|---|---|
| GET | `/service` | Publik; hanya status `ACTIVE` |
| GET | `/service/:slug` | Publik; detail hanya ketika `ACTIVE` |
| GET | `/service/admin` | ADMIN / SUPER_ADMIN; semua layanan termasuk INACTIVE |
| GET | `/service/admin/:slug` | ADMIN / SUPER_ADMIN; detail semua status |
| POST | `/service` | ADMIN / SUPER_ADMIN |
| PATCH | `/service/:id` | ADMIN / SUPER_ADMIN |
| DELETE | `/service/:id` | ADMIN / SUPER_ADMIN |
| GET | `/service-requirement/service/:serviceId` | Endpoint persyaratan menurut service ID |
| POST/PATCH/DELETE | `/service-requirement` dan `/service-requirement/:id` | Role/guard mengikuti controller aktual |
| GET | `/service-step/service/:serviceId` | Endpoint langkah menurut service ID |
| POST/PATCH/DELETE | `/service-step` dan `/service-step/:id` | Role/guard mengikuti controller aktual |
| GET | `/service-faq/service/:serviceId` | Endpoint FAQ menurut service ID |
| POST/PATCH/DELETE | `/service-faq` dan `/service-faq/:id` | Role/guard mengikuti controller aktual |

Status Service: `ACTIVE` dan `INACTIVE`. DTO create/update mendukung field opsional `status` dengan dua nilai ini. Tes manual filter publik dan endpoint admin dilaporkan sesuai.

Field Service yang terdeteksi dari DTO: `name`, `slug`, `description` wajib; `shortDescription`, `icon`, `estimatedTime`, `cost`, dan `status` opsional.

## 9. Dokumen

| Method | Endpoint | Akses / tujuan |
|---|---|---|
| GET | `/document` | Publik; hanya dokumen yang sudah dipublikasikan sesuai service |
| GET | `/document/:id` | Publik; detail hanya dokumen yang dapat dilihat publik |
| GET | `/document/admin` | ADMIN / SUPER_ADMIN; semua dokumen |
| GET | `/document/admin/:id` | ADMIN / SUPER_ADMIN; semua status |
| POST | `/document` | ADMIN / SUPER_ADMIN |
| PATCH | `/document/:id` | ADMIN / SUPER_ADMIN |
| DELETE | `/document/:id` | ADMIN / SUPER_ADMIN |

Public/admin split dan penyaringan dokumen draft telah divalidasi sebelumnya. Untuk upload file, gunakan URL hasil upload media.

## 10. Profil, organisasi, beranda, statistik, dan kontak

| Fitur | Endpoint utama |
|---|---|
| Profil singleton | `GET /profile`; `POST/PATCH /profile` |
| Section profil publik | `GET /profile-sections/public`, `GET /profile-sections/public/:slug` |
| Section profil admin | `GET /profile-sections/admin`, `GET /profile-sections/admin/:id`, mutasi dan aksi publish/unpublish/schedule per ID |
| Anggota organisasi | `GET /organization-members`, `GET /organization-members/:id`, mutasi di `/organization-members/:id` dan `/organization-members` |
| Banner publik | `GET /hero-banners`, `GET /hero-banners/:id` — hanya banner aktif |
| Banner admin | `GET /hero-banners/admin`, `GET /hero-banners/admin/:id` — termasuk nonaktif |
| Section beranda | `/home-sections`, `/home-sections/public`, `/home-sections/preview`; terdapat aksi publish/unpublish/schedule/reorder |
| Statistik | `/statistic`, `/statistic/:id`, `/statistic-data`, `/statistic-data/:id` |
| Info kontak | `GET /contact-info`; pengelolaan di `/contact-info` |
| Upload media | `POST /media/upload?type=image` atau `?type=document` |

Filter banner publik/admin telah divalidasi manual dan dilaporkan sesuai.

## 11. Upload media

```http
POST /media/upload?type=image
POST /media/upload?type=document
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

Batas yang telah diimplementasikan:

- Gambar: JPG/JPEG/PNG/WEBP, maksimal 5 MB.
- Dokumen: PDF/DOCX/XLSX, maksimal 10 MB.

Konfirmasi nama field multipart dari controller/interceptor sebelum mengunci implementasi frontend. UI harus menangani progress, validasi jenis/ukuran, kegagalan upload, dan URL file hasil upload.

## 12. Panduan integrasi untuk Radit

1. Gunakan endpoint `/.../admin` untuk tabel CMS yang memilikinya; endpoint publik memang sengaja menyembunyikan konten draf/nonaktif.
2. Gunakan numeric ID untuk aksi `/:id`, dan `slug` pada detail yang memakai `/:slug`.
3. Date-time dikirim sebagai ISO 8601 beserta timezone, misalnya `2026-10-23T09:00:00+07:00`.
4. Tampilkan loading, empty, error, dan success state.
5. Jangan mengasumsikan pagination, pencarian, filter, atau sort query tersedia jika belum dikonfirmasi di service/controller.
6. Endpoint admin perlu bearer token; UI yang menyembunyikan tombol tidak menggantikan role guard backend.
7. Respons API bervariasi; integrasikan berdasarkan response endpoint aktual.

## 13. Validasi yang dilaporkan selesai

Pada 22 Oktober 2026, developer melaporkan pemeriksaan yang baru dilakukan sesuai untuk:

- filter publik pengumuman dan daftar/detail admin;
- filter banner aktif untuk publik dan semua banner bagi admin;
- filter layanan aktif untuk publik dan semua layanan bagi admin;
- akses endpoint daftar admin Agenda.

Status di atas bersandar pada hasil uji manual yang dilaporkan, bukan pengujian otomatis yang dijalankan oleh dokumen ini.

## 14. Pekerjaan yang tersisa sebelum kontrak dianggap final

- Periksa payload/response lengkap semua DTO dan service; route inventory saja tidak menjelaskan semua field nested.
- Putuskan apakah publik boleh melihat agenda `CANCELLED` dan `FINISHED`; endpoint Agenda saat ini tidak memfilter status.
- Tambahkan workflow schedule/publish Announcement atau Agenda hanya bila diperlukan desain.
- Pastikan guard pada modul terkait dan global guard aplikasi tetap sesuai.
- Verifikasi kontrak search/filter/pagination jika desain tabel membutuhkan fitur tersebut.
- Pertimbangkan OpenAPI/Swagger serta automated e2e untuk mengurangi perbedaan kontrak dengan frontend.
- Siapkan konfigurasi deployment (database, CORS, HTTPS, Cloudinary, SMTP, rate limiting, logging aman, backup DB).
