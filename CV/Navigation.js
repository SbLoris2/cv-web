// Horizontal Navigation System

(function() {
    'use strict';

    // Configuration
    const slidesContainer = document.getElementById('slidesContainer');
    const slides = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentSlideIndicator = document.querySelector('.current-slide');
    const totalSlidesIndicator = document.querySelector('.total-slides');
    const scrollArrow = document.getElementById('scrollArrow');
    
    // Mobile menu elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    let currentSlide = 0;
    let isScrolling = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let isMobileMenuOpen = false;
    let horizontalScrollEnabled = false; // Start disabled

    // Expose currentSlide globally
    window.currentSlide = currentSlide;

    // Initialize
    function init() {
        totalSlidesIndicator.textContent = String(slides.length).padStart(2, '0');
        updateSlideIndicator();
        updateActiveNav();
        updateScrollArrow();
        updateSceneScroll();
        
        // Event listeners
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Navigation clicks - only for links with data-slide attribute
        navLinks.forEach(link => {
            if (link.hasAttribute('data-slide')) {
                link.addEventListener('click', handleNavClick);
            }
        });
        
        // Contact button with data-slide
        const slideButtons = document.querySelectorAll('[data-slide]');
        slideButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const slideIndex = parseInt(button.getAttribute('data-slide'));
                goToSlide(slideIndex);
            });
        });

        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Mobile menu overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }

        // Close mobile menu on window resize if open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
        
        if (isMobileMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        mobileNav.classList.add('active');
        mobileMenuToggle.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        isMobileMenuOpen = false;
    }

    // Navigate to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= slides.length || index === currentSlide || isScrolling) {
            return;
        }

        isScrolling = true;
        currentSlide = index;
        window.currentSlide = currentSlide; // Update global reference

        const translateX = -currentSlide * 100;
        slidesContainer.style.transform = `translateX(${translateX}vw)`;

        updateSlideIndicator();
        updateActiveNav();
        updateScrollArrow();
        updateSceneScroll();

        // Close mobile menu if open
        if (isMobileMenuOpen) {
            closeMobileMenu();
        }

        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

    // Expose goToSlide globally for animations
    window.goToSlide = goToSlide;

    // Update scene scroll progress
    function updateSceneScroll() {
        if (window.updateSceneScroll) {
            const progress = currentSlide / (slides.length - 1);
            window.updateSceneScroll(progress);
        }
    }

    // Update scroll arrow visibility
    function updateScrollArrow() {
        if (scrollArrow) {
            if (currentSlide === 0) {
                scrollArrow.classList.remove('hidden');
            } else {
                scrollArrow.classList.add('hidden');
            }
        }
    }

    // Handle mouse wheel
    function handleWheel(e) {
        if (!horizontalScrollEnabled) return; // Only handle when enabled

        e.preventDefault();

        if (isScrolling) return;

        const delta = Math.sign(e.deltaY || e.deltaX);

        if (delta > 0) {
            // Scroll right
            goToSlide(currentSlide + 1);
        } else if (delta < 0) {
            // Scroll left
            goToSlide(currentSlide - 1);
        }
    }

    // Handle keyboard navigation
    function handleKeydown(e) {
        if (isScrolling) return;
        
        // Don't navigate if mobile menu is open
        if (isMobileMenuOpen && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            return;
        }

        // Close mobile menu on Escape
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
            return;
        }
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                goToSlide(currentSlide + 1);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                goToSlide(currentSlide - 1);
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(slides.length - 1);
                break;
        }
    }

    // Handle touch events
    function handleTouchStart(e) {
        // Don't handle touch if it's on the mobile menu
        if (e.target.closest('nav') || e.target.closest('.mobile-menu-toggle')) {
            return;
        }
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        // Don't handle touch if it's on the mobile menu
        if (e.target.closest('nav') || e.target.closest('.mobile-menu-toggle')) {
            return;
        }
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        if (isScrolling) return;
        
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - go to next slide
                goToSlide(currentSlide + 1);
            } else {
                // Swipe right - go to previous slide
                goToSlide(currentSlide - 1);
            }
        }
    }

    // Handle navigation link clicks
    function handleNavClick(e) {
        e.preventDefault();
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        goToSlide(slideIndex);
    }

    // Update slide indicator
    function updateSlideIndicator() {
        currentSlideIndicator.textContent = String(currentSlide + 1).padStart(2, '0');
    }

    // Update active navigation link
    function updateActiveNav() {
        navLinks.forEach((link, index) => {
            if (index === currentSlide) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Enable/Disable horizontal scroll functions
    window.enableHorizontalScroll = function() {
        horizontalScrollEnabled = true;
    };

    window.disableHorizontalScroll = function() {
        horizontalScrollEnabled = false;
    };

    // Start on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();