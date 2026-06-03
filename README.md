# Zaloy Outfit

Demo website e-commerce PHP + MySQL yang berjalan di root repository.

## Cara jalankan

1. Jalankan Docker Compose:

```bash
docker-compose up -d
```

2. Buka website:

- http://localhost:3000

3. Buka phpMyAdmin:

- http://localhost:8080
- user: `zaloy`
- password: `zaloypass`

## Struktur file

- `index.php` — halaman utama dengan search dan keranjang
- `db.php` — koneksi database MySQL
- `style.css` — styling tampilan
- `docker-compose.yml` — MySQL + phpMyAdmin
- `db/init.sql` — inisialisasi tabel dan data demo produk
