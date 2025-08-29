// Tooltip for project card images
    document.querySelectorAll('.project-img').forEach(function(imgDiv) {
        const tooltip = imgDiv.querySelector('.project-img-tooltip');
        if (!tooltip) return;
        let hideTimeout = null;
        imgDiv.addEventListener('mouseenter', function() {
            imgDiv.classList.add('show-tooltip');
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(function() {
                imgDiv.classList.remove('show-tooltip');
            }, 4000);
        });
        imgDiv.addEventListener('mouseleave', function() {
            imgDiv.classList.remove('show-tooltip');
            if (hideTimeout) clearTimeout(hideTimeout);
        });
    });
document.addEventListener('DOMContentLoaded', function() {
    // Theme setup: from storage or default to light
    const root = document.documentElement;
    const getStored = () => {
        try { return localStorage.getItem('theme'); } catch { return null; }
    };
    const setStored = (val) => {
        try { localStorage.setItem('theme', val); } catch {}
    };
    let theme = getStored() || 'light';
    const applyTheme = (t) => {
        root.classList.toggle('theme-dark', t === 'dark');
        root.classList.toggle('theme-light', t === 'light');
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.classList.toggle('fa-moon', t !== 'dark');
            icon.classList.toggle('fa-sun', t === 'dark');
        }
    };
    applyTheme(theme);

    // Theme Toggle Functionality (guarded)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            theme = (root.classList.contains('theme-dark') ? 'light' : 'dark');
            applyTheme(theme);
            setStored(theme);
        });
    }

    // Mobile Menu Toggle for Navbar (guarded)
    const menuToggle = document.getElementById('menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    if (menuToggle && navbarLinks) {
        menuToggle.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('.navbar-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; // allow default if no target
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            // Update active class
            document.querySelectorAll('.navbar-links a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            // Close mobile menu after clicking
            if (window.innerWidth < 969 && navbarLinks) {
                navbarLinks.classList.remove('active');
            }
        });
    });

    // Scroll progress bar & active link highlighting
    const nav = document.querySelector('.navbar');
    const progressBar = document.querySelector('.nav-progress');
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.navbar-links a[href^="#"]'));

    const setActiveLink = (id) => {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    };

    const onScroll = () => {
        // progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = Math.max(0, Math.min(1, scrollTop / (docHeight || 1)));
        if (progressBar) progressBar.style.width = `${pct * 100}%`;
        // shrink navbar
        if (nav) {
            if (scrollTop > 10) nav.classList.add('shrink'); else nav.classList.remove('shrink');
        }
        // active section
        if (sections.length && navLinks.length) {
            let current = sections[0]?.id;
            for (const sec of sections) {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= 120 && rect.bottom >= 200) { current = sec.id; break; }
            }
            if (current) setActiveLink(current);
        }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Initialize Projects Slider (only if Swiper exists and container present)
    if (typeof Swiper !== 'undefined' && document.querySelector('.projects-slider')) {
        // eslint-disable-next-line no-undef
        new Swiper('.projects-slider', {
            slidesPerView: "auto",
            spaceBetween: 120,
            loop: true,
            centeredSlides: false,
            grabCursor: true,
            initialSlide: 0,
            slideVisibleClass: 'swiper-slide-visible',
            slidesPerView: 3,
            speed: 500,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                0: { 
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                768: { 
                    slidesPerView: 2,
                    spaceBetween: 25
                },
                1400: { 
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }

    // Initialize Leaflet map for My Journey section
    if (document.getElementById('journey-map')) {
        var map = L.map('journey-map', {
            center: [20, 10], // Centered globally, adjust as needed
            zoom: 2,
            zoomControl: false,
            attributionControl: false
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
        }).addTo(map);
    }
});