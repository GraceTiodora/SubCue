<div align="center">

# 💳 SubCue AI

### Konsultan Cerdas untuk Kesehatan Finansial Langganan Digital Anda

**Jangan pernah lagi membayar untuk langganan yang Anda lupakan.**  
**Langganan lebih cerdas. Keuangan lebih sehat.**

--- 

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Groq](https://img.shields.io/badge/Groq-Llama3-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**[Live Demo (Netlify)](#) | [Public GitHub Repository](https://github.com/GraceTiodora/SubCue)**

</div>

---

## 1. Latar Belakang Masalah (The Problem)

Di era digital saat ini, layanan berlangganan (Netflix, Spotify, ChatGPT, Zoom, dll) telah menjadi kebutuhan primer. Namun, kemudahan berlangganan seringkali menjebak pengguna ke dalam masalah keuangan terselubung yang dikenal sebagai **"Subscription Fatigue" (Kelelahan Berlangganan)**. 

Masalah utama yang dihadapi pengguna:
1. **Lupa Tanggal Tagihan:** Sistem *auto-renewal* menyedot saldo rekening secara diam-diam.
2. **Pemborosan Terselubung (Zombie Subscriptions):** Terus membayar layanan yang sangat jarang atau bahkan tidak pernah dipakai lagi.
3. **Fungsi yang Tumpang Tindih:** Membayar Spotify sekaligus Apple Music tanpa menyadari pemborosan fungsional.
4. **Kebutaan Finansial Jangka Panjang:** Sulit melacak akumulasi pengeluaran bulanan karena terpecah di berbagai aplikasi.

Sayangnya, aplikasi pencatat keuangan biasa **hanya memberi notifikasi** tanpa memberikan wawasan tentang *apakah langganan tersebut masih layak dipertahankan*.

---

## 2. Solusi dari SubCue AI

**SubCue AI** hadir bukan sekadar sebagai aplikasi pengingat, melainkan sebagai **Konsultan Keuangan Pribadi Berbasis AI**. Kami menggabungkan pelacakan cerdas dengan analisis pengeluaran yang ditenagai oleh kecerdasan buatan.

Daripada sekadar mengingatkan Anda bahwa tagihan Netflix akan jatuh tempo, AI kami akan mengevaluasi tingkat penggunaan Anda dan merekomendasikan: *"Anda jarang memakai layanan X bulan ini, batalkan langganan tersebut untuk menghemat Rp 150.000!"*

### Fitur Unggulan Terkini (Core Features)
* **Skor Efisiensi AI:** Ditenagai oleh **Groq & Llama-3**, AI secara instan menghitung tingkat kesehatan pengeluaran digital Anda dari skala 0-100.
* **Pemindai Struk Otomatis (OCR AI):** Unggah tangkapan layar (screenshot) tagihan langganan Anda, dan AI Vision akan otomatis mengekstrak nama, harga, dan jadwal tagihan tanpa perlu mengetik manual.
* **Integrasi Google Calendar:** Jadwalkan pengingat H-3 langsung ke kalender Google Anda dengan satu klik saat menambah langganan.
* **Asisten Chat AI Kontekstual:** Tanyakan saran keuangan secara langsung. Chatbot dilengkapi dengan sistem keamanan **Anti-Prompt Injection** yang ketat.
* **Analitik Visual & Proyeksi Keuangan:** Grafik interaktif (Line Chart) untuk melacak tren pengeluaran bulanan.
* **UI/UX Reaktif Seketika (Real-Time Sync):** Perubahan pada profil, anggaran, dan daftar langganan akan langsung mengubah kalkulasi Dashboard secara *real-time* tanpa *refresh*.

---

## 3. Arsitektur & Teknologi

SubCue AI dibangun dengan pendekatan **Microservices** yang memisahkan Frontend dan Backend untuk memastikan latensi minimal dan skalabilitas maksimal.

**Frontend: Next.js 14 + TailwindCSS + Lucide Icons + Recharts**
* Menyajikan UI responsif, reaktif, dan minimalis bergaya *Enterprise Dashboard*. State management murni memanfaatkan React Hooks termodern dan sistem custom event listeners browser.

**Backend: FastAPI + Python + SQLite**
* Menangani routing modular dan integrasi API AI (menggunakan **Groq API / Llama-3** untuk inferensi kilat). Dilengkapi arsitektur modular `core/prompts.py` untuk manajemen prompt skala besar.

**Mengapa Arsitektur Ini?**
Pemisahan backend memungkinkan kami memanfaatkan ekosistem AI/ML Python secara maksimal. Dengan API eksternal ultra-cepat, kami mendapatkan kecepatan respons AI instan, sementara Next.js menyajikan antarmuka visual kelas dunia tanpa jeda (*lag*).

---

## 4. Panduan Menjalankan Aplikasi Lokal

**1. Clone Repository**
```bash
git clone https://github.com/GraceTiodora/SubCue.git
cd SubCue
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

## 5. Keamanan & Penanganan Risiko (Security Measure)

1. **Anti-Prompt Injection:** Kami menanamkan *System Prompt* tertutup di backend yang secara eksplisit melarang AI menjalankan instruksi *jailbreak* atau menjawab pertanyaan di luar konteks manajemen langganan dan finansial.
2. **Mencegah Kebocoran API Key:** Semua kunci rahasia disimpan secara aman dalam *Environment Variables* (`.env`) dan di-inject langsung melalui platform hosting.
3. **Validasi Regex Ketat:** Mencegah masuknya format data (seperti email) yang tidak valid pada antarmuka Pengaturan, meminimalisir risiko manipulasi format.

---

## 6. Cakupan Fungsionalitas MVP (100% Bekerja)

Seluruh fitur di bawah ini bukanlah prototipe UI (*dummy*), melainkan **100% terintegrasi dan berfungsi**:

- [x] Manajemen Langganan (CRUD)
- [x] Pemindai Gambar (Image Scanner) OCR AI
- [x] Dashboard Keuangan Real-time dengan Kalkulasi
- [x] Integrasi Cepat Google Calendar Pengingat H-3
- [x] Grafik Analitik Tren Proyeksi Biaya
- [x] Skor Efisiensi Finansial & Rekomendasi AI
- [x] Chatbot Asisten AI Anti-Injection
- [x] Manajemen Profil & Dinamika Anggaran

---
