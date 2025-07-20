// CPREQUAM - JavaScript Moderne avec Animations Avancées
// Inspiré des meilleurs sites éducatifs

document.addEventListener("DOMContentLoaded", function() {
    
    // ===== CONFIGURATION =====
    const CONFIG = {
        heroImages: [
            "images/nouveau-hero-accueil.jpg",
            "images/nouveau-hero-formations.jpg", 
            "images/nouveau-hero-contact.jpg"
        ],
        carouselInterval: 6000,
        animationDuration: 300,
        scrollThreshold: 100
    };

    // ===== UTILITAIRES =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // ===== HEADER INTELLIGENT =====
    let lastScrollTop = 0;
    let isScrolling = false;
    const header = document.querySelector('header');
    
    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ajouter classe scrolled pour effet backdrop
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Header intelligent (disparaît/réapparaît)
        if (scrollTop > CONFIG.scrollThreshold && !isScrolling) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', debounce(handleHeaderScroll, 10));

    // ===== CARROUSEL D'IMAGES HERO AVANCÉ =====
    class HeroCarousel {
        constructor() {
            this.heroSection = document.getElementById("hero");
            this.currentImageIndex = 0;
            this.isTransitioning = false;
            this.init();
        }

        init() {
            if (!this.heroSection) return;
            
            // Créer les indicateurs
            this.createIndicators();
            
            // Démarrer le carrousel automatique
            this.startAutoCarousel();
            
            // Ajouter les contrôles
            this.addControls();
            
            // Initialiser la première image
            this.updateBackground(0);
        }

        createIndicators() {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';
            indicatorsContainer.innerHTML = CONFIG.heroImages.map((_, index) => 
                `<button class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>`
            ).join('');
            
            this.heroSection.appendChild(indicatorsContainer);
            
            // Ajouter les événements
            indicatorsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('indicator')) {
                    const index = parseInt(e.target.dataset.index);
                    this.goToSlide(index);
                }
            });
        }

        addControls() {
            const controlsHTML = `
                <button class="carousel-control prev" aria-label="Image précédente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                </button>
                <button class="carousel-control next" aria-label="Image suivante">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                </button>
            `;
            
            this.heroSection.insertAdjacentHTML('beforeend', controlsHTML);
            
            // Événements des contrôles
            this.heroSection.querySelector('.prev').addEventListener('click', () => this.previousSlide());
            this.heroSection.querySelector('.next').addEventListener('click', () => this.nextSlide());
        }

        updateBackground(index, direction = 'next') {
            if (this.isTransitioning) return;
            
            this.isTransitioning = true;
            const newImage = CONFIG.heroImages[index];
            
            // Créer un nouvel élément d'image pour la transition
            const newBg = document.createElement('div');
            newBg.className = 'hero-bg-transition';
            newBg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(74, 144, 226, 0.75) 0%, rgba(53, 122, 189, 0.8) 100%), url(${newImage});
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                opacity: 0;
                transform: translateX(${direction === 'next' ? '100%' : '-100%'});
                transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 0;
            `;
            
            this.heroSection.appendChild(newBg);
            
            // Déclencher la transition
            requestAnimationFrame(() => {
                newBg.style.opacity = '1';
                newBg.style.transform = 'translateX(0)';
            });
            
            // Nettoyer après la transition
            setTimeout(() => {
                this.heroSection.style.background = `linear-gradient(135deg, rgba(74, 144, 226, 0.75) 0%, rgba(53, 122, 189, 0.8) 100%), url(${newImage})`;
                this.heroSection.style.backgroundSize = 'cover';
                this.heroSection.style.backgroundPosition = 'center';
                this.heroSection.style.backgroundAttachment = 'fixed';
                newBg.remove();
                this.isTransitioning = false;
            }, 1000);
            
            // Mettre à jour les indicateurs
            this.updateIndicators(index);
        }

        updateIndicators(activeIndex) {
            const indicators = this.heroSection.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        }

        nextSlide() {
            this.currentImageIndex = (this.currentImageIndex + 1) % CONFIG.heroImages.length;
            this.updateBackground(this.currentImageIndex, 'next');
            this.resetAutoCarousel();
        }

        previousSlide() {
            this.currentImageIndex = this.currentImageIndex === 0 ? CONFIG.heroImages.length - 1 : this.currentImageIndex - 1;
            this.updateBackground(this.currentImageIndex, 'prev');
            this.resetAutoCarousel();
        }

        goToSlide(index) {
            if (index === this.currentImageIndex) return;
            const direction = index > this.currentImageIndex ? 'next' : 'prev';
            this.currentImageIndex = index;
            this.updateBackground(this.currentImageIndex, direction);
            this.resetAutoCarousel();
        }

        startAutoCarousel() {
            this.autoCarouselInterval = setInterval(() => {
                this.nextSlide();
            }, CONFIG.carouselInterval);
        }

        resetAutoCarousel() {
            clearInterval(this.autoCarouselInterval);
            this.startAutoCarousel();
        }
    }

    // Initialiser le carrousel
    new HeroCarousel();

    // ===== ANIMATIONS AU SCROLL =====
    class ScrollAnimations {
        constructor() {
            this.elements = document.querySelectorAll('.animate-on-scroll, .formation-card, .stat-item, .social-link');
            this.init();
        }

        init() {
            // Ajouter la classe animate-on-scroll aux éléments qui n'en ont pas
            this.elements.forEach(el => {
                if (!el.classList.contains('animate-on-scroll')) {
                    el.classList.add('animate-on-scroll');
                }
            });

            // Observer pour les animations
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        // Ajouter un délai pour les éléments en grille
                        if (entry.target.classList.contains('formation-card')) {
                            const cards = Array.from(entry.target.parentElement.children);
                            const index = cards.indexOf(entry.target);
                            entry.target.style.animationDelay = `${index * 0.1}s`;
                        }
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.elements.forEach(el => this.observer.observe(el));
        }
    }

    new ScrollAnimations();

    // ===== COMPTEURS ANIMÉS =====
    class AnimatedCounters {
        constructor() {
            this.counters = document.querySelectorAll('.stat-number');
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            this.counters.forEach(counter => observer.observe(counter));
        }

        animateCounter(element) {
            const target = parseFloat(element.textContent);
            const isPercentage = element.textContent.includes('%');
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeInOutCubic(progress);
                const current = target * easedProgress;

                element.textContent = Math.floor(current) + (isPercentage ? '%' : '');

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target + (isPercentage ? '%' : '');
                }
            };

            requestAnimationFrame(animate);
        }
    }

    new AnimatedCounters();

    // ===== EFFETS DE SURVOL AVANCÉS =====
    function initHoverEffects() {
        // Effet de brillance pour les cartes
        const cards = document.querySelectorAll('.formation-card, .stat-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Effet de particules pour le logo
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            logo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    }

    initHoverEffects();

    // ===== NAVIGATION FLUIDE =====
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initSmoothScrolling();

    // ===== VALIDATION FORMULAIRE AVANCÉE =====
    class FormValidator {
        constructor() {
            this.form = document.getElementById('contactForm');
            this.init();
        }

        init() {
            if (!this.form) return;

            this.fields = {
                prenom: document.getElementById('prenom'),
                nom: document.getElementById('nom'),
                email: document.getElementById('email'),
                message: document.getElementById('message')
            };

            this.setupValidation();
            this.setupSubmission();
        }

        setupValidation() {
            Object.entries(this.fields).forEach(([name, field]) => {
                if (!field) return;

                // Validation en temps réel
                field.addEventListener('input', () => this.validateField(name, field));
                field.addEventListener('blur', () => this.validateField(name, field));
                
                // Effets visuels
                field.addEventListener('focus', () => {
                    field.parentElement.classList.add('focused');
                });
                
                field.addEventListener('blur', () => {
                    field.parentElement.classList.remove('focused');
                });
            });
        }

        validateField(name, field) {
            const value = field.value.trim();
            let error = '';

            switch (name) {
                case 'prenom':
                case 'nom':
                    if (!value) {
                        error = `Le ${name} est obligatoire`;
                    } else if (value.length < 2) {
                        error = `Le ${name} doit contenir au moins 2 caractères`;
                    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
                        error = `Le ${name} ne doit pas contenir de chiffres ni de symboles`;
                    }
                    break;
                
                case 'email':
                    if (!value) {
                        error = 'L\'adresse e-mail est obligatoire';
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        error = 'Veuillez entrer une adresse e-mail valide';
                    }
                    break;
                
                case 'message':
                    if (!value) {
                        error = 'Le message est obligatoire';
                    } else if (value.length < 10) {
                        error = 'Le message doit contenir au moins 10 caractères';
                    }
                    break;
            }

            this.showError(name, error);
            return !error;
        }

        showError(fieldName, message) {
            const errorElement = document.getElementById(`${fieldName}-error`);
            const fieldElement = this.fields[fieldName];
            
            if (errorElement && fieldElement) {
                errorElement.textContent = message;
                errorElement.style.display = message ? 'block' : 'none';
                fieldElement.classList.toggle('error', !!message);
                
                // Animation de l'erreur
                if (message) {
                    errorElement.style.animation = 'shake 0.5s ease-in-out';
                    setTimeout(() => {
                        errorElement.style.animation = '';
                    }, 500);
                }
            }
        }

        setupSubmission() {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Valider tous les champs
                let isValid = true;
                Object.entries(this.fields).forEach(([name, field]) => {
                    if (!this.validateField(name, field)) {
                        isValid = false;
                    }
                });

                if (!isValid) return;

                // Animation de soumission
                this.submitForm();
            });
        }

        async submitForm() {
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Animation de chargement
            submitButton.innerHTML = `
                <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="60" stroke-dashoffset="60">
                        <animate attributeName="stroke-dashoffset" dur="2s" values="60;0" repeatCount="indefinite"/>
                    </circle>
                </svg>
                Envoi en cours...
            `;
            submitButton.disabled = true;

            // Simuler l'envoi
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Afficher le message de confirmation avec animation
            this.showConfirmation();
        }

        showConfirmation() {
            const form = this.form;
            const confirmation = document.getElementById('confirmationMessage');
            
            // Animation de sortie du formulaire
            form.style.transform = 'translateY(-20px)';
            form.style.opacity = '0';
            
            setTimeout(() => {
                form.style.display = 'none';
                confirmation.style.display = 'block';
                confirmation.style.transform = 'translateY(20px)';
                confirmation.style.opacity = '0';
                
                // Animation d'entrée de la confirmation
                requestAnimationFrame(() => {
                    confirmation.style.transform = 'translateY(0)';
                    confirmation.style.opacity = '1';
                });
            }, 300);
        }
    }

    new FormValidator();

    // ===== EFFETS DE PARALLAXE =====
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-section');
        
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 10));
    }

    initParallaxEffects();

    // ===== GESTION DES ERREURS =====
    window.addEventListener('error', function(e) {
        console.error('Erreur JavaScript:', e.error);
    });

    // ===== PERFORMANCE =====
    // Lazy loading pour les images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== ACCESSIBILITÉ =====
    // Gestion du clavier pour les carrousels
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            document.querySelector('.carousel-control.prev')?.click();
        } else if (e.key === 'ArrowRight') {
            document.querySelector('.carousel-control.next')?.click();
        }
    });

    // ===== INITIALISATION FINALE =====
    console.log('🎉 CPREQUAM - Site web chargé avec succès!');
    
    // Déclencher une animation de bienvenue
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== STYLES CSS ADDITIONNELS POUR LES ANIMATIONS =====
const additionalStyles = `
<style>
/* Styles pour le carrousel hero */
.carousel-indicators {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
}

.indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.5);
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
}

.indicator.active {
    background: white;
    border-color: white;
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
    backdrop-filter: blur(10px);
}

.carousel-control:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-50%) scale(1.1);
}

.carousel-control.prev {
    left: 30px;
}

.carousel-control.next {
    right: 30px;
}

/* Animation de chargement */
.loading-spinner {
    animation: spin 1s linear infinite;
    margin-right: 8px;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Animation de secousse pour les erreurs */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Effet de focus pour les champs */
.form-group.focused label {
    color: var(--primary-color);
    transform: translateY(-2px);
}

/* Animation de chargement de la page */
body:not(.loaded) {
    overflow: hidden;
}

body.loaded {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Responsive pour les contrôles du carrousel */
@media (max-width: 768px) {
    .carousel-control {
        width: 40px;
        height: 40px;
    }
    
    .carousel-control.prev {
        left: 15px;
    }
    
    .carousel-control.next {
        right: 15px;
    }
    
    .carousel-indicators {
        bottom: 20px;
    }
}
</style>
`;

// Injecter les styles additionnels
document.head.insertAdjacentHTML('beforeend', additionalStyles);

