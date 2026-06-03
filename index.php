<?php
session_start();
require_once 'db.php';

$action = $_GET['action'] ?? '';
$productId = $_GET['id'] ?? '';

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

function redirect($url = '/') {
    header('Location: ' . $url);
    exit;
}

if ($action === 'add' && $productId) {
    if (!isset($_SESSION['cart'][$productId])) {
        $_SESSION['cart'][$productId] = 1;
    } else {
        $_SESSION['cart'][$productId] += 1;
    }
    redirect('/');
}

if ($action === 'remove' && $productId) {
    unset($_SESSION['cart'][$productId]);
    redirect('/?view=cart');
}

if ($action === 'clear') {
    $_SESSION['cart'] = [];
    redirect('/?view=cart');
}

$search = trim($_GET['search'] ?? '');
$query = "SELECT id, name, price, currency, image, brand FROM products";
$params = [];
if ($search !== '') {
    $query .= " WHERE name LIKE ? OR brand LIKE ?";
    $term = "%" . $mysqli->real_escape_string($search) . "%";
    $params = [$term, $term];
}
$stmt = $mysqli->prepare($query);
if ($params) {
    $stmt->bind_param('ss', $params[0], $params[1]);
}
$stmt->execute();
$result = $stmt->get_result();
$products = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$cartProducts = [];
if (!empty($_SESSION['cart'])) {
    $ids = implode(',', array_map('intval', array_keys($_SESSION['cart'])));
    $cartResult = $mysqli->query("SELECT id, name, price, currency FROM products WHERE id IN ($ids)");
    while ($row = $cartResult->fetch_assoc()) {
        $row['quantity'] = $_SESSION['cart'][$row['id']];
        $row['total'] = $row['quantity'] * $row['price'];
        $cartProducts[] = $row;
    }
}

$view = $_GET['view'] ?? '';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zaloy Outfit</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topbar">
    <div class="container">
        <div class="brand"><a href="/">Zaloy Outfit</a></div>
        <nav>
            <a href="/?view=cart">Keranjang (<?php echo array_sum($_SESSION['cart']); ?>)</a>
            <a href="/">Produk</a>
        </nav>
    </div>
</header>
<main class="container">
    <section class="hero">
        <div>
            <h1>Belanja fashion pria modern</h1>
            <p>Toko demo yang dibuat supaya bisa langsung dipakai di repository web Anda.</p>
        </div>
        <form method="get" class="search-form">
            <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="Cari produk...">
            <button type="submit">Cari</button>
        </form>
    </section>

    <?php if ($view === 'cart'): ?>
        <section class="cart">
            <h2>Keranjang Anda</h2>
            <?php if (empty($cartProducts)): ?>
                <p>Keranjang kosong.</p>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th>Qty</th>
                            <th>Harga</th>
                            <th>Total</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $cartTotal = 0; ?>
                        <?php foreach ($cartProducts as $item): ?>
                            <?php $cartTotal += $item['total']; ?>
                            <tr>
                                <td><?php echo htmlspecialchars($item['name']); ?></td>
                                <td><?php echo $item['quantity']; ?></td>
                                <td>Rp <?php echo number_format($item['price'], 0, ',', '.'); ?></td>
                                <td>Rp <?php echo number_format($item['total'], 0, ',', '.'); ?></td>
                                <td><a class="button button-small" href="/?action=remove&id=<?php echo urlencode($item['id']); ?>">Hapus</a></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <div class="cart-summary">
                    <strong>Total: Rp <?php echo number_format($cartTotal, 0, ',', '.'); ?></strong>
                </div>
                <div class="actions">
                    <a class="button button-secondary" href="/?action=clear">Kosongkan Keranjang</a>
                    <a class="button" href="/?view=checkout">Checkout Dummy</a>
                </div>
            <?php endif; ?>
        </section>
    <?php elseif ($view === 'checkout'): ?>
        <section class="checkout">
            <h2>Checkout</h2>
            <p>Ini adalah demo checkout. Sistem pembayaran belum terhubung.</p>
            <a class="button" href="/?view=cart">Kembali ke Keranjang</a>
        </section>
    <?php else: ?>
        <section class="products-grid">
            <?php if (empty($products)): ?>
                <p>Tidak ada produk ditemukan.</p>
            <?php endif; ?>
            <?php foreach ($products as $product): ?>
                <article class="product-card">
                    <img src="<?php echo htmlspecialchars($product['image']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                    <div class="product-info">
                        <span class="brand"><?php echo htmlspecialchars($product['brand']); ?></span>
                        <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                        <p class="price">Rp <?php echo number_format($product['price'], 0, ',', '.'); ?></p>
                        <div class="product-actions">
                            <a class="button button-secondary" href="/?view=cart">Lihat Keranjang</a>
                            <a class="button" href="/?action=add&id=<?php echo urlencode($product['id']); ?>">Tambah ke Keranjang</a>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </section>
    <?php endif; ?>
</main>
<footer class="footer">
    <div class="container">
        <p>Demo e-commerce Zaloy Outfit dengan PHP + MySQL.</p>
    </div>
</footer>
</body>
</html>
