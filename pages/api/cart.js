require('dotenv').config()
const mysql = require('mysql2/promise')

function makeSessionId() {
  return 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

async function getConn() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || 'zaloy',
    password: process.env.MYSQL_PASSWORD || 'zaloypass',
    database: process.env.MYSQL_DATABASE || 'zaloy'
  })
}

export default async function handler(req, res) {
  const { method } = req
  // get or create session id from cookies
  const cookies = req.headers.cookie || ''
  const match = cookies.match(/sessionId=([^;]+)/)
  let sessionId = match ? decodeURIComponent(match[1]) : null

  if (!sessionId) {
    sessionId = makeSessionId()
    // set cookie (1 week)
    res.setHeader('Set-Cookie', `sessionId=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; Max-Age=604800`)
  }

  const conn = await getConn()

  // ensure cart exists
  const [rowsCart] = await conn.execute('SELECT id FROM carts WHERE session_id = ?', [sessionId])
  let cartId
  if (rowsCart.length === 0) {
    cartId = 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    await conn.execute('INSERT INTO carts (id, session_id) VALUES (?, ?)', [cartId, sessionId])
  } else {
    cartId = rowsCart[0].id
  }

  try {
    if (method === 'GET') {
      const [items] = await conn.execute(
        `SELECT ci.product_id, ci.quantity, p.name, p.price, p.image, p.brand
         FROM cart_items ci
         LEFT JOIN products p ON p.id = ci.product_id
         WHERE ci.cart_id = ?`,
        [cartId]
      )
      await conn.end()
      return res.status(200).json({ cartId, items })
    }

    if (method === 'POST') {
      const { productId, quantity } = req.body
      const qty = Number(quantity || 1)
      // upsert cart item
      const [existing] = await conn.execute('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId])
      if (existing.length > 0) {
        const newQty = existing[0].quantity + qty
        await conn.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id])
      } else {
        const itemId = 'ci_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
        await conn.execute('INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES (?, ?, ?, ?)', [itemId, cartId, productId, qty])
      }
      const [items] = await conn.execute(
        `SELECT ci.product_id, ci.quantity, p.name, p.price, p.image, p.brand
         FROM cart_items ci
         LEFT JOIN products p ON p.id = ci.product_id
         WHERE ci.cart_id = ?`,
        [cartId]
      )
      await conn.end()
      return res.status(200).json({ cartId, items })
    }

    if (method === 'DELETE') {
      const { productId } = req.body || {}
      if (productId) {
        await conn.execute('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId])
      } else {
        await conn.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId])
      }
      await conn.end()
      return res.status(200).json({ ok: true })
    }

    await conn.end()
    res.setHeader('Allow', 'GET,POST,DELETE')
    return res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err) {
    await conn.end()
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
