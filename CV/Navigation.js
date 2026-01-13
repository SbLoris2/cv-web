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
    
    let currentSlide = 0;
    let isScrolling = false;
    let touchStartX = 0;
    let touchEndX = 0;

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
        
        // Navigation clicks
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
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
    }

    // Navigate to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= slides.length || index === currentSlide || isScrolling) {
            return;
        }

        isScrolling = true;
        currentSlide = index;
        
        const translateX = -currentSlide * 100;
        slidesContainer.style.transform = `translateX(${translateX}vw)`;
        
        updateSlideIndicator();
        updateActiveNav();
        updateScrollArrow();
        updateSceneScroll();
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

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
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
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

    // Start on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();