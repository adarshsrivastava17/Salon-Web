/* ========================================
   LUXE SALON - MAIN JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    ThemeToggle.init();
    Navigation.init();
    ScrollEffects.init();
    Forms.init();
    TimeSlots.init();
    Modal.init();
});

/* Preloader Module */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 500);
        });
        
        // Fallback - remove preloader after 3 seconds
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 3000);
    }
};

/* Theme Toggle Module */
const ThemeToggle = {
    init() {
        this.toggle = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        
        if (!this.toggle) return;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('salon-theme') || 'light';
        this.setTheme(savedTheme);
        
        // Toggle event
        this.toggle.addEventListener('click', () => {
            const currentTheme = this.html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    },
    
    setTheme(theme) {
        this.html.setAttribute('data-theme', theme);
        localStorage.setItem('salon-theme', theme);
    }
};

/* Navigation Module */
const Navigation = {
    init() {
        this.header = document.getElementById('header');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupScrollHeader();
        this.setupActiveLink();
    },
    
    setupMobileMenu() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.navMenu?.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (this.navClose) {
            this.navClose.addEventListener('click', () => {
                this.navMenu?.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
        
        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu?.classList.remove('show');
                document.body.style.overflow = '';
            });
        });
    },
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = this.header?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    setupScrollHeader() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }
        });
    },
    
    setupActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 150;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
};

/* Scroll Effects Module */
const ScrollEffects = {
    init() {
        this.setupScrollAnimations();
        this.setupBackToTop();
        this.setupParallax();
    },
    
    setupScrollAnimations() {
        const animateItems = document.querySelectorAll('.animate-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateItems.forEach(item => observer.observe(item));
    },
    
    setupBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },
    
    setupParallax() {
        const heroShapes = document.querySelectorAll('.hero-shape');
        
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            
            heroShapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
};

/* Forms Module */
const Forms = {
    init() {
        this.setupContactForm();
        this.setupBookingForm();
        this.setupNewsletterForm();
    },
    
    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                // Simulate form submission
                Modal.show('Thank you for your message! We will get back to you soon.');
                form.reset();
            }
        });
    },
    
    setupBookingForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;
        
        // Set minimum date to today
        const dateInput = document.getElementById('booking-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const timeInput = document.getElementById('booking-time');
            const timeError = document.getElementById('time-error');
            
            if (!timeInput.value) {
                if (timeError) {
                    timeError.textContent = 'Please select a time slot';
                    timeError.style.display = 'block';
                }
                return;
            }
            
            if (this.validateForm(form)) {
                Modal.show('Your appointment has been booked successfully! We will send you a confirmation email shortly.');
                form.reset();
                document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
                document.getElementById('booking-time').value = '';
            }
        });
    },
    
    setupNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            Modal.show('Thank you for subscribing to our newsletter!');
            form.reset();
        });
    },
    
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('[required]');
        
        inputs.forEach(input => {
            const errorEl = input.parentElement.querySelector('.form-error');
            const formGroup = input.parentElement;
            
            if (!input.value.trim()) {
                isValid = false;
                formGroup.classList.add('error');
                if (errorEl) errorEl.textContent = 'This field is required';
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                isValid = false;
                formGroup.classList.add('error');
                if (errorEl) errorEl.textContent = 'Please enter a valid email';
            } else if (input.type === 'tel' && !this.isValidPhone(input.value)) {
                isValid = false;
                formGroup.classList.add('error');
                if (errorEl) errorEl.textContent = 'Please enter a valid phone number';
            } else {
                formGroup.classList.remove('error');
            }
        });
        
        return isValid;
    },
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isValidPhone(phone) {
        return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
    }
};

/* Time Slots Module */
const TimeSlots = {
    init() {
        const timeSlots = document.querySelectorAll('.time-slot');
        const timeInput = document.getElementById('booking-time');
        const timeError = document.getElementById('time-error');
        
        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                // Remove selected from all slots
                timeSlots.forEach(s => s.classList.remove('selected'));
                
                // Add selected to clicked slot
                slot.classList.add('selected');
                
                // Update hidden input
                if (timeInput) {
                    timeInput.value = slot.dataset.time;
                }
                
                // Hide error
                if (timeError) {
                    timeError.style.display = 'none';
                }
            });
        });
    }
};

/* Modal Module */
const Modal = {
    init() {
        this.modal = document.getElementById('success-modal');
        this.message = document.getElementById('modal-message');
        this.closeBtn = document.getElementById('modal-close');
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.hide();
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
        });
    },
    
    show(message) {
        if (this.message) this.message.textContent = message;
        if (this.modal) this.modal.classList.add('show');
    },
    
    hide() {
        if (this.modal) this.modal.classList.remove('show');
    }
};

/* Service Card 3D Tilt Effect */
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});
