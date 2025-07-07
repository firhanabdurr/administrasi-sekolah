# Panduan Instalasi & Dokumentasi: Aplikasi Administrasi Sekolah

Dokumen ini berisi semua informasi yang diperlukan untuk menginstal, mengonfigurasi, dan menjalankan aplikasi administrasi sekolah di lingkungan pengembangan lokal.

---

### **1. Deskripsi Proyek**

Aplikasi ini adalah sistem informasi berbasis web yang dirancang untuk membantu operator sekolah dalam mengelola data siswa, transaksi tabungan, pembayaran SPP, dan menghasilkan laporan keuangan. Aplikasi ini dibangun dengan arsitektur modern yang memisahkan antara backend (API) dan frontend (antarmuka pengguna).

* **Backend:** Node.js, Express.js, MongoDB
* **Frontend:** Vue.js (direkomendasikan menggunakan Vite)

---

### **2. Prasyarat (Prerequisites)**

* **Node.js**: Versi 16.x atau yang lebih baru.
    * *Anda bisa memeriksanya dengan menjalankan `node -v` di terminal.*
* **npm** atau **yarn**: Manajer paket untuk Node.js (npm biasanya sudah terinstal bersama Node.js).
    * *Anda bisa memeriksanya dengan `npm -v` atau `yarn -v`.*
* **MongoDB**: Database NoSQL yang akan digunakan. Anda bisa menginstal MongoDB Community Server di mesin lokal Anda atau menggunakan layanan cloud seperti MongoDB Atlas.
    * *Pastikan layanan MongoDB sudah berjalan sebelum menjalankan backend.*    

---

### **3. Panduan Instalasi**

Proses instalasi dibagi menjadi dua bagian utama: **Backend** dan **Frontend**.

#### **A. Instalasi Backend (Server)**

1.  **Navigasi ke Folder Backend:**
    Buka terminal atau command prompt, lalu masuk ke direktori `backend/`.
    ```bash
    cd path/to/school-admin-app/backend
    ```

2.  **Instal Dependensi:**
    Jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan oleh server.
    ```bash
    npm install
    ```

3.  **Konfigurasi Lingkungan (Environment):**
    * Buat file baru bernama `.env` di dalam folder `backend/`.
    * Salin konten dari file `.env.example` (jika ada) atau isi dengan konfigurasi berikut:

    ```env
    # Konfigurasi Server
    PORT=5000

    # Konfigurasi Database MongoDB
    # Untuk instalasi lokal:
    MONGO_URI=mongodb://localhost:27017/school_db

    # Untuk MongoDB Atlas (ganti dengan connection string Anda):
    # MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/school_db

    # Kunci Rahasia untuk JSON Web Token (JWT)
    JWT_SECRET=rahasia_super_aman_dan_panjang
    ```
    > **Penting:** Pastikan `MONGO_URI` sesuai dengan konfigurasi MongoDB Anda dan `JWT_SECRET` diisi dengan string yang acak dan aman.

4.  **Menjalankan Server Backend:**
    Gunakan perintah berikut untuk menjalankan server dalam mode pengembangan (dengan auto-reload menggunakan `nodemon` jika sudah dikonfigurasi di `package.json`).
    ```bash
    npm run dev
    ```
    Atau, jika tidak ada skrip `dev`, jalankan dengan:
    ```bash
    npm start
    ```
    Jika berhasil, Anda akan melihat pesan di terminal seperti:
    `Server berjalan di port 5000`
    `Berhasil terhubung ke MongoDB`

#### **B. Instalasi Frontend (Client)**

1.  **Buka Terminal Baru:**
    Biarkan terminal backend tetap berjalan. Buka terminal baru untuk frontend.

2.  **Navigasi ke Folder Frontend:**
    Masuk ke direktori `frontend/`.
    ```bash
    cd path/to/school-admin-app/frontend
    ```

3.  **Instal Dependensi:**
    Jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan oleh antarmuka Vue.js.
    ```bash
    npm install
    ```

4.  **Konfigurasi Variabel Lingkungan Frontend (jika perlu):**
    Frontend perlu mengetahui alamat API backend. Biasanya ini dikonfigurasi dalam file `.env` di dalam folder `frontend/`.
    * Buat file `.env` di dalam `frontend/`.
    * Tambahkan variabel berikut:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
    > **Catatan:** Nama variabel harus diawali dengan `VITE_` jika Anda menggunakan Vite sebagai build tool.

5.  **Menjalankan Server Pengembangan Frontend:**
    Jalankan perintah berikut untuk memulai server pengembangan Vue.
    ```bash
    npm run dev
    ```
    Jika berhasil, Anda akan melihat output di terminal yang berisi alamat URL lokal, biasanya seperti:
    `> Local: http://localhost:5173/`

6.  **Akses Aplikasi:**
    Buka browser Anda dan kunjungi alamat `http://localhost:5173` (atau alamat yang muncul di terminal Anda). Aplikasi administrasi sekolah sekarang seharusnya sudah bisa diakses.

---

### **4. Penggunaan Awal**

* **Akun Operator Default:**
    Aplikasi ini mungkin memerlukan pembuatan akun operator pertama secara manual atau melalui *database seeder*. Jika tidak ada, Anda mungkin perlu membuatnya langsung di database MongoDB.
    * **Username:** `operator`
    * **Password:** `sekolah123` (password ini harus di-hash menggunakan `bcrypt` sebelum disimpan ke database).

* **Mengakses Fitur:**
    Setelah login, Anda dapat mulai menggunakan semua fitur seperti manajemen siswa, transaksi keuangan, dan pembuatan laporan sesuai dengan menu navigasi yang tersedia.

---