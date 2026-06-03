require('dotenv').config()
const mysql = require('mysql2/promise')
const products = require('../data/products')

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || 'zaloy',
    password: process.env.MYSQL_PASSWORD || 'zaloypass',
    database: process.env.MYSQL_DATABASE || 'zaloy'
  })

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      price INT,
      currency VARCHAR(10),
      image TEXT,
      brand VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS carts (
      id VARCHAR(100) PRIMARY KEY,
      session_id VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id VARCHAR(100) PRIMARY KEY,
      cart_id VARCHAR(100),
      product_id VARCHAR(50),
      quantity INT DEFAULT 1,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  // Clear existing demo rows
  await conn.execute('DELETE FROM products')

  const insertSql = 'INSERT INTO products (id, name, price, currency, image, brand) VALUES (?, ?, ?, ?, ?, ?)'
  for (const p of products) {
    await conn.execute(insertSql, [p.id, p.name, p.price, p.currency, p.image, p.brand])
  }

  console.log('Seeded products:', products.length)
  await conn.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
