const productsFile = require('../../data/products')
require('dotenv').config()
const mysql = require('mysql2/promise')

async function getProductsFromDb() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || 'zaloy',
    password: process.env.MYSQL_PASSWORD || 'zaloypass',
    database: process.env.MYSQL_DATABASE || 'zaloy'
  })

  const [rows] = await conn.execute('SELECT id, name, price, currency, image, brand FROM products')
  await conn.end()
  return rows
}

export default async function handler(req, res) {
  try {
    const rows = await getProductsFromDb()
    return res.status(200).json(rows)
  } catch (err) {
    // Fallback to file-based products if DB not available
    console.warn('DB unavailable, falling back to file:', err.message)
    return res.status(200).json(productsFile)
  }
}
