document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    
    if (navbarPlaceholder) {
        fetch('navbar-component.html')
            .then(response => response.text())
            .then(html => {
                navbarPlaceholder.innerHTML = html;

                if (window.lucide) lucide.createIcons();

                const modal = document.getElementById('auth-modal');
                if (modal) document.body.appendChild(modal);

                if (!window.navbarScriptLoaded) {
                    const script = document.createElement('script');
                    script.src = 'navbar.js';
                    script.onload = () => {
                        window.navbarScriptLoaded = true;
                        initNavbar();
                    };
                    document.body.appendChild(script);
                } else {
                    initNavbar();
                }
            })
            .catch(error => console.error('Error cargando la navbar:', error));
    }
});