document.addEventListener('DOMContentLoaded', async () => {

    lucide.createIcons();

    setTimeout(() => {

        document.querySelector('.animate-left')?.classList.add('is-visible');
        document.querySelector('.animate-scale')?.classList.add('is-visible');

    }, 100);

    let products = [];

    async function cargarProductos() {

        try {

            const respuesta = await fetch('obtener_productos.php');

            const data = await respuesta.json();

            // Mezclar aleatoriamente
            products = data.sort(() => 0.5 - Math.random());

            // Tomar solo 5
            products = products.slice(0, 5);

            renderProducts();

        } catch(error) {

            console.log('Error cargando productos:', error);

        }

    }

    const benefitsData = [
        {
            icon: 'truck',
            title: "Envío Rápido",
            desc: "Entregas en menos de 24 horas en zonas metropolitanas.",
            colorClass: "blue"
        },
        {
            icon: 'shield-check',
            title: "Productos Seguros",
            desc: "Solo marcas certificadas y recomendadas por veterinarios.",
            colorClass: "green"
        },
        {
            icon: 'heart',
            title: "Compromiso Social",
            desc: "Apoyamos activamente a refugios y rescate animal.",
            colorClass: "red"
        }
    ];

    const testimonialsData = [
        {
            name: "María García",
            pet: "Dueña de Max",
            text: "Excelente servicio, el alimento llegó súper rápido y a Max le encanta.",
            img: "img/p2.jpg"
        },
        {
            name: "Carlos Ruiz",
            pet: "Dueño de Luna",
            text: "La estética canina es excelente y el personal muy amable.",
            img: "img/p1.jpg"
        },
        {
            name: "Ana Martínez",
            pet: "Dueña de Toby",
            text: "Encontré accesorios increíbles para mi mascota.",
            img: "img/p3.jpg"
        }
    ];

    const benefitsGrid = document.getElementById('benefits-grid');

    benefitsData.forEach(benefit => {

        benefitsGrid.innerHTML += `

            <div class="benefit-card">

                <div class="benefit-card__icon benefit-card__icon--${benefit.colorClass}">

                    <i data-lucide="${benefit.icon}" style="width:32px;height:32px;"></i>

                </div>

                <h3 class="benefit-card__title">
                    ${benefit.title}
                </h3>

                <p class="benefit-card__text">
                    ${benefit.desc}
                </p>

            </div>

        `;

    });

    const productGrid = document.getElementById('product-grid');

    function renderProducts() {

        productGrid.innerHTML = '';

        products.forEach(product => {

            productGrid.innerHTML += `

                <div class="product-card">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="product-card__img"
                    >

                    <div class="product-card__body">

                        <span class="product-card__category">
                            ${product.category}
                        </span>

                        <h3 class="product-card__name">
                            ${product.name}
                        </h3>

                        <p class="product-card__price">
                            $${parseFloat(product.price).toFixed(2)}
                        </p>

                    </div>

                </div>

            `;

        });

    }

    const starsContainer = document.getElementById('stars-container');

    for (let i = 0; i < 5; i++) {

        starsContainer.innerHTML += `
            <i data-lucide="star"
               style="width:20px;height:20px; fill: currentColor;">
            </i>
        `;

    }

    const testimonialsGrid = document.getElementById('testimonials-grid');

    testimonialsData.forEach(testimonial => {

        testimonialsGrid.innerHTML += `

            <div class="testimonial-card">

                <p class="testimonial-card__text">
                    "${testimonial.text}"
                </p>

                <div class="testimonial-card__author">

                    <img
                        src="${testimonial.img}"
                        alt="${testimonial.name}"
                        class="testimonial-card__avatar"
                    >

                    <div>

                        <h4 class="testimonial-card__name">
                            ${testimonial.name}
                        </h4>

                        <p class="testimonial-card__role">
                            ${testimonial.pet}
                        </p>

                    </div>

                </div>

            </div>

        `;

    });

    await cargarProductos();

    lucide.createIcons();

});