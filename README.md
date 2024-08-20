# Garment-Product
Garment Product adalah aplikasi web CRUD sederhana yang menggunakan Node.Js dan Express.Js, Embedded JavaScript (EJS) dan MongoDB sebagai databasenya. Dengan fitur utama yaitu Create, Read, Update and Delete (CRUD) produk fashion. Garment Product menerapkan relational database dengan ada dua koleksi yaitu data garment dan data product yang saling berkaitan. Aplikasi ini juga sudah menerapkan middleweare untuk tiap garment yang dihapus maka data product di dalamnya juga akan ikut terhapus. Namun aplikasi ini masih memiliki tampilan yang sederhana (teks html biasa) karena fokusnya adalah melatih kemampuan pemrograman di sisi server (backend)

Fitur :
- Tambah Garment / Produk: Menambahkan garment / produk baru ke dalam database dengan atribut tertentu.
- Lihat Garment / Produk: Menampilkan isi dari koleksi garment dan produk yang ada dalam database beserta detailnya.
- Edit Garment / Produk: Memperbarui informasi yang sudah ada.
- Hapus Garment / Produk: Menghapus data yang tidak lagi diperlukan dari database.
  
Teknologi yang Digunakan :
- Node.js & Express.js: Digunakan untuk membangun server dan API yang mendukung operasi CRUD.
- Embedded JavaScript (EJS): Template engine untuk merender HTML dengan data dari server.
- MongoDB: Database NoSQL untuk menyimpan data produk.
- Mongoose: Digunakan untuk berinteraksi dengan MongoDB dan mempermudah pengelolaan skema data.
