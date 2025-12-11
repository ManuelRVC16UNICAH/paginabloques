document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const header = document.getElementById('home-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav-content a');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-nav-overlay');
    const closeMenu = document.querySelector('.close-menu');

    // --- 1. Desplazamiento Suave (Smooth Scrolling) y Cerrar Menú Móvil ---
    const smoothScroll = function(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calcula la altura del header dinámico (80px normal, 65px al hacer scroll)
            const headerHeight = header.classList.contains('scrolled') ? 65 : 80;
            
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    };

    // Aplica el desplazamiento suave a todos los enlaces internos
    document.querySelectorAll('.main-nav a[href^="#"], .btn[href^="#"], .mobile-nav-content a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
            
            // Cierra el menú móvil si se hace clic en un enlace de este menú
            if (mobileMenu.classList.contains('open')) {
                 mobileMenu.classList.remove('open');
            }
        });
    });
    
    // --- 2. Header Dinámico (Cambio de tamaño/color al hacer scroll) ---
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            // Se activa la clase 'scrolled' en el header al superar 50px de scroll
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // --- 3. Menú Móvil (Toggle) ---
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
    
    // --- 4. Resaltado de Enlaces Activos al hacer Scroll (Intersection Observer) ---
    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
                // 1. Remover 'active' de todos los enlaces de navegación
                navLinks.forEach(link => link.classList.remove('active'));

                // 2. Añadir 'active' al enlace de menú que corresponde al ID de la sección visible
                const activeLink = document.querySelector(`.main-nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        // El rootMargin hace que el observador se active cuando la sección pasa el tercio superior de la pantalla.
        rootMargin: '-30% 0px -70% 0px', 
        threshold: 0 
    });

    // Observa todas las secciones para determinar cuál está activa
    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });

    // --- 5. Animación de "Aparecer al hacer Scroll" (Scroll Reveal) ---
    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                // Caso: Animación de elementos escalonados (staggered - para grids)
                if (entry.target.classList.contains('fade-in-stagger')) {
                    // Selecciona los items dentro del contenedor observado
                    entry.target.querySelectorAll('.fade-in-item').forEach((item, index) => {
                        // Aplica un retraso incremental
                        item.style.transitionDelay = `${index * 0.1}s`; 
                        item.classList.add('visible');
                    });
                } 
                // Caso: Animación de elementos simples o de Hero
                else {
                    entry.target.classList.add('visible');
                }
                
                // Deja de observar el elemento una vez que la animación se ha disparado
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Se activa cuando el elemento es visible en un 10%
        rootMargin: '0px',
        threshold: 0.1 
    });

    // Elementos con animación simple o de Hero (títulos, párrafos, bloques)
    document.querySelectorAll('.fade-in, .animate-fade-in-up').forEach(element => {
        animateObserver.observe(element);
    });

    // Contenedores de elementos escalonados (Grids: Pasos, Beneficios, Inspiración)
    // Observa directamente los contenedores que YA TIENEN la clase 'fade-in-stagger' en el HTML.
    document.querySelectorAll('.fade-in-stagger').forEach(container => {
        animateObserver.observe(container);
    });
});