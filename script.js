// ============================================
// IEEE Student Branch Website - Main Script
// ============================================

// Counter animation for statistics on scroll
const animateCounters = () => {
    const counters = document.querySelectorAll('.counter-value');
    let animated = false;

    const startAnimation = () => {
        if (animated) return;
        animated = true;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target') || 0;
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            let startTime = null;

            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const value = Math.floor(progress * target);
                counter.textContent = value + suffix;
                if (progress < 1) requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        });
    };

    // Trigger when stats section is visible
    const statsSection = document.querySelector('.stats-container');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startAnimation();
            observer.unobserve(statsSection);
        }
    }, { threshold: 0.5 });

    observer.observe(statsSection);
};

// Image fallback handler for broken image links
const setupImageFallback = () => {
    const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#E5E7EB"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="Poppins, Arial" font-size="20">Image Unavailable</text></svg>'
    );

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (this.src !== placeholder) {
                this.src = placeholder;
            }
        });
    });
};

// Smooth scroll navigation for anchor links
const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    updateActiveNavLink(href);
                }
            }
        });
    });
};

// Update active navigation link on scroll
const updateActiveNavLink = (targetId) => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
};

// Navbar scroll effect for shadow and styling
const setupNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
};

// Contact form submission handler
const setupContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = this.querySelector('input[type="text"]');
        const name = nameInput ? nameInput.value : 'Visitor';

        // Show success message
        alert(`Thank you, ${name}! We will contact you soon.`);
        this.reset();
    });
};

// Back to top button functionality
const setupBackToTop = () => {
    let backToTopBtn = document.querySelector('.back-to-top');

    // Create button if it doesn't exist
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }

    // Style the button
    Object.assign(backToTopBtn.style, {
        display: 'none',
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: '999',
        cursor: 'pointer',
        backgroundColor: '#00629B',
        color: 'white',
        padding: '1rem',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        border: 'none',
        transition: 'all 0.3s ease',
        fontSize: '18px'
    });

    // Show/hide on scroll with performance optimization
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Click handler
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Hover effects
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'translateY(-5px)';
        backToTopBtn.style.boxShadow = '0 8px 20px rgba(0, 98, 155, 0.3)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'translateY(0)';
        backToTopBtn.style.boxShadow = 'none';
    });
};

// Simple slideshow: cycles slides by toggling .active class
const setupSlideshow = () => {
    const slideshow = document.getElementById('mainSlideshow');
    if (!slideshow) return;
    const slides = Array.from(slideshow.querySelectorAll('.slideshow-slide'));
    if (slides.length <= 1) return;

    let idx = 0;
    let interval = setInterval(() => {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
    }, 4000);

    // Pause on hover
    slideshow.addEventListener('mouseenter', () => clearInterval(interval));
    slideshow.addEventListener('mouseleave', () => {
        interval = setInterval(() => {
            slides[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
        }, 4000);
    });
};

// Swiper (Events) initialization - left-right slider with responsive columns
const setupEventSwiper = () => {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.mySwiper', {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 20,
        autoplay: { delay: 3500, disableOnInteraction: false },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
};

// Initialize all functionality when DOM is ready
const initializeApp = () => {
    setupImageFallback();
    setupSmoothScroll();
    setupNavbarScroll();
    setupContactForm();
    setupBackToTop();
    setupSlideshow();
    setupEventSwiper();
    animateCounters();
};

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
