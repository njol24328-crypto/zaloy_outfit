const products = [
  {
    id: '1',
    name: 'Casual Shirt',
    price: 199000,
    currency: 'IDR',
    image: 'https://images.unsplash.com/photo-1520975923249-3b7e36d1c0b3?w=800&q=80',
    brand: 'Zaloy'
  },
  {
    id: '2',
    name: 'Slim Jeans',
    price: 259000,
    currency: 'IDR',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    brand: 'Zaloy'
  },
  {
    id: '3',
    name: 'Sneakers',
    price: 399000,
    currency: 'IDR',
    image: 'https://images.unsplash.com/photo-1526178613451-1b1a1b7d7f14?w=800&q=80',
    brand: 'Zaloy'
  }
];

const cartKey = 'zaloy-cart';
const cartCountEl = document.getElementById('cartCount');
const productsEl = document.getElementById('products');
const cartContentEl = document.getElementById('cartContent');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

function getCart() {
  const stored = localStorage.getItem(cartKey);
  return stored ? JSON.parse(stored) : {};
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  cartCountEl.textContent = count;
}

function renderProducts(items) {
  productsEl.innerHTML = items.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <span class="brand">${product.brand}</span>
        <h3>${product.name}</h3>
        <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
        <div class="product-actions">
          <button class="button" onclick="addToCart('${product.id}')">Tambah ke Keranjang</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCart() {
  const cart = getCart();
  const ids = Object.keys(cart);
  if (!ids.length) {
    cartContentEl.innerHTML = '<p>Keranjang kosong.</p>';
    return;
  }

  const rows = ids.map(id => {
    const product = products.find(item => item.id === id);
    const qty = cart[id];
    const total = product.price * qty;
    return `
      <div class="cart-row">
        <div><strong>${product.name}</strong> x ${qty}</div>
        <div>Rp ${total.toLocaleString('id-ID')}</div>
        <button class="button button-small button-secondary" onclick="removeFromCart('${id}')">Hapus</button>
      </div>
    `;
  }).join('');

  const cartTotal = ids.reduce((sum, id) => {
    const product = products.find(item => item.id === id);
    return sum + product.price * cart[id];
  }, 0);

  cartContentEl.innerHTML = `
    <div class="cart-list">${rows}</div>
    <div class="cart-summary"><strong>Total: Rp ${cartTotal.toLocaleString('id-ID')}</strong></div>
    <div class="actions">
      <button class="button button-secondary" onclick="clearCart()">Kosongkan Keranjang</button>
    </div>
  `;
}

function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function clearCart() {
  saveCart({});
  updateCartCount();
  renderCart();
}

searchForm.addEventListener('submit', () => {
  const search = searchInput.value.toLowerCase().trim();
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search) ||
    product.brand.toLowerCase().includes(search)
  );
  renderProducts(filtered);
});

renderProducts(products);
updateCartCount();
renderCart();
