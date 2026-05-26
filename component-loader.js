document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    
    if (navbarPlaceholder) {
        fetch('navbar-component.html')
            .then(response => response.text())
            .then(html => {
                navbarPlaceholder.innerHTML = html;
                
                if (window.lucide) {
                    lucide.createIcons();
                }

                // Mover el modal al body para que position:fixed funcione correctamente
                const modal = document.getElementById('auth-modal');
                if (modal) document.body.appendChild(modal);
                
                if (!window.navbarScriptLoaded) {
                    const script = document.createElement('script');
                    script.src = 'navbar.js';
                    document.body.appendChild(script);
                    window.navbarScriptLoaded = true;
                } else {
                    window.dispatchEvent(new Event('navbar-ready'));
                }
            })
            .catch(error => console.error('Error cargando la navbar:', error));
    }
});