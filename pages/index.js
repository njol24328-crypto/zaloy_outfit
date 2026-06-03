import products from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Home() {
  return (
    <main className="container py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Zaloy Outfit – Demo</h1>
        <p className="text-sm text-gray-600">Toko pakaian demo — terinspirasi tampilan e‑commerce.</p>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
