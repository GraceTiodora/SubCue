<div align="center">

# 💳 SubCue AI

### Kecerdasan Buatan untuk Kesehatan Finansial Langganan Digital Anda

**Jangan pernah lagi membayar untuk langganan yang Anda lupakan.**  
**Langganan lebih cerdas. Keuangan lebih sehat.**

--- 

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Groq](https://img.shields.io/badge/Groq-Llama3-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**[Live Demo (Netlify)](https://agent-6a61c1d41cb6ced1a0822675--subcue.netlify.app/) | [Public GitHub Repository](#)**

</div>

---

## 1. Latar Belakang Masalah (The Problem)

Di era digital saat ini, layanan berlangganan (Netflix, Spotify, ChatGPT, Zoom, dll) telah menjadi kebutuhan primer. Namun, kemudahan berlangganan seringkali menjebak pengguna ke dalam masalah keuangan terselubung yang dikenal sebagai **"Subscription Fatigue" (Kelelahan Berlangganan)**. 

Berdasarkan analisis kami, pengguna sering menghadapi masalah berikut:
1. **Lupa Tanggal Tagihan:** Sistem *auto-renewal* (perpanjangan otomatis) sering menyedot saldo rekening secara diam-diam tanpa disadari.
2. **Pemborosan Terselubung (Zombie Subscriptions):** Terus membayar layanan yang sangat jarang atau bahkan tidak pernah dipakai lagi.
3. **Fungsi yang Tumpang Tindih:** Membayar Spotify sekaligus Apple Music, atau ChatGPT Plus sekaligus Claude Pro tanpa menyadari pemborosan fungsional.
4. **Kebutaan Finansial Jangka Panjang:** Sulit melacak akumulasi pengeluaran bulanan karena terpecah di puluhan layanan berbeda.

Sayangnya, aplikasi pencatat keuangan atau pengingat jadwal biasa **hanya memberi notifikasi** tanpa memberikan wawasan tentang *apakah langganan tersebut masih layak dipertahankan*.

---

## 2. Solusi dari SubCue AI

**SubCue AI** hadir bukan sekadar sebagai aplikasi pengingat, melainkan sebagai **Konsultan Keuangan Pribadi Berbasis AI**. Kami menggabungkan pengingat cerdas dengan analisis pengeluaran yang ditenagai oleh kecerdasan buatan.

Daripada sekadar mengingatkan Anda bahwa tagihan Netflix akan jatuh tempo, AI kami akan mengevaluasi tingkat penggunaan Anda dan merekomendasikan: *"Anda jarang memakai layanan X bulan ini, batalkan langganan tersebut untuk menghemat Rp 150.000!"*

### Fitur Unggulan (Core Features)
* **Skor Efisiensi AI:** Ditenagai oleh **Groq & Llama-3**, AI secara instan menghitung tingkat kesehatan pengeluaran digital Anda dari skala 0-100.
* **Rekomendasi AI Personal:** Saran konkret dan *actionable* (berhenti berlangganan, *downgrade*, atau pertahankan) murni dalam Bahasa Indonesia.
* **Integrasi Otomatis Google Calendar:** 1-klik untuk memasang pengingat otomatis **3 Hari Sebelum (H-3)** jadwal tagihan.
* **Analitik Visual & Proyeksi:** Grafik interaktif (menggunakan Recharts) untuk melacak tren pengeluaran (3 bulan, 6 bulan, 1 tahun).
* **Asisten Chat AI:** Tanyakan pertanyaan finansial kompleks kepada bot kami langsung dari Dashboard.
* **Dukungan Tema (Light/Dark Mode):** Antarmuka elegan dan mulus yang menyesuaikan kenyamanan mata pengguna.

---

## 3. Arsitektur & Teknologi

SubCue AI dibangun dengan pendekatan **Microservices** yang memisahkan Frontend dan Backend untuk memastikan latensi minimal dan skalabilitas maksimal.

**Frontend: Next.js 14 + TailwindCSS + shadcn/ui**
* Menyajikan UI responsif 3-kolom bergaya *Enterprise Dashboard*.

**Backend: FastAPI + Python + SQLite**
* Menangani seluruh *logical routing* dan integrasi API AI (menggunakan **Groq API / Llama-3** untuk inferensi super cepat tanpa *delay*).

**Mengapa Arsitektur Ini?**
Pemisahan backend memungkinkan kami memanfaatkan ekosistem AI/ML Python yang sangat matang secara maksimal. Dengan menggunakan Groq API, kami mendapatkan kecepatan respons AI yang tidak mungkin dicapai oleh *provider* tradisional, sementara Next.js menyajikan interaktivitas instan di sisi pengguna.

---

## 4. Panduan Menjalankan Aplikasi Lokal

### Status Pengerjaan
**Status:** MVP Selesai dalam rentang waktu Hackathon 3 Jam.

### Langkah Menjalankan

**1. Clone Repository**
```bash
git clone https://github.com/username/SubCue-ai.git
cd SubCue-ai
```

**2. Setup Backend (FastAPI)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env # (Isi kunci GROQ_API_KEY Anda)
uvicorn main:app --reload
```

**3. Setup Frontend (Next.js)**
```bash
cd frontend
npm install
cp .env.example .env.local # (Isi NEXT_PUBLIC_API_URL=http://localhost:8000)
npm run dev
```

---

## 5. Keamanan & Penanganan Tantangan Hackathon

**Mencegah Kebocoran API Key (Security Measure)**
Dalam kompetisi Hackathon, kebocoran API Key AI di GitHub sangat sering terjadi. Kami melakukan mitigasi ketat:
1. **Environment Variables:** Semua token sensitif disimpan aman di `.env`.
2. **Aturan .gitignore:** Memblokir pengunggahan `.env`, `.env.local`, dan file database `*.db` sejak *commit* pertama.
3. **Platform Secrets:** Kunci asli hanya disuntikkan secara aman melalui *dashboard* environment Netlify/Vercel.

---

## 6. Cakupan Fungsionalitas MVP (100% Bekerja)

Seluruh fitur di bawah ini bukanlah *dummy* atau prototipe statis, melainkan **100% berfungsi**:

- [x] **Manajemen Langganan (CRUD):** Tambah, lihat, dan hapus data via Form Modal.
- [x] **Dashboard Keuangan Real-time:** Kalkulasi sisa anggaran dan total biaya.
- [x] **Integrasi Google Calendar:** Jadwal H-3 tagihan dikonversi langsung ke URL kalender.
- [x] **Grafik Analitik Tingkat Lanjut:** Visualisasi garis proyeksi keuangan.
- [x] **Skor Efisiensi AI:** Penilaian cerdas didukung oleh *prompt engineering* Llama-3.
- [x] **Rekomendasi Cerdas:** Sistem membedah tumpang-tindih fungsional dari daftar langganan.
- [x] **Chatbot AI Kontekstual:** Bot yang "tahu" isi dompet digital Anda.
- [x] **Mode Terang & Gelap:** Transisi tema tingkat *root* yang mulus.

---

## 7. Standar Komit (Commit Convention)

Kami menggunakan struktur *Conventional Commits* untuk menjaga kebersihan riwayat pengerjaan kami selama kompetisi *sprint* ini:
* `feat:` Fitur baru
* `fix:` Perbaikan kutu (bug)
* `docs:` Pembaruan dokumentasi (seperti README ini)
* `style:` Penataan kode (format, dll)
* `refactor:` Restrukturisasi kode tanpa mengubah fungsi
* `chore:` Pemeliharaan dependensi atau konfigurasi