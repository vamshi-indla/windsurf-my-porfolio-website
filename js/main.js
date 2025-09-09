// Main navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.mobileMenu = document.querySelector('.nav-links');
        this.sections = document.querySelectorAll('section[id]');
        this.backToTopBtn = document.getElementById('backToTop');
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    init() {
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
        
        // Event listeners
        this.setupEventListeners();
        // Initial setup
        this.handleScroll();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupBackToTop();
        this.setupAccessibility();
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Show/hide navbar on scroll direction
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            this.navbar.classList.add('scrolled-down');
            this.navbar.classList.remove('scrolled-up');
        } else {
            this.navbar.classList.add('scrolled-up');
            this.navbar.classList.remove('scrolled-down');
        }
        
        // Add/remove scrolled class for navbar background
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active section in navigation
        this.updateActiveSection();
        
        // Show/hide back to top button
        if (this.backToTopBtn) {
            if (window.scrollY > 300) {
                this.backToTopBtn.classList.add('show');
            } else {
                this.backToTopBtn.classList.remove('show');
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    updateActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                // Update URL hash without scrolling
                history.replaceState(null, null, `#${sectionId}`);
                
                // Update active nav link
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = this.navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (this.hamburger.getAttribute('aria-expanded') === 'true') {
                        this.toggleMobileMenu();
                    }
                }
            });
        });
    }
    
    setupMobileMenu() {
        if (!this.hamburger) return;
        
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close menu when clicking on a nav link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.hamburger.getAttribute('aria-expanded') === 'true') {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInside = this.navbar.contains(e.target);
            if (!isClickInside && this.hamburger.getAttribute('aria-expanded') === 'true') {
                this.toggleMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        const isExpanded = this.hamburger.getAttribute('aria-expanded') === 'true';
        this.hamburger.setAttribute('aria-expanded', !isExpanded);
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    }
    
    setupBackToTop() {
        if (!this.backToTopBtn) return;
        
        this.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Move focus to the top of the page for keyboard users
            document.querySelector('h1').setAttribute('tabindex', '-1');
            document.querySelector('h1').focus();
        });
    }
    
    setupAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add aria-labels to sections
        this.sections.forEach(section => {
            const heading = section.querySelector('h2, h1');
            if (heading) {
                section.setAttribute('aria-labelledby', heading.id || `${section.id}-heading`);
                if (!heading.id) {
                    heading.id = `${section.id}-heading`;
                }
            }
        });
    }
    
    handleResize() {
        // Close mobile menu if screen is resized to desktop
        if (window.innerWidth > 992 && this.hamburger.getAttribute('aria-expanded') === 'true') {
            this.toggleMobileMenu();
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    const navigation = new Navigation();

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Trigger reflow for animation
                    item.style.animation = 'none';
                    item.offsetHeight; // Trigger reflow
                    item.style.animation = 'fadeInUp 0.6s ease-out forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Testimonial slider
    $('.testimonial-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: false,
        appendDots: $('.testimonial-dots'),
        customPaging: function(slider, i) {
            return '<button class="slick-dot' + (i === slider.currentSlide ? ' active' : '') + '"></button>';
        }
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }

    // Skill bars animation on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.parentElement.previousElementSibling.querySelector('span:last-child').textContent;
            bar.style.width = width;
        });
    }
    
    // Run once on page load
    animateSkillBars();
    
    // Animate skill bars when scrolled into view
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;
    
    function checkIfInView() {
        if (isElementInViewport(skillsSection) && !skillsAnimated) {
            animateSkillBars();
            skillsAnimated = true;
        }
    }
    
    // Check on scroll and resize
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Add animation to elements when they come into view
    const animateOnScroll = document.querySelectorAll('.animate-on-scroll');
    
    function animateOnScrollHandler() {
        animateOnScroll.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('fade-in-up');
            }
        });
    }
    
    // Initial check
    animateOnScrollHandler();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScrollHandler);
    
    // Preloader (optional)
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
    
    // Add smooth scroll to all links with hashes
    document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Add preloader
const preloader = document.createElement('div');
preloader.className = 'preloader';
preloader.setAttribute('aria-live', 'polite');
preloader.setAttribute('aria-label', 'Loading website content');
preloader.innerHTML = `
    <div class="preloader-spinner" role="status">
        <span class="sr-only">Loading...</span>
        <div class="spinner"></div>
    </div>
`;
document.body.prepend(preloader);

// Remove preloader when page is fully loaded
window.addEventListener('load', () => {
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
        // Set focus to main content for screen readers
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
        }
    }, 500);
});
    
// Add styles for the preloader
const style = document.createElement('style');
style.textContent = `
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--white);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }
    
    .preloader-spinner {
        width: 60px;
        height: 60px;
        position: relative;
    }
    
    .spinner {
        width: 100%;
        height: 100%;
        border: 5px solid rgba(30, 58, 138, 0.1);
        border-top: 5px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Skip link styles */
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 12px 16px;
        z-index: 1001;
        transition: transform 0.3s ease;
        border-radius: 0 0 4px 0;
    }
    
    .skip-link:focus {
        transform: translateY(40px);
        outline: 2px solid white;
        outline-offset: 2px;
    }
    
    /* Screen reader only class */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
    
    /* Focus styles */
    :focus-visible {
        outline: 3px solid var(--primary-light);
        outline-offset: 3px;
        border-radius: 3px;
    }
    
    /* Navigation scroll behavior */
    .navbar.scrolled-down {
        transform: translateY(-100%);
    }
    
    .navbar.scrolled-up {
        transform: translateY(0);
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    }
    
    /* Smooth transitions */
    .navbar {
        transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    /* Back to top button */
    .back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    }
    
    .back-to-top.show {
        opacity: 1;
        visibility: visible;
    }
    
    .back-to-top:hover {
        background: var(--primary-dark);
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;
document.head.appendChild(style);

// Add a simple loading animation for images
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '0px 0px 100px 0px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Call lazy loading function when DOM is loaded
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add a simple scroll reveal animation
function revealOnScroll() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add scroll event listener for reveal animation
window.addEventListener('scroll', revealOnScroll);

// Initial check for elements in viewport
revealOnScroll();
