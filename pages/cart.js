import { useEffect, useState } from 'react'

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)

  async function fetchCart() {
    setLoading(true)
    const res = await fetch('/api/cart')
    const data = await res.json()
    setCart(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCart()
  }, [])

  async function remove(productId) {
    await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) })
    fetchCart()
  }

  async function clearAll() {
    await fetch('/api/cart', { method: 'DELETE' })
    fetchCart()
  }

  const total = cart.items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0)

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Keranjang Anda</h1>
      {loading ? <p>Memuat...</p> : (
        <div>
          {cart.items.length === 0 ? <p>Keranjang kosong.</p> : (
            <div>
              <ul>
                {cart.items.map(it => (
                  <li key={it.product_id} className="flex items-center gap-4 py-4 border-b">
                    <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-500">Rp {it.price.toLocaleString('id-ID')} x {it.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</div>
                      <button onClick={() => remove(it.product_id)} className="mt-2 text-sm text-red-600">Hapus</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-right">
                <div className="text-lg font-semibold">Total: Rp {total.toLocaleString('id-ID')}</div>
                <div className="mt-4">
                  <button onClick={clearAll} className="px-4 py-2 bg-red-600 text-white rounded mr-2">Kosongkan</button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded">Checkout (dummy)</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
