# Kecamatan Candisari — Matriks Figma vs Backend

**Versi:** 2.0 — diperbarui 22 Oktober 2026  
**Status:** matriks kerja berdasarkan struktur halaman yang sudah direncanakan, inventaris 118 route controller, serta pemeriksaan kode dan uji manual yang dilaporkan developer. Dokumen ini belum menjadi audit frame-per-frame terhadap file Figma tertentu.

Legenda:
- **Tersedia / diuji manual** — route dan perilaku yang dimaksud sudah dilaporkan berfungsi.
- **Tersedia; perlu pemadanan UI** — endpoint tersedia, tetapi kecocokan semua field dan state dengan desain perlu dikonfirmasi.
- **Perlu keputusan / audit** — perilaku yang diinginkan belum jelas atau workflow belum tersedia.

## 1. Halaman publik

| Halaman | Endpoint backend | Status terbaru | Gap / catatan |
|---|---|---|---|
| Beranda | `GET /hero-banners`, `/home-sections`, `/home-sections/public`, plus endpoint berita/agenda/pelayanan/statistik sesuai section yang digunakan | Banner publik hanya mengembalikan `isActive = true`; Home Sections sudah memiliki publikasi dan penjadwalan | Cocokkan urutan, field, CTA, dan section yang dibutuhkan Figma. Filter status/visibilitas tiap section perlu dipastikan. |
| Profil | `GET /profile`, `/profile-sections/public`, `/profile-sections/public/:slug`, `/organization-members` | Backend tersedia | Cocokkan jenis dan urutan section, anggota aktif, data organisasi, dan bentuk konten dengan UI. |
| Pelayanan Publik | `GET /service`, `/service/:slug`, `/service-requirement/service/:serviceId`, `/service-step/service/:serviceId`, `/service-faq/service/:serviceId` | Publik hanya menampilkan Service `ACTIVE`; filter dan endpoint admin baru dilaporkan sesuai | Cocokkan field form/relasi; pastikan data untuk 10 halaman detail layanan tersedia. |
| Berita | `GET /news`, `/news/:slug`, `/news-categories`; admin di `/news/admin` dan `/news/admin/:slug` | Publikasi langsung, unpublish, dan schedule tersedia; penjadwalan sudah diuji manual | Cocokkan editor, image, kategori, empty state, dan apakah pencarian/pagination diperlukan. |
| Agenda | `GET /agenda`, `/agenda/:slug`; admin `/agenda/admin`, `/agenda/admin/:slug` | Endpoint admin baru dilaporkan sesuai | Agenda berstatus `UPCOMING`, `ONGOING`, `FINISHED`, `CANCELLED`. API publik saat ini tidak memfilter status. Putuskan kebijakan untuk `CANCELLED`/`FINISHED`; scheduling bukan fitur Agenda saat ini. |
| Data / Statistik | `GET /statistic`, `/statistic-data` dan detail berdasarkan ID | Route tersedia | Cocokkan periode/tahun/satuan, urutan, relasi data, grafik/tabel dan filter yang dibutuhkan. |
| Dokumen | `GET /document`, `/document/:id`; admin `/document/admin`, `/document/admin/:id` | Public/admin split dan hidden draft sudah diuji sebelumnya | Cocokkan metadata, kategori, link file, ukuran/jenis file serta status terbit. |
| Pengumuman | `GET /announcement`, `/announcement/:id`; admin `/announcement/admin`, `/announcement/admin/:id` | Publik memfilter `PUBLISHED`, `publishedAt <= now`, dan belum kedaluwarsa; hasil uji manual dilaporkan sesuai | Workflow schedule/publish khusus belum tersedia. Putuskan apakah UI perlu tombol jadwal atau cukup edit status/tanggal. |
| Kontak | `GET /contact-info` | Route tersedia | Cocokkan alamat, telepon, email, jam layanan, dan social links terhadap schema aktual. |

## 2. Halaman admin dan endpoint

| Fitur admin | Endpoint utama | Status terbaru | Gap / catatan |
|---|---|---|---|
| Login/profil/password | `/auth/login`, `/auth/profile`, `/auth/change-password`, `/auth/forgot-password`, `/auth/reset-password` | Tersedia | Cocokkan DTO, aturan password, dan response/error state. |
| Dashboard | `/dashboard`, `/analytics/overview`, `/analytics/visits` | Tersedia | Cocokkan KPI/definisi metrik dengan desain dan sumber data. |
| Admin & undangan | `/admins`, `/admin-invitations`, `/admin-invitations/:adminId/resend`, `/admin-invitations/accept` | Tersedia | Cocokkan UI invitation pending/expired/resend; tindakan admin dibatasi SUPER_ADMIN. |
| CMS Berita | `/news/admin`, `/news/admin/:slug`, mutasi `/news`, serta `/:id/publish`, `/:id/unpublish`, `/:id/schedule` | Scheduling dan publikasi dilaporkan berhasil diuji | Samakan badge status, date/time picker, kategori dan image upload. |
| CMS Kategori Berita | `/news-categories`, `/news-categories/:id` | Route CRUD terdeteksi | Pastikan role guard dan perilaku hapus kategori yang masih dipakai. |
| CMS Agenda | `/agenda/admin`, `/agenda/admin/:slug`, mutasi `/agenda` dan `/agenda/:id` | Daftar/detail admin baru dilaporkan sesuai | Tidak ada route khusus schedule/publish/unpublish; status saat ini merepresentasikan lifecycle acara. |
| CMS Pelayanan | `/service/admin`, `/service/admin/:slug`, mutasi `/service` dan `/service/:id`; relasi persyaratan/langkah/FAQ | Filter ACTIVE/INACTIVE dan endpoint admin dilaporkan sesuai | Pastikan UI dapat mengubah `status` (`ACTIVE`/`INACTIVE`) dan mengelola child records. |
| CMS Dokumen | `/document/admin`, `/document/admin/:id`, mutasi `/document` dan `/document/:id` | Tersedia; public/admin split sudah diuji sebelumnya | Cocokkan upload dan publikasi dengan desain. |
| CMS Pengumuman | `/announcement/admin`, `/announcement/admin/:id`, mutasi `/announcement` dan `/announcement/:id` | Pemisahan publik/admin dan filter tanggal dilaporkan sesuai | Tidak ada route khusus schedule/publish/unpublish. Validasi UX status dan tanggal saat create/update. |
| CMS Statistik | `/statistic`, `/statistic-data` dan detail | CRUD tersedia | Cocokkan format angka, satuan, periode dan hubungan data. |
| CMS Profil/Organisasi | `/profile`, `/profile-sections/admin`, `/organization-members` | Tersedia | Cocokkan urutan section, foto anggota, status dan preview dengan desain. |
| CMS Beranda | `/hero-banners/admin`, `/home-sections` termasuk reorder, publish/unpublish/schedule | Hero banner public/admin filtering dilaporkan sesuai; Home Sections punya workflow lanjutan | Pastikan preview, state isActive, sort order, CTA dan schedule tampil jelas. |
| Upload media | `POST /media/upload?type=image|document` | Tersedia | Konfirmasi nama field multipart di kontrak frontend; tampilkan validasi ukuran/tipe dan upload error. |
| Activity log | `GET /activity-logs` | Tersedia | Cocokkan filter tindakan/user/tanggal bila memang terdapat pada desain. |

## 3. Hasil audit publikasi terakhir

| Area | Perilaku yang diimplementasikan | Hasil uji yang dilaporkan |
|---|---|---|
| Announcement | API publik hanya menampilkan `PUBLISHED`, sudah melewati waktu publikasi, dan belum kedaluwarsa; route admin melihat semua status | Sesuai |
| Hero Banner | API publik hanya menampilkan `isActive = true`; route admin melihat semua banner | Sesuai |
| Service | API publik hanya menampilkan `ACTIVE`; route admin melihat `ACTIVE` dan `INACTIVE` | Sesuai |
| Agenda | Route daftar/detail admin ditambahkan, dilindungi role admin | Sesuai |
| News | Public/admin split, publish/unpublish dan penjadwalan otomatis | Sesuai; flow schedule dilaporkan berhasil |
| Document | API publik menyembunyikan dokumen draft; admin tetap dapat mengaksesnya | Lolos uji sebelumnya |
| Home Sections / Profile Sections | Publikasi serta penjadwalan tersedia | Fitur telah dikerjakan; tidak seluruh edge case diuji ulang dalam audit ini |

## 4. Gap yang tetap perlu diputuskan

1. **Agenda publik:** API saat ini mengembalikan semua status. Putuskan dari kebutuhan konten apakah `CANCELLED` tetap harus terlihat (biasanya penting sebagai informasi pembatalan) dan bagaimana agenda `FINISHED` ditampilkan.
2. **Penjadwalan Announcement/Agenda:** tambahkan hanya jika ada kebutuhan nyata dari admin Figma. Saat ini Announcement punya `publishedAt` dan `expiredAt`, tetapi belum ada scheduler/endpoint schedule khusus. Agenda punya status siklus acara dan tanggal, bukan status draft/published.
3. **Field-to-form mapping:** cocokkan tiap form Figma terhadap DTO aktual; nama field, nilai enum, field wajib/opsional, dan nested arrays harus disepakati sebelum frontend final.
4. **Search/filter/pagination:** inventaris route tidak membuktikan dukungan query parameters. Konfirmasi kebutuhan pada tabel admin terlebih dahulu.
5. **OpenAPI/Swagger dan kontrak tipe:** pertimbangkan dokumentasi API otomatis dan tipe response bersama agar frontend tidak menebak bentuk payload.
6. **Kesiapan rilis:** cek e2e test, CORS, HTTPS, environment variable, database produksi, SMTP, Cloudinary, rate limit endpoint publik, logging aman dan backup database.
7. **Audit Figma frame-per-frame:** matriks ini berlandaskan struktur halaman yang direncanakan dan route/service yang diperiksa. Untuk checklist final per screen, cocokkan URL/node Figma yang spesifik.

## 5. Urutan kerja rekomendasi

1. Bagikan **Candisari API Integration Guide** ke frontend.
2. Cocokkan form dan tabel admin terhadap payload/response yang tertulis di panduan.
3. Implementasikan hanya gap yang terbukti ada di desain.
4. Tambahkan atau jalankan targeted test saat ada perubahan; hindari mengulang tes CRUD yang sudah lolos tanpa alasan.
5. Setelah frontend terintegrasi, lakukan pengujian end-to-end dan persiapan deployment.
