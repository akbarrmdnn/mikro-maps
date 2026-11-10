# Mikro Maps

Platform peta interaktif untuk menemukan dan mendata UMKM (Usaha Mikro, Kecil, dan Menengah) di sekitar Anda. Project ini dibangun sebagai portofolio **Full-Stack Web Development**.

🔗 **Live Demo:** [mikro-maps.vercel.app](https://mikro-maps.vercel.app)
🔗 **Backend API:** [mikro-maps-production.up.railway.app/api/umkm](https://mikro-maps-production.up.railway.app/api/umkm)

## Fitur Utama
- **Peta Interaktif:** Menampilkan lokasi UMKM dengan Leaflet & OpenStreetMap.
- **Pencarian & Filter:** Cari UMKM berdasarkan nama atau filter berdasarkan kategori.
- **Simpan Koleksi:** Simpan tempat ke daftar Favorit, Rencana Kunjungan, dll (tersimpan di LocalStorage).
- **Menu Terbaru:** Lihat daftar UMKM yang paling baru ditambahkan.
- **Partisipasi (CRUD):** Tambahkan UMKM baru langsung dari peta. Data dikirim ke server dan tersimpan secara global (bisa dilihat oleh semua user).
- **Responsive Design:** Tampilan optimal di Desktop maupun Mobile.

## 🛠️ Tech Stack
**Frontend:**
- HTML5, CSS3 (Tailwind CSS via CDN)
- Vanilla JavaScript (ES Modules)
- Leaflet.js (Peta & Mini-map)
- LocalStorage API

**Backend:**
- Node.js
- Express.js
- REST API (GET & POST)
- File System (JSON sebagai database sementara)

**Deployment:**
- Frontend: Vercel
- Backend: Railway

## Cara Menjalankan di Lokal
Karena project ini terdiri dari Frontend dan Backend, Anda perlu menjalankan keduanya.

**1. Jalankan Backend**
```bash
cd backend
npm install
node server.js

**2. Jalankan Frontend**
python3 -m http.server 5500

## Author

**Akbar**
- GitHub: [@akbarrmdnn](https://github.com/akbarrmdnn)
