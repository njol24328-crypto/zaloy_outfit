CREATE DATABASE IF NOT EXISTS zaloy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zaloy;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  image TEXT NOT NULL,
  brand VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO products (id, name, price, currency, image, brand) VALUES
('1', 'Casual Shirt', 199000, 'IDR', 'https://images.unsplash.com/photo-1520975923249-3b7e36d1c0b3?w=800&q=80', 'Zaloy'),
('2', 'Slim Jeans', 259000, 'IDR', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', 'Zaloy'),
('3', 'Sneakers', 399000, 'IDR', 'https://images.unsplash.com/photo-1526178613451-1b1a1b7d7f14?w=800&q=80', 'Zaloy');
