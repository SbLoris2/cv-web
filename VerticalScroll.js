// Vertical Scroll Management

(function() {
    'use strict';

    const landingPage = document.getElementById('landingPage');
    const cvScrollSection = document.getElementById('cv-scroll');
    const cvLink = document.getElementById('cvLink');
    const scrollDownIndicator = document.querySelector('.scroll-down-indicator');

    let isLandingPage = true;
    let isScrolling = false;

    // Update header navigation state
    function updateHeaderNav() {
        const heroLink = document.querySelector('a[href="#hero"]');
        const cvLink = document.querySelector('a[href="#cv-scroll"]');

        if (heroLink && cvLink) {
            if (isLandingPage) {
                heroLink.classList.add('active');
                cvLink.classList.remove('active');
            } else {
                heroLink.classList.remove('active');
                cvLink.classList.add('active');
            }
        }
    }

    // Smooth scroll to CV section
    function scrollToCVSection() {
        if (isScrolling) return;
        isScrolling = true;
        isLandingPage = false;

        // Hide warp canvas, show CV canvas
        const warpCanvas = document.getElementById('warpScene');
        const cvCanvas = document.getElementById('scene');

        if (warpCanvas) {
            gsap.to(warpCanvas, {
                opacity: 0,
                duration: 0.6,
                onComplete: function() {
                    warpCanvas.style.display = 'none';
                }
            });
        }

        if (cvCanvas) {
            cvCanvas.style.display = 'block';
            gsap.fromTo(cvCanvas,
                { opacity: 0 },
                { opacity: 0.7, duration: 0.6, delay: 0.3 }
            );
        }

        // Hide landing page content with smooth transition
        const landingContent = landingPage.querySelector('.warp-hero');
        const scrollIndicator = landingPage.querySelector('.scroll-down-indicator');

        // Animate content out with stagger
        gsap.to(landingContent, {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.in'
        });

        gsap.to(scrollIndicator, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.in'
        });

        // Fade out landing page
        gsap.to(landingPage, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            delay: 0.4,
            onComplete: function() {
                landingPage.style.display = 'none';
                landingPage.style.pointerEvents = 'none';
            }
        });

        // Show CV section
        cvScrollSection.style.display = 'block';
        cvScrollSection.style.pointerEvents = 'auto';

        // Enable horizontal scroll navigation
        if (window.enableHorizontalScroll) {
            window.enableHorizontalScroll();
        }

        // Always reset to first slide BEFORE showing
        const slidesContainer = document.getElementById('slidesContainer');
        if (slidesContainer) {
            slidesContainer.style.transition = 'none';
            slidesContainer.style.transform = 'translateX(0vw)';

            // Force update currentSlide globally
            window.currentSlide = 0;

            // Update indicators
            const currentSlideIndicator = document.querySelector('.current-slide');
            if (currentSlideIndicator) {
                currentSlideIndicator.textContent = '01';
            }

            // Update navigation active state
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach((link, index) => {
                if (index === 0) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Re-enable transition after reset
            setTimeout(() => {
                slidesContainer.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 50);
        }

        gsap.fromTo(cvScrollSection,
            { opacity: 0, scale: 0.95 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.6,
                onComplete: function() {
                    isScrolling = false;
                    updateHeaderNav();

                    // Trigger first slide animation
                    if (window.animateSlideContent) {
                        window.animateSlideContent(0);
                    }
                }
            }
        );
    }

    // Scroll back to landing page
    function scrollToLanding() {
        if (isScrolling) return;
        isScrolling = true;
        isLandingPage = true;

        // Disable horizontal scroll navigation
        if (window.disableHorizontalScroll) {
            window.disableHorizontalScroll();
        }

        // Hide CV canvas, show warp canvas
        const warpCanvas = document.getElementById('warpScene');
        const cvCanvas = document.getElementById('scene');

        if (cvCanvas) {
            gsap.to(cvCanvas, {
                opacity: 0,
                duration: 0.6,
                onComplete: function() {
                    cvCanvas.style.display = 'none';
                }
            });
        }

        if (warpCanvas) {
            warpCanvas.style.display = 'block';
            gsap.fromTo(warpCanvas,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, delay: 0.3 }
            );
        }

        // Hide CV section
        gsap.to(cvScrollSection, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: function() {
                cvScrollSection.style.display = 'none';
                cvScrollSection.style.pointerEvents = 'none';
            }
        });

        // Show landing page
        landingPage.style.display = 'block';

        gsap.fromTo(landingPage,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.inOut',
                delay: 0.3,
                onComplete: function() {
                    landingPage.style.pointerEvents = 'auto';

                    // Show landing content - reset position first
                    const landingContent = landingPage.querySelector('.warp-hero');
                    const scrollIndicator = landingPage.querySelector('.scroll-down-indicator');

                    if (landingContent) {
                        gsap.set(landingContent, { y: 0 });
                        gsap.to(landingContent, {
                            opacity: 1,
                            duration: 0.6,
                            ease: 'power2.inOut'
                        });
                    }

                    if (scrollIndicator) {
                        gsap.set(scrollIndicator, { y: 0 });
                        gsap.to(scrollIndicator, {
                            opacity: 1,
                            duration: 0.6,
                            ease: 'power2.inOut'
                        });
                    }

                    isScrolling = false;
                    updateHeaderNav();
                }
            }
        );
    }

    // Handle wheel scroll on landing page
    function handleWheelScroll(e) {
        if (isScrolling) return;

        // Only handle vertical scroll down from landing page
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (isLandingPage && e.deltaY > 0) {
                // Scrolling down from landing page
                e.preventDefault();
                scrollToCVSection();
            }
        }
    }

    // Click handlers
    const heroLink = document.querySelector('a[href="#hero"]');

    if (heroLink) {
        heroLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isLandingPage) {
                scrollToLanding();
            }
        });
    }

    if (cvLink) {
        cvLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (isLandingPage) {
                scrollToCVSection();
            }
        });
    }

    if (scrollDownIndicator) {
        scrollDownIndicator.addEventListener('click', function() {
            scrollToCVSection();
        });
    }

    // Return home button handler
    const returnHomeBtn = document.getElementById('returnHomeBtn');
    if (returnHomeBtn) {
        returnHomeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            scrollToLanding();
        });
    }

    // Add wheel event listener
    window.addEventListener('wheel', handleWheelScroll, { passive: false });

    // Initial state
    cvScrollSection.style.display = 'none';
    cvScrollSection.style.opacity = 0;
    cvScrollSection.style.pointerEvents = 'none';

    // Hide CV canvas initially
    const cvCanvas = document.getElementById('scene');
    if (cvCanvas) {
        cvCanvas.style.display = 'none';
        cvCanvas.style.opacity = 0;
    }

    // Expose functions globally
    window.scrollToCVSection = scrollToCVSection;
    window.scrollToLanding = scrollToLanding;

    // Initialize header nav state
    updateHeaderNav();

})();
