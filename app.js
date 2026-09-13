const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ============================================
// ТОВАРЫ — меняй здесь под себя
// id      — уникальный номер (не повторяй!)
// name    — название товара
// price   — цена в рублях (только цифры)
// img     — HTTPS-ссылка на картинку
// ============================================
const products = [
    { id: 1, name: 'Футболка Oversize', price: 1900, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 2, name: 'Худи унисекс', price: 3500, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
    { id: 3, name: 'Джинсы Slim', price: 4200, img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { id: 4, name: 'Куртка Bomber', price: 6800, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
    { id: 5, name: 'Кепка', price: 1200, img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' },
    { id: 6, name: 'Кроссовки', price: 7500, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
];

// ============================================
// КОРЗИНА
// ============================================
let cart = {}; // { id: количество }

// ============================================
// ОТРИСОВКА ТОВАРОВ
// ============================================
const productsEl = document.getElementById('products');

products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <div class="price">${p.price} ₽</div>
        <button data-id="${p.id}">В корзину</button>
    `;
    productsEl.appendChild(card);
});

// Обработка кнопок "В корзину"
productsEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const id = Number(e.target.dataset.id);
        cart[id] = (cart[id] || 0) + 1;
        updateCart();
        tg.HapticFeedback?.impactOccurred('light');
    }
});

// ============================================
// ОБНОВЛЕНИЕ КОРЗИНЫ
// ============================================
function updateCart() {
    let count = 0;
    let total = 0;
    for (const id in cart) {
        const product = products.find(p => p.id === Number(id));
        count += cart[id];
        total += product.price * cart[id];
    }
    document.getElementById('cartCount').innerText = count;
    document.getElementById('cartTotal').innerText = total;
}

// ============================================
// ОФОРМЛЕНИЕ ЗАКАЗА
// ============================================
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
        tg.showAlert('Корзина пуста! Добавь товары.');
        return;
    }

    const order = [];
    let total = 0;
    for (const id in cart) {
        const product = products.find(p => p.id === Number(id));
        order.push({
            name: product.name,
            price: product.price,
            qty: cart[id],
            sum: product.price * cart[id]
        });
        total += product.price * cart[id];
    }

    // Отправляем данные в бота
    tg.sendData(JSON.stringify({
        action: 'new_order',
        items: order,
        total: total,
        user: tg.initDataUnsafe?.user?.first_name || 'Гость'
    }));

    tg.close();
});
