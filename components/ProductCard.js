import Link from 'next/link'

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="h-56 bg-gray-100 flex items-center justify-center">
        <img src={product.image} alt={product.name} className="h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <p className="text-xs text-gray-500">{product.brand}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-semibold">Rp {product.price.toLocaleString('id-ID')}</div>
          <Link href={`/product/${product.id}`} className="text-sm text-blue-600">Lihat</Link>
        </div>
      </div>
    </div>
  )
}
