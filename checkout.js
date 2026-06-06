document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    function getCart() {
        try { return JSON.parse(localStorage.getItem('kanu_cart') || '[]'); }
        catch { return []; }
    }

    function clearCart() {
        localStorage.removeItem('kanu_cart');
        window.dispatchEvent(new Event('kanu-cart-updated'));
    }

    const cart      = getCart();
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

    let isProcessing = false;
    let isSuccess    = false;
    let formData     = { name: '', email: '', address: '', city: '', card: '' };

    const stateEmpty   = document.getElementById('state-empty');
    const stateSuccess = document.getElementById('state-success');
    const stateForm    = document.getElementById('state-form');
    const checkoutForm = document.getElementById('checkout-form');
    const btnPay       = document.getElementById('btn-pay');
    const btnPayAmount = document.getElementById('btn-pay-amount');
    const btnBackHome  = document.getElementById('btn-back-home');
    const summaryList  = document.getElementById('summary-list');
    const summaryTotal = document.getElementById('summary-total');

    const hideAllStates = () => {
        stateEmpty.style.display   = 'none';
        stateSuccess.style.display = 'none';
        stateForm.style.display    = 'none';
    };

    const renderUI = () => {
        hideAllStates();

        if (isSuccess) {
            stateSuccess.style.display = 'block';
            lucide.createIcons();
            return;
        }

        if (cart.length === 0) {
            stateEmpty.style.display = 'block';
            return;
        }

        stateForm.style.display  = 'block';
        btnPayAmount.textContent = cartTotal.toFixed(2);

        const user = JSON.parse(localStorage.getItem('kanu_user') || 'null');
        if (user) {
            document.getElementById('name').value    = user.name    || '';
            document.getElementById('email').value   = user.email   || '';
            document.getElementById('address').value = user.address || '';
            document.getElementById('city').value    = user.city    || '';
            formData.name    = user.name    || '';
            formData.email   = user.email   || '';
            formData.address = user.address || '';
            formData.city    = user.city    || '';
        }

        summaryList.innerHTML = cart.map(item => `
            <li class="checkout-summary__item">
                <span class="checkout-summary__item-name">${item.name} x ${item.qty}</span>
                <span class="checkout-summary__item-price">$${(item.price * item.qty).toFixed(2)}</span>
            </li>
        `).join('');

        summaryTotal.textContent = `$${cartTotal.toFixed(2)}`;
    };

    checkoutForm.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            formData[e.target.name] = e.target.value;
        }
    });

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isProcessing) return;

        isProcessing     = true;
        btnPay.disabled  = true;
        btnPay.innerHTML = 'Procesando...';

        const user = JSON.parse(localStorage.getItem('kanu_user') || 'null');

        const payload = {
            client_id: user ? user.id : null,
            name:      formData.name,
            email:     formData.email,
            address:   formData.address,
            city:      formData.city,
            total:     cartTotal,
            items:     cart.map(item => ({
                id:    item.id,
                name:  item.name,
                price: item.price,
                qty:   item.qty
            }))
        };

        try {
            const response = await fetch('guardar_orden.php', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                isSuccess = true;
                clearCart();
                renderUI();
            } else {
                btnPay.disabled  = false;
                btnPay.innerHTML = `Pagar $${cartTotal.toFixed(2)}`;
                alert(data.message || 'Error al procesar el pedido.');
            }
        } catch {
            btnPay.disabled  = false;
            btnPay.innerHTML = `Pagar $${cartTotal.toFixed(2)}`;
            alert('No se pudo conectar con el servidor. Intenta de nuevo.');
        }

        isProcessing = false;
    });

    btnBackHome.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    renderUI();
});