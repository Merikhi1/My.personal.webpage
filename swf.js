// ====================================
// Modern JavaScript Enhancement
// ====================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLoader();
    initNavigation();
    initTheme();
    initAnimations();
    initSmoothScroll();
    initContactForm();
    initBackToTop();
    initParallax();
});

// ====================================
// Loading Screen
// ====================================
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hide');
            document.body.style.overflow = 'visible';
            
            // Trigger AOS animations after loader
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    easing: 'ease-out',
                    once: true,
                    offset: 100
                });
            }
        }, 500);
    });
}

// ====================================
// Navigation
// ====================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'visible';
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'visible';
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveLink);
}

// ====================================
// Theme Toggle
// ====================================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Check system preference
    if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    });
    
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ====================================
// Smooth Scrolling
// ====================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ====================================
// Contact Form
// ====================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('error'));
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        let isValid = true;
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            showError(form.querySelector('[name="name"]'), 'Please enter a valid name');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showError(form.querySelector('[name="email"]'), 'Please enter a valid email address');
            isValid = false;
        }
        
        // Subject validation
        if (!data.subject || data.subject.trim().length < 3) {
            showError(form.querySelector('[name="subject"]'), 'Please enter a subject');
            isValid = false;
        }
        
        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            showError(form.querySelector('[name="message"]'), 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        try {
            // In a real application, you would send the data to a server
            await simulateFormSubmission(data);
            
            // Show success message
            showSuccessMessage();
            form.reset();
        } catch (error) {
            showErrorMessage();
        } finally {
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        }
    });
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
    }
    
    function simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 2000);
        });
    }
    
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Thank you for your message! I'll get back to you soon.</p>
        `;
        
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    function showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>Oops! Something went wrong. Please try again later.</p>
        `;
        
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// ====================================
// Back to Top Button
// ====================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ====================================
// Parallax Effect
// ====================================
function initParallax() {
    const heroPattern = document.querySelector('.hero-pattern');
    
    if (!heroPattern) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        heroPattern.style.transform = `translateY(${rate}px)`;
    });
}

// ====================================
// Animations
// ====================================
function initAnimations() {
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.visibility = 'visible';
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing after loader hides
        setTimeout(typeWriter, 1000);
    }
    
    // Animate numbers on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                if (target.classList.contains('pdf-meta')) {
                    animateNumbers(target);
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.pdf-meta').forEach(el => {
        observer.observe(el);
    });
}

function animateNumbers(element) {
    const spans = element.querySelectorAll('span');
    
    spans.forEach(span => {
        const text = span.textContent;
        const match = text.match(/\d+/);
        
        if (match) {
            const number = parseInt(match[0]);
            const duration = 2000;
            const start = 0;
            const increment = number / (duration / 16);
            
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                span.textContent = text.replace(/\d+/, Math.floor(current).toLocaleString());
            }, 16);
        }
    });
}

// ====================================
// Form Message Styles (Dynamic CSS)
// ====================================
const formMessageStyles = `
    .form-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 2rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10;
        animation: fadeIn 0.3s ease;
    }
    
    .form-message i {
        font-size: 2rem;
    }
    
    .form-message.success i {
        color: #10b981;
    }
    
    .form-message.error i {
        color: #ef4444;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;

// Add dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = formMessageStyles;
document.head.appendChild(styleSheet);

// ====================================
// Legacy showSection function (kept for compatibility)
// ====================================
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Smooth scroll to section
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ====================================
// Performance Optimization
// ====================================
// Debounce function for scroll events
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

// Optimize scroll event listeners
const optimizedScroll = debounce(() => {
    // Scroll-based functions will be called here
}, 10);

window.addEventListener('scroll', optimizedScroll, { passive: true });

// ====================================
// Progressive Enhancement
// ====================================
// Check for browser support
if ('IntersectionObserver' in window) {
    // Modern browser features
    console.log('Modern browser detected - all features enabled');
} else {
    // Fallback for older browsers
    console.log('Legacy browser detected - using fallbacks');
}