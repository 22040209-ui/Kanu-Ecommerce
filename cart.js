document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    function getCart() {
        try { return JSON.parse(localStorage.getItem('kanu_cart') || '[]'); }
        catch { return []; }
    }

    function saveCart(cart) {
        localStorage.setItem('kanu_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('kanu-cart-updated'));
    }

    const emptyState   = document.getElementById('empty-state');
    const filledState  = document.getElementById('filled-state');
    const cartList     = document.getElementById('cart-list');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal    = document.getElementById('cart-total');
    const checkoutBtn  = document.getElementById('checkout-btn');

    const calculateTotal = (cart) =>
        cart.reduce((total, item) => total + (item.price * item.qty), 0);

    const removeFromCart = (id) => {
        const cart = getCart().filter(i => i.id != id);
        saveCart(cart);
        renderCart();
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) { removeFromCart(id); return; }
        const cart = getCart().map(i => i.id != id ? i : { ...i, qty: newQty });
        saveCart(cart);
        renderCart();
    };

    const renderCart = () => {
        const cart = getCart();

        if (cart.length === 0) {
            emptyState.style.display  = 'block';
            filledState.style.display = 'none';
            return;
        }

        emptyState.style.display  = 'none';
        filledState.style.display = 'block';

        const total = calculateTotal(cart);
        cartSubtotal.textContent = `$${total.toFixed(2)}`;
        cartTotal.textContent    = `$${total.toFixed(2)}`;

        cartList.innerHTML = cart.map(item => `
            <li class="cart-item" data-id="${item.id}">
                <div class="cart-item__image-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="cart-item__image">
                </div>
                <div class="cart-item__details">
                    <div class="cart-item__header">
                        <div>
                            <span class="cart-item__name">${item.name}</span>
                            <p class="cart-item__price">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="cart-item__actions">
                        <div class="qty-controls">
                            <button class="qty-btn" data-action="decrease" data-id="${item.id}">
                                <i data-lucide="minus" style="width:16px;height:16px;"></i>
                            </button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" data-action="increase" data-id="${item.id}">
                                <i data-lucide="plus" style="width:16px;height:16px;"></i>
                            </button>
                        </div>
                        <button class="delete-btn" data-action="remove" data-id="${item.id}">
                            <i data-lucide="trash-2" style="width:20px;height:20px;"></i>
                        </button>
                    </div>
                </div>
            </li>
        `).join('');

        lucide.createIcons();
    };

    cartList.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id     = btn.dataset.id;
        const cart   = getCart();
        const item   = cart.find(i => i.id == id);

        if (!item) return;

        if (action === 'increase')       updateQuantity(id, item.qty + 1);
        else if (action === 'decrease')  updateQuantity(id, item.qty - 1);
        else if (action === 'remove')    removeFromCart(id);
    });

    checkoutBtn.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    renderCart();
});