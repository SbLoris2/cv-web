// Simplified Navigation System
// Vertical scroll: Landing → CV Section
// Horizontal scroll: Within CV slides

(function() {
    'use strict';

    // Elements
    const landingPage = document.getElementById('landingPage');
    const cvSection = document.getElementById('cv-scroll');
    const contactSection = document.getElementById('contact-section');
    const slidesContainer = document.getElementById('slidesContainer');
    const slides = document.querySelectorAll('.slide');
    const scrollDownIndicator = document.querySelector('.scroll-down-indicator');
    const scrollDownContactIndicator = document.querySelector('.scroll-down-contact-indicator');
    const scrollArrow = document.getElementById('scrollArrow');

    // Header navigation (select ALL links to hero, not just the first one)
    const heroLinks = document.querySelectorAll('a[href="#hero"]');
    const cvLink = document.querySelector('a[href="#cv-scroll"]');
    const contactLink = document.querySelector('a[href="#contact-section"]');

    // Indicators
    const currentSlideIndicator = document.querySelector('.current-slide');
    const totalSlidesIndicator = document.querySelector('.total-slides');

    // Mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    // State
    let currentSection = 'landing'; // 'landing', 'cv', or 'contact'
    let currentSlide = 0;
    let isScrolling = false;
    let isMobileMenuOpen = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Initialize
    function init() {
        if (totalSlidesIndicator) {
            totalSlidesIndicator.textContent = String(slides.length).padStart(2, '0');
        }
        updateHeaderNav();
        updateSlideIndicator();
        updateScrollArrow();

        // Event listeners
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Header navigation - attach to ALL hero links (logo + menu link)
        heroLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                goToLanding();
            });
        });

        if (cvLink) {
            cvLink.addEventListener('click', (e) => {
                e.preventDefault();
                goToCVSection();
            });
        }

        if (contactLink) {
            contactLink.addEventListener('click', (e) => {
                e.preventDefault();
                goToContactSection();
            });
        }

        // Scroll down indicator
        if (scrollDownIndicator) {
            scrollDownIndicator.addEventListener('click', goToCVSection);
        }

        // Scroll down to contact indicator
        if (scrollDownContactIndicator) {
            scrollDownContactIndicator.addEventListener('click', goToContactSection);
        }

        // Mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }

        // Close mobile menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });

        // Initial state - show landing page only
        cvSection.style.display = 'none';
        cvSection.style.opacity = 0;
        document.getElementById('scene').style.display = 'none';

        // Hide contact section initially
        if (contactSection) {
            contactSection.classList.remove('active');
            contactSection.style.pointerEvents = 'none';
        }
    }

    // Update header navigation active state
    function updateHeaderNav() {
        if (heroLinks && cvLink && contactLink) {
            if (currentSection === 'landing') {
                heroLinks.forEach(link => link.classList.add('active'));
                cvLink.classList.remove('active');
                contactLink.classList.remove('active');
            } else if (currentSection === 'cv') {
                heroLinks.forEach(link => link.classList.remove('active'));
                cvLink.classList.add('active');
                contactLink.classList.remove('active');
            } else if (currentSection === 'contact') {
                heroLinks.forEach(link => link.classList.remove('active'));
                cvLink.classList.remove('active');
                contactLink.classList.add('active');
            }
        }
    }

    // Update slide indicator
    function updateSlideIndicator() {
        if (currentSlideIndicator) {
            currentSlideIndicator.textContent = String(currentSlide + 1).padStart(2, '0');
        }
    }

    // Update scroll down to contact indicator visibility
    function updateContactIndicator() {
        if (scrollDownContactIndicator) {
            // Show only when on last slide (Education) of CV section
            if (currentSection === 'cv' && currentSlide === slides.length - 1) {
                scrollDownContactIndicator.classList.add('visible');
            } else {
                scrollDownContactIndicator.classList.remove('visible');
            }
        }
    }

    // Update scroll arrow visibility
    function updateScrollArrow() {
        if (scrollArrow) {
            if (currentSection === 'cv' && currentSlide === 0) {
                scrollArrow.classList.remove('hidden');
            } else {
                scrollArrow.classList.add('hidden');
            }
        }
    }

    // Go to landing page
    function goToLanding() {
        if (currentSection === 'landing' || isScrolling) return;

        isScrolling = true;
        const previousSection = currentSection;
        currentSection = 'landing';

        // Hide Contact section with animation
        if (previousSection === 'contact') {
            gsap.to(contactSection, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => {
                    contactSection.classList.remove('active');
                    contactSection.style.pointerEvents = 'none';
                }
            });
        }

        // Hide CV canvas
        const cvCanvas = document.getElementById('scene');
        const warpCanvas = document.getElementById('warpScene');

        if (cvCanvas) {
            gsap.to(cvCanvas, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => cvCanvas.style.display = 'none'
            });
        }

        // Show warp canvas
        if (warpCanvas) {
            warpCanvas.style.display = 'block';
            gsap.fromTo(warpCanvas,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, delay: 0.3 }
            );
        }

        // Hide CV section
        gsap.to(cvSection, {
            opacity: 0,
            duration: 0.6,
            onComplete: () => {
                cvSection.style.display = 'none';
                cvSection.style.pointerEvents = 'none';
            }
        });

        // Show landing page
        landingPage.style.display = 'block';
        landingPage.style.pointerEvents = 'auto';

        gsap.fromTo(landingPage,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.6,
                delay: 0.3,
                onComplete: () => {
                    // Restore landing content
                    const landingContent = landingPage.querySelector('.warp-hero');
                    const scrollIndicator = landingPage.querySelector('.scroll-down-indicator');

                    if (landingContent) {
                        gsap.set(landingContent, { y: 0 });
                        gsap.to(landingContent, {
                            opacity: 1,
                            duration: 0.6
                        });
                    }

                    if (scrollIndicator) {
                        gsap.set(scrollIndicator, { y: 0 });
                        gsap.to(scrollIndicator, {
                            opacity: 1,
                            duration: 0.6
                        });
                    }

                    isScrolling = false;
                    updateHeaderNav();
                    updateScrollArrow();
                }
            }
        );
    }

    // Go to CV section
    function goToCVSection() {
        if (currentSection === 'cv' || isScrolling) return;

        isScrolling = true;
        const previousSection = currentSection;
        currentSection = 'cv';

        // Hide Contact section with animation
        if (previousSection === 'contact') {
            gsap.to(contactSection, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => {
                    contactSection.classList.remove('active');
                    contactSection.style.pointerEvents = 'none';
                }
            });
        }

        // Hide warp canvas
        const warpCanvas = document.getElementById('warpScene');
        const cvCanvas = document.getElementById('scene');

        if (warpCanvas) {
            gsap.to(warpCanvas, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => warpCanvas.style.display = 'none'
            });
        }

        // Show CV canvas
        if (cvCanvas) {
            cvCanvas.style.display = 'block';
            gsap.fromTo(cvCanvas,
                { opacity: 0 },
                { opacity: 0.7, duration: 0.6, delay: 0.3 }
            );
        }

        // Hide landing page content
        const landingContent = landingPage.querySelector('.warp-hero');
        const scrollIndicator = landingPage.querySelector('.scroll-down-indicator');

        gsap.to(landingContent, {
            y: -50,
            opacity: 0,
            duration: 0.8
        });

        gsap.to(scrollIndicator, {
            y: 50,
            opacity: 0,
            duration: 0.6
        });

        // Hide landing page
        gsap.to(landingPage, {
            opacity: 0,
            duration: 0.8,
            delay: 0.4,
            onComplete: () => {
                landingPage.style.display = 'none';
                landingPage.style.pointerEvents = 'none';
            }
        });

        // Set slide position based on previous section
        // If coming from Contact, go to last slide (Education), otherwise go to first slide
        if (previousSection === 'contact') {
            currentSlide = slides.length - 1; // Last slide (Education)
        } else {
            currentSlide = 0; // First slide
        }

        const translateX = -currentSlide * 100;
        slidesContainer.style.transition = 'none';
        slidesContainer.style.transform = `translateX(${translateX}vw)`;

        setTimeout(() => {
            slidesContainer.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 50);

        // Show CV section
        cvSection.style.display = 'block';
        cvSection.style.pointerEvents = 'auto';

        gsap.fromTo(cvSection,
            { opacity: 0, scale: 0.95 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: 0.6,
                onComplete: () => {
                    isScrolling = false;
                    updateHeaderNav();
                    updateSlideIndicator();
                    updateScrollArrow();

                    // Trigger first slide animation
                    if (window.animateSlideContent) {
                        window.animateSlideContent(0);
                    }

                    // Update scene scroll
                    if (window.updateSceneScroll) {
                        window.updateSceneScroll(0);
                    }
                }
            }
        );
    }

    // Go to Contact section
    function goToContactSection() {
        if (currentSection === 'contact' || isScrolling) return;

        isScrolling = true;
        const previousSection = currentSection;
        currentSection = 'contact';

        // Hide warp canvas (Landing)
        const warpCanvas = document.getElementById('warpScene');
        if (warpCanvas && previousSection === 'landing') {
            gsap.to(warpCanvas, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => warpCanvas.style.display = 'none'
            });
        }

        // Hide CV canvas with animation
        const cvCanvas = document.getElementById('scene');
        if (cvCanvas && previousSection === 'cv') {
            gsap.to(cvCanvas, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => cvCanvas.style.display = 'none'
            });
        }

        // Hide Landing page with animation
        if (previousSection === 'landing') {
            const landingContent = landingPage.querySelector('.warp-hero');
            const scrollIndicator = landingPage.querySelector('.scroll-down-indicator');

            gsap.to(landingContent, {
                y: -50,
                opacity: 0,
                duration: 0.8
            });

            gsap.to(scrollIndicator, {
                y: 50,
                opacity: 0,
                duration: 0.6
            });

            gsap.to(landingPage, {
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                onComplete: () => {
                    landingPage.style.display = 'none';
                    landingPage.style.pointerEvents = 'none';
                }
            });
        }

        // Hide CV section with animation
        if (previousSection === 'cv') {
            gsap.to(cvSection, {
                y: -50,
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    cvSection.style.display = 'none';
                    cvSection.style.pointerEvents = 'none';
                }
            });
        }

        // Show contact section with animation
        contactSection.classList.add('active');
        contactSection.style.pointerEvents = 'auto';

        gsap.fromTo(contactSection,
            { opacity: 0, scale: 0.95 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: 0.6,
                onComplete: () => {
                    isScrolling = false;
                    updateHeaderNav();
                    updateContactIndicator();

                    // Initialize Three.js scene if not already done
                    if (window.initContactScene && !window.contactSceneInitialized) {
                        window.initContactScene();
                        window.contactSceneInitialized = true;
                    }

                    // Trigger contact animation
                    if (window.animateContactPage) {
                        window.animateContactPage();
                    }
                }
            }
        );
    }

    // Navigate to specific slide within CV
    function goToSlide(index) {
        if (currentSection !== 'cv') return;
        if (index < 0 || index >= slides.length || index === currentSlide || isScrolling) return;

        isScrolling = true;
        currentSlide = index;

        const translateX = -currentSlide * 100;
        slidesContainer.style.transform = `translateX(${translateX}vw)`;

        updateSlideIndicator();
        updateScrollArrow();
        updateContactIndicator();

        // Update scene scroll progress
        if (window.updateSceneScroll) {
            const progress = currentSlide / (slides.length - 1);
            window.updateSceneScroll(progress);
        }

        // Close mobile menu if open
        if (isMobileMenuOpen) {
            closeMobileMenu();
        }

        setTimeout(() => {
            isScrolling = false;

            // Trigger slide animation
            if (window.animateSlideContent) {
                window.animateSlideContent(currentSlide);
            }
        }, 800);
    }

    // Handle wheel scroll
    function handleWheel(e) {
        if (isScrolling) return;

        const deltaY = e.deltaY;
        const deltaX = e.deltaX;

        // If we're on landing page, only handle vertical scroll down
        if (currentSection === 'landing') {
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
                e.preventDefault();
                goToCVSection();
            }
        }
        // If we're in CV section, handle horizontal scroll and vertical to Contact
        else if (currentSection === 'cv') {
            e.preventDefault();

            // If on last slide and scrolling down/right, go to Contact
            if (currentSlide === slides.length - 1 && (deltaY > 0 || deltaX > 0)) {
                goToContactSection();
                return;
            }

            // If on first slide and scrolling up/left, go to Landing
            if (currentSlide === 0 && (deltaY < 0 || deltaX < 0)) {
                goToLanding();
                return;
            }

            const delta = Math.sign(deltaY || deltaX);

            if (delta > 0) {
                goToSlide(currentSlide + 1);
            } else if (delta < 0) {
                goToSlide(currentSlide - 1);
            }
        }
        // If we're in Contact section, handle vertical scroll up to go back to CV
        else if (currentSection === 'contact') {
            if (deltaY < 0) {
                e.preventDefault();
                // Go back to last slide of CV
                currentSlide = slides.length - 1;
                goToCVSection();
            }
        }
    }

    // Handle keyboard navigation
    function handleKeydown(e) {
        if (isScrolling || isMobileMenuOpen) return;

        if (currentSection === 'cv') {
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

        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }

    // Touch handlers
    function handleTouchStart(e) {
        if (e.target.closest('nav') || e.target.closest('.mobile-menu-toggle')) return;

        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        if (e.target.closest('nav') || e.target.closest('.mobile-menu-toggle')) return;

        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }

    function handleSwipe() {
        if (isScrolling) return;

        const threshold = 50;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Determine if swipe is more horizontal or vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe - only in CV section
            if (currentSection === 'cv' && Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
            }
        } else {
            // Vertical swipe - landing to CV
            if (currentSection === 'landing' && Math.abs(diffY) > threshold && diffY > 0) {
                goToCVSection();
            }
        }
    }

    // Mobile menu
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;

        if (isMobileMenuOpen) {
            mobileNav.classList.add('active');
            mobileMenuToggle.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            closeMobileMenu();
        }
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        isMobileMenuOpen = false;
    }

    // Start on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
