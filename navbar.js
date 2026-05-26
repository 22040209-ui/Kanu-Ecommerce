// ── AUTH FUNCTIONS (scope global para que funcionen los onclick) ──

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
  });
  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');
  document.getElementById('success-screen').classList.remove('show');
  document.querySelectorAll('.alert').forEach(a => a.classList.remove('show'));
  document.querySelectorAll('input').forEach(i => i.classList.remove('error'));
  if (tab === 'login') document.getElementById('login-hint').style.display = 'block';
}

function setLoading(btn, loading, text) {
  btn.disabled = loading;
  btn.innerHTML = loading ? `<span class="spinner"></span> Verificando...` : text;
}

function showSuccess(title, msg) {
  document.getElementById('panel-login').classList.remove('active');
  document.getElementById('panel-register').classList.remove('active');
  document.getElementById('success-title').textContent = title;
  document.getElementById('success-msg').textContent = msg;
  document.getElementById('success-screen').classList.add('show');
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  errEl.classList.remove('show');
  document.getElementById('login-email').classList.remove('error');
  document.getElementById('login-pass').classList.remove('error');

  if (!email || !pass) {
    errEl.textContent = 'Por favor completa todos los campos.';
    errEl.classList.add('show');
    if (!email) document.getElementById('login-email').classList.add('error');
    if (!pass) document.getElementById('login-pass').classList.add('error');
    return;
  }

  setLoading(btn, true);

  setTimeout(() => {
    if (email === 'demo@kanu.com' && pass === '123456') {
      showSuccess('¡Bienvenido de vuelta! 🐾', `Hola ${email} — tu cuenta Club Pet está activa.`);
    } else {
      setLoading(btn, false, 'Ingresar de Forma Segura');
      errEl.textContent = 'Correo o contraseña incorrectos. Usa demo@kanu.com / 123456.';
      errEl.classList.add('show');
      document.getElementById('login-email').classList.add('error');
      document.getElementById('login-pass').classList.add('error');
    }
  }, 1400);
}

function doRegister() {
  const name    = document.getElementById('reg-name').value.trim();
  const last    = document.getElementById('reg-lastname').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const address = document.getElementById('reg-address').value.trim();
  const city    = document.getElementById('reg-city').value.trim();
  const pass    = document.getElementById('reg-pass').value;
  const pass2   = document.getElementById('reg-pass2').value;
  const errEl   = document.getElementById('reg-error');
  const btn     = document.getElementById('reg-btn');

  errEl.classList.remove('show');
  document.querySelectorAll('#panel-register input').forEach(i => i.classList.remove('error'));

  let errors = [];
  if (!name)                        { errors.push('nombre');                    document.getElementById('reg-name').classList.add('error'); }
  if (!last)                        { errors.push('apellido');                  document.getElementById('reg-lastname').classList.add('error'); }
  if (!email || !email.includes('@')){ errors.push('correo válido');            document.getElementById('reg-email').classList.add('error'); }
  if (!address)                     { errors.push('dirección');                 document.getElementById('reg-address').classList.add('error'); }
  if (!city)                        { errors.push('ciudad');                    document.getElementById('reg-city').classList.add('error'); }
  if (pass.length < 8)              { errors.push('contraseña mín. 8 caracteres'); document.getElementById('reg-pass').classList.add('error'); }
  if (pass !== pass2)               { errors.push('las contraseñas no coinciden'); document.getElementById('reg-pass2').classList.add('error'); }

  if (errors.length) {
    errEl.textContent = 'Revisa: ' + errors.join(', ') + '.';
    errEl.classList.add('show');
    return;
  }

  setLoading(btn, true);

  fetch('guardar_cliente.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, lastname: last, email, address, city, password: pass })
  })
  .then(r => r.json())
  .then(data => {
    setLoading(btn, false, 'Crear mi Cuenta');
    if (data.success) {
      showSuccess(`¡Cuenta creada, ${name}! 🎉`, 'Ya eres parte del Club Pet de Kanu & Amigos.');
    } else {
      errEl.textContent = data.message || 'Error al crear la cuenta.';
      errEl.classList.add('show');
    }
  })
  .catch(() => {
    setLoading(btn, false, 'Crear mi Cuenta');
    errEl.textContent = 'Error de conexión. Intenta de nuevo.';
    errEl.classList.add('show');
  });
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const modal = document.getElementById('auth-modal');
  if (!modal || !modal.classList.contains('is-open')) return;
  if (document.getElementById('panel-login').classList.contains('active')) doLogin();
  else doRegister();
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('is-open');
  }
});

// ── NAVBAR ──

function initNavbar() {
  let isMenuOpen = false;

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuToggle || !mobileMenu) return;

  const desktopLinks = document.querySelectorAll('.navbar__link');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');
  const desktopBadge = document.getElementById('desktop-cart-badge');
  const mobileBadge = document.getElementById('mobile-cart-badge');

  const iconMenu = menuToggle.querySelector('.icon-menu');
  const iconClose = menuToggle.querySelector('.icon-close');

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('is-open', isMenuOpen);
    if (isMenuOpen) {
      if (iconMenu) iconMenu.style.display = 'none';
      if (iconClose) iconClose.style.display = 'block';
    } else {
      if (iconMenu) iconMenu.style.display = 'block';
      if (iconClose) iconClose.style.display = 'none';
    }
  };

  const setActiveLink = () => {
    const currentPath = window.location.pathname;
    const allLinks = [...desktopLinks, ...mobileLinks];
    allLinks.forEach(link => {
      const linkPath = link.getAttribute('data-path');
      link.classList.remove('is-active');
      if (linkPath === '/' && currentPath === '/') {
        link.classList.add('is-active');
      } else if (linkPath !== '/' && currentPath.includes(linkPath)) {
        link.classList.add('is-active');
      }
    });
  };

// Y reemplaza renderCartBadge por esto:
const renderCartBadge = () => {
    try {
        const cart = JSON.parse(localStorage.getItem('kanu_cart') || '[]');
        const total = cart.reduce((acc, i) => acc + i.qty, 0);
        if (desktopBadge) { desktopBadge.style.display = total > 0 ? 'flex' : 'none'; desktopBadge.textContent = total; }
        if (mobileBadge)  { mobileBadge.style.display  = total > 0 ? 'flex' : 'none'; mobileBadge.textContent  = total; }
    } catch { }
};

  const newToggle = menuToggle.cloneNode(true);
  menuToggle.parentNode.replaceChild(newToggle, menuToggle);
  newToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
    newLink.addEventListener('click', () => { if (isMenuOpen) toggleMenu(); });
  });

  setActiveLink();
  renderCartBadge();

  if (iconClose) iconClose.style.display = 'none';
  if (iconMenu) iconMenu.style.display = 'block';

  if (window.lucide) lucide.createIcons();

  // Mover modal al body y configurar cierre
  const modal = document.getElementById('auth-modal');
  if (modal) {
    document.body.appendChild(modal);

    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-open');
      }
    });
  }
  window.addEventListener('storage', renderCartBadge);
window.addEventListener('kanu-cart-updated', renderCartBadge);
}

document.addEventListener("DOMContentLoaded", initNavbar);
window.addEventListener("navbar-ready", initNavbar);