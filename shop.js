document.addEventListener('DOMContentLoaded', () => {

    lucide.createIcons();

    let currentDetailProduct = null;

    const detailOverlay  = document.getElementById('detail-overlay');
    const detailPanel    = document.getElementById('detail-panel');
    const detailClose    = document.getElementById('detail-close');
    const detailImg      = document.getElementById('detail-img');
    const detailCat      = document.getElementById('detail-cat');
    const detailName     = document.getElementById('detail-name');
    const detailPrice    = document.getElementById('detail-price');
    const detailOriginal = document.getElementById('detail-original');
    const detailDesc     = document.getElementById('detail-desc');
    const detailStock    = document.getElementById('detail-stock');
    const detailAddBtn   = document.getElementById('detail-add-btn');
    const cartToast      = document.getElementById('cart-toast');

    let state = {
        searchTerm: '',
        selectedCategory: 'Todos',
        priceRange: 3000,
        showMobileFilters: false
    };

    let products = [];
    let promos = [];

    // ─── Fetch ────────────────────────────────────────────────────────────────

    async function cargarProductos() {
        try {
            const respuesta = await fetch('obtener_productos.php');
            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
            const texto = await respuesta.text();
            console.log('[cargarProductos] raw:', texto);
            products = JSON.parse(texto);
            renderProducts();
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    }

    async function cargarPromociones() {
        try {
            const respuesta = await fetch('obtener_promociones.php');
            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
            const texto = await respuesta.text();
            console.log('[cargarPromociones] raw:', texto);
            promos = JSON.parse(texto);
            renderPromoCarousel();
        } catch (error) {
            console.error('Error cargando promociones:', error);
        }
    }

    // ─── Data ─────────────────────────────────────────────────────────────────

    const categoriesData = [
        { id: 'Todos',          label: 'Todos',      icon: 'text',      value: 'Todos' },
        { id: 'Alimentación',   label: 'Alimento',   icon: 'sparkles',  value: 'Alimentación' },
        { id: 'Accesorios',     label: 'Accesorios', icon: 'gem',       value: 'Accesorios' },
        { id: 'Higiene',        label: 'Higiene',    icon: 'bath',      value: 'Higiene' },
        { id: 'Entretenimiento',label: 'Juguetes',   icon: 'toy-brick', value: 'Entretenimiento' }
    ];

    // ─── DOM refs ─────────────────────────────────────────────────────────────

    const grid              = document.getElementById('product-grid');
    const emptyState        = document.getElementById('empty-state');
    const searchInput       = document.getElementById('search-input');
    const priceRangeInput   = document.getElementById('price-range');
    const priceValue        = document.getElementById('price-value');
    const categoryButtons   = document.querySelectorAll('.cat-btn');
    const currentCategoryText = document.getElementById('current-category');
    const resultsCountText  = document.getElementById('results-count');
    const promoTrack        = document.getElementById('promo-track');
    const promoDots         = document.getElementById('promo-dots');
    const promoPrevBtn      = document.getElementById('promo-prev');
    const promoNextBtn      = document.getElementById('promo-next');
    const categoryTrack     = document.getElementById('category-track');

    // ─── Filters ──────────────────────────────────────────────────────────────

    function getFilteredProducts() {
        return products.filter(product => {
            const matchesSearch   = product.name.toLowerCase().includes(state.searchTerm.toLowerCase());
            const matchesCategory = state.selectedCategory === 'Todos' || product.category === state.selectedCategory;
            const matchesPrice    = product.price <= state.priceRange;
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }

    function resetState() {
        state = { searchTerm: '', selectedCategory: 'Todos', priceRange: 3000, showMobileFilters: false };
        if (searchInput)     searchInput.value = '';
        if (priceRangeInput) priceRangeInput.value = 3000;
        if (priceValue)      priceValue.textContent = '$3000';
        renderProducts();
        syncCategoryUI();
    }

    function syncCategoryUI() {
        categoryButtons.forEach(btn => {
            btn.classList.toggle('cat-btn--active', btn.dataset.category === state.selectedCategory);
        });
        document.querySelectorAll('.category-rail__btn').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.categoryValue === state.selectedCategory);
        });
    }

    // ─── Render: products ─────────────────────────────────────────────────────

    function renderProducts() {
        const filtered = getFilteredProducts();

        if (currentCategoryText) {
            currentCategoryText.textContent =
                state.selectedCategory === 'Todos' ? 'Todos los productos' : state.selectedCategory;
        }
        if (resultsCountText) {
            resultsCountText.textContent = `(${filtered.length} resultados)`;
        }

        if (filtered.length > 0) {
            grid.style.display = 'grid';
            emptyState.style.display = 'none';
            grid.innerHTML = filtered.map(p => `
                <div class="product-card" style="cursor:pointer"
                     onclick="openDetail(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                    <div class="product-card__img">
                        <img src="${p.image}" alt="${p.name}">
                    </div>
                    <div class="product-card__body">
                        <span class="product-card__cat">${p.category}</span>
                        <h3 class="product-card__name">${p.name}</h3>
                        <div class="product-card__prices">
                            <span class="product-card__price">$${p.price}</span>
                            ${p.originalPrice
                                ? `<span class="product-card__original-price">$${p.originalPrice}</span>`
                                : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
        }
    }

    // ─── Render: category rail ────────────────────────────────────────────────

    function renderCategoryRail() {
        if (!categoryTrack) return;
        categoryTrack.innerHTML = categoriesData.map(cat => `
            <button class="category-rail__btn ${state.selectedCategory === cat.value ? 'is-active' : ''}"
                    data-category-value="${cat.value}">
                <div class="category-rail__circle">
                    ${cat.icon === 'text'
                        ? '<span class="category-rail__text-all">VER TODO</span>'
                        : `<i data-lucide="${cat.icon}" style="width:32px;height:32px;"></i>`}
                </div>
                <div class="category-rail__label">
                    <span>${cat.label}</span>
                </div>
            </button>
        `).join('');
        lucide.createIcons();
    }

    // ─── Render: promo carousel ───────────────────────────────────────────────

    let currentPromoSlide = 0;

    function renderPromoCarousel() {
        if (!promoTrack || !promoDots) return;
        promoTrack.innerHTML = promos.map(promo => `
            <div class="promo-carousel__slide promo-carousel__slide--${promo.theme}">
                <div class="promo-carousel__content">
                    <h2 class="promo-carousel__title">${promo.title}</h2>
                    <p class="promo-carousel__desc">${promo.description}</p>
                    <a href="${promo.link}" class="promo-carousel__btn promo-carousel__btn--${promo.theme}">
                        ${promo.buttonText}
                    </a>
                </div>
                <div class="promo-carousel__image-wrapper">
                    <img src="${promo.image}" alt="${promo.title}" class="promo-carousel__image">
                </div>
            </div>
        `).join('');

        promoDots.innerHTML = promos.map((_, i) => `
            <button class="promo-carousel__dot ${i === 0 ? 'promo-carousel__dot--active' : ''}"
                    data-promo-index="${i}"></button>
        `).join('');
    }

    function updatePromoCarousel() {
        if (!promoTrack) return;
        promoTrack.style.transform = `translateX(-${currentPromoSlide * 100}%)`;
        document.querySelectorAll('.promo-carousel__dot').forEach((dot, i) => {
            dot.classList.toggle('promo-carousel__dot--active', i === currentPromoSlide);
        });
    }

    // ─── Detail panel ─────────────────────────────────────────────────────────

    if (detailOverlay) detailOverlay.addEventListener('click', closeDetail);
    if (detailClose)   detailClose.addEventListener('click', closeDetail);
    if (detailAddBtn)  detailAddBtn.addEventListener('click', () => {
        if (currentDetailProduct) addToCart(currentDetailProduct);
    });

    window.openDetail = function (product) {
        currentDetailProduct = product;
        detailImg.src                  = product.image;
        detailImg.alt                  = product.name;
        detailCat.textContent          = product.category;
        detailName.textContent         = product.name;
        detailPrice.textContent        = `$${product.price}`;
        detailOriginal.textContent     = product.originalPrice ? `$${product.originalPrice}` : '';
        detailDesc.textContent         = product.description ?? 'Sin descripción disponible.';
        detailStock.textContent        = product.stock ? `Disponible (${product.stock} en stock)` : 'Disponible';
        detailAddBtn.classList.remove('is-added');
        detailAddBtn.innerHTML = `
            <i data-lucide="shopping-cart" style="width:20px;height:20px;"></i>
            Agregar al Carrito`;
        lucide.createIcons();
        detailOverlay.classList.add('is-open');
        detailPanel.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    function closeDetail() {
        detailOverlay.classList.remove('is-open');
        detailPanel.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // ─── Cart ─────────────────────────────────────────────────────────────────

    function getCart() {
        try { return JSON.parse(localStorage.getItem('kanu_cart') || '[]'); }
        catch { return []; }
    }

    function saveCart(cart) {
        localStorage.setItem('kanu_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('kanu-cart-updated'));
        updateCartBadge();
    }

    function updateCartBadge() {
        try {
            const cart  = getCart();
            const total = cart.reduce((acc, i) => acc + i.qty, 0);
            const desktopBadge = document.getElementById('desktop-cart-badge');
            const mobileBadge  = document.getElementById('mobile-cart-badge');
            if (desktopBadge) { desktopBadge.style.display = total > 0 ? 'flex' : 'none'; desktopBadge.textContent = total; }
            if (mobileBadge)  { mobileBadge.style.display  = total > 0 ? 'flex' : 'none'; mobileBadge.textContent  = total; }
        } catch {}
    }

    function addToCart(product) {
        const cart = getCart();
        const idx  = cart.findIndex(i => i.id === product.id);
        if (idx >= 0) {
            cart[idx].qty += 1;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
        }
        saveCart(cart);

        detailAddBtn.classList.add('is-added');
        detailAddBtn.innerHTML = `
            <i data-lucide="check" style="width:20px;height:20px;"></i>
            ¡Agregado!`;
        lucide.createIcons();
        setTimeout(() => {
            detailAddBtn.classList.remove('is-added');
            detailAddBtn.innerHTML = `
                <i data-lucide="shopping-cart" style="width:20px;height:20px;"></i>
                Agregar al Carrito`;
            lucide.createIcons();
        }, 2000);

        showToast(`${product.name.split(' ').slice(0, 3).join(' ')} agregado al carrito`);
    }

    function showToast(msg) {
        if (!cartToast) return;
        cartToast.textContent = msg;
        cartToast.classList.add('is-visible');
        setTimeout(() => cartToast.classList.remove('is-visible'), 2800);
    }

    // ─── Event listeners ──────────────────────────────────────────────────────

    if (searchInput) {
        searchInput.addEventListener('input', e => {
            state.searchTerm = e.target.value;
            renderProducts();
        });
    }

    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', e => {
            state.priceRange = parseInt(e.target.value);
            if (priceValue) priceValue.textContent = `$${state.priceRange}`;
            renderProducts();
        });
    }

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            state.selectedCategory = btn.dataset.category;
            syncCategoryUI();
            renderProducts();
        });
    });

    if (categoryTrack) {
        categoryTrack.addEventListener('click', e => {
            const btn = e.target.closest('.category-rail__btn');
            if (!btn) return;
            state.selectedCategory = btn.dataset.categoryValue;
            syncCategoryUI();
            renderProducts();
        });
    }

    // ← delegación: funciona aunque el botón sea recreado por renderProducts()
    document.addEventListener('click', e => {
        if (e.target.id === 'clear-filters-btn') resetState();
    });

    if (promoPrevBtn) {
        promoPrevBtn.addEventListener('click', () => {
            currentPromoSlide = currentPromoSlide === 0 ? promos.length - 1 : currentPromoSlide - 1;
            updatePromoCarousel();
        });
    }

    if (promoNextBtn) {
        promoNextBtn.addEventListener('click', () => {
            currentPromoSlide = currentPromoSlide === promos.length - 1 ? 0 : currentPromoSlide + 1;
            updatePromoCarousel();
        });
    }

    setInterval(() => {
        if (promos.length > 0) {
            currentPromoSlide = currentPromoSlide === promos.length - 1 ? 0 : currentPromoSlide + 1;
            updatePromoCarousel();
        }
    }, 6000);

    // ─── Init ─────────────────────────────────────────────────────────────────

    renderCategoryRail();
    cargarProductos();
    cargarPromociones();
    updateCartBadge();

});