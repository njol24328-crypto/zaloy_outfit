import products from '../../data/products'
import { useRouter } from 'next/router'

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query
  const product = products.find(p => p.id === id)

  if (!product) return <div className="container py-8">Produk tidak ditemukan</div>

  return (
    <main className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <div className="mt-4 text-xl font-semibold">Rp {product.price.toLocaleString('id-ID')}</div>
          <p className="mt-6">Deskripsi produk demo singkat untuk {product.name}.</p>
          <div className="mt-6">
            <button onClick={async () => {
              await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id, quantity: 1 })
              })
              alert('Produk ditambahkan ke keranjang')
            }} className="px-4 py-2 bg-blue-600 text-white rounded">Tambah ke Keranjang</button>
          </div>
        </div>
      </div>
    </main>
  )
}
