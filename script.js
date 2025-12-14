// Portfolio Professional - JE DATA SOLUTIONS
// JavaScript para funcionalidades interactivas

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupPortfolioFilter();
        this.setupScrollEffects();
        this.setupContactForm();
        this.setupAnimations();
        this.setupForceDownload();
        this.setupTypewriterEffect();
        this.setupNumberAnimation();
        this.setupStaggeredReveal();
    }

    setupNumberAnimation() {
        const stats = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const originalText = el.innerText;
                    // Extract number and suffix
                    const match = originalText.match(/(\d+)(.*)/);

                    if (match) {
                        const value = parseInt(match[1]);
                        const suffix = match[2];
                        this.animateValue(el, 0, value, 2000, suffix);
                    }

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    animateValue(obj, start, end, duration, suffix) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            obj.innerHTML = Math.floor(easeProgress * (end - start) + start) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    setupStaggeredReveal() {
        const cards = document.querySelectorAll('.competence-card');

        // Add class initially to hide them
        cards.forEach(card => card.classList.add('fade-up-element'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    // Add visible class with a delay based on index if we could track it,
                    // but simple intersection is often enough. 
                    // Let's manually trigger staggered if they appear together.
                    card.classList.add('visible');
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.2 });

        // Or better: staggering logic for the whole grid
        const grid = document.querySelector('.competences-grid');
        if (grid) {
            const gridObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 150); // 150ms delay between each card
                    });
                    gridObserver.unobserve(grid);
                }
            }, { threshold: 0.1 });
            gridObserver.observe(grid);
        } else {
            // Fallback if grid not found
            cards.forEach(card => observer.observe(card));
        }
    }

    setupTypewriterEffect() {
        const elementsToAnimate = [
            document.querySelector('.philosophy p'),
            document.querySelector('.professional-quote')
        ];

        elementsToAnimate.forEach(textElement => {
            if (!textElement) return;

            const textToType = textElement.innerText;
            textElement.innerText = ''; // Clear text
            textElement.classList.add('typing-cursor');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeText(textElement, textToType);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(textElement);
        });
    }

    typeText(element, text) {
        let i = 0;
        const typingSpeed = 30; // ms per char

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, typingSpeed);
            } else {
                element.classList.remove('typing-cursor'); // Remove cursor when done
            }
        }
        type();
    }

    // Mobile Menu Toggle
    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navigation = document.getElementById('navigation');
        const navLinks = document.querySelectorAll('.nav-link');

        if (menuToggle && navigation) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navigation.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });

            // Close menu when clicking on links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navigation.classList.remove('active');
                    menuToggle.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navigation') && !e.target.closest('.menu-toggle')) {
                    navigation.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });

            // Prevent closing when clicking inside menu
            navigation.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Portfolio Filter
    setupPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (filterButtons.length > 0 && portfolioItems.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));

                    // Add active class to clicked button
                    button.classList.add('active');

                    const filterValue = button.getAttribute('data-filter');

                    // Filter portfolio items
                    portfolioItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');

                        if (filterValue === 'all' || itemCategory.includes(filterValue)) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 100);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }

    // Scroll Effects
    setupScrollEffects() {
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            // Header background on scroll
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Active navigation link
            this.updateActiveNavLink();
        });
    }

    // Update Active Navigation Link
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Contact Form Handler
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (this.validateForm(contactForm)) {
                    this.handleFormSubmission(contactForm);
                }
            });
        }
    }

    // Form Validation
    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showError(input, 'Este campo es requerido');
                isValid = false;
            } else {
                this.clearError(input);
            }

            // Email validation
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    this.showError(input, 'Por favor ingresa un email válido');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Show Error Message
    showError(input, message) {
        this.clearError(input);

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e63946';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.5rem';

        input.parentNode.appendChild(errorElement);
        input.style.borderColor = '#e63946';
    }

    // Clear Error Message
    clearError(input) {
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        input.style.borderColor = '';
    }

    // Handle Form Submission
    handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
        submitButton.disabled = true;

        // Allow default submission to proceed (Action: formsubmit.co)
        // This ensures the email is sent even from local file environments where AJAX is blocked.
        // The page will redirect to the _next URL after submission.
        form.submit();
    }

    // Show Notification
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = type === 'success' ? '#2a9d8f' : '#e63946';
        notification.style.color = 'white';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '10000';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Setup Animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.competence-card, .portfolio-item, .about-content, .hero-content, .hero-visual');
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    // Force Download CV
    setupForceDownload() {
        const downloadBtn = document.getElementById('forceDownloadCV');

        if (downloadBtn) {
            downloadBtn.addEventListener('click', async function (e) {
                e.preventDefault();

                // Mostrar indicador de carga
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> DESCARGANDO...';
                this.disabled = true;

                try {
                    const pdfUrl = 'pdf/cv-juaneder-23.pdf';
                    const fileName = 'CV_Juan_Eder.pdf';

                    // Usar Fetch API para obtener el archivo como blob
                    const response = await fetch(pdfUrl);

                    if (!response.ok) {
                        throw new Error('Archivo no encontrado');
                    }

                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);

                    // Crear enlace de descarga
                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = fileName;
                    downloadLink.style.display = 'none';

                    // Trigger de descarga
                    document.body.appendChild(downloadLink);
                    downloadLink.click();

                    // Limpiar
                    setTimeout(() => {
                        document.body.removeChild(downloadLink);
                        window.URL.revokeObjectURL(blobUrl);
                    }, 100);

                    console.log('Descarga forzada iniciada');

                } catch (error) {
                    console.error('Error en descarga:', error);
                    // Fallback: descarga tradicional
                    const fallbackLink = document.createElement('a');
                    fallbackLink.href = 'pdf/cv-juaneder-23.pdf';
                    fallbackLink.download = 'CV_Juan_Eder.pdf';
                    fallbackLink.style.display = 'none';
                    document.body.appendChild(fallbackLink);
                    fallbackLink.click();
                    document.body.removeChild(fallbackLink);
                } finally {
                    // Restaurar botón
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                }
            });
        }
    }
}

// Add delay attributes for staggered animations
function setupStaggeredAnimations() {
    const competenceCards = document.querySelectorAll('.competence-card');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    competenceCards.forEach((card, index) => {
        card.style.setProperty('--delay', index);
    });

    portfolioItems.forEach((item, index) => {
        item.style.setProperty('--delay', index);
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    setupStaggeredAnimations();
});
