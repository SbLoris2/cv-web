// GSAP Animations System

(function() {
    'use strict';

    // Wait for DOM and GSAP to be ready
    function init() {
        // Register ScrollTrigger plugin if available
        if (typeof gsap !== 'undefined') {
            console.log('GSAP loaded successfully');

            // Initial page load animations
            initPageLoadAnimations();

            // Setup slide animations
            setupSlideAnimations();
        } else {
            console.error('GSAP not loaded');
        }
    }

    // Page load animations - Landing Page
    function initPageLoadAnimations() {
        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' }
        });

        // Animate header elements
        tl.fromTo('.main-header',
            { y: -100, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, ease: 'power4.out' }
        )

        // Animate hero title with split effect
        .fromTo('.content__title',
            { y: 100, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power4.out' },
            '-=0.5'
        )

        // Animate hero subtitle
        .fromTo('.content__subtitle',
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8 },
            '-=0.6'
        )

        // Animate hero description
        .fromTo('.content__description',
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8 },
            '-=0.5'
        )

        // Animate hero stats
        .fromTo('.hero-stats .stat-item',
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.2 },
            '-=0.4'
        )

        // Animate scroll down indicator
        .fromTo('.scroll-down-indicator',
            { y: -20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8 },
            '-=0.3'
        );

        // Pulse animation for theme toggle
        gsap.to('.theme-toggle', {
            scale: 1.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: 2
        });
    }

    // Setup animations for each slide when it becomes active
    function setupSlideAnimations() {
        // Store original goToSlide function
        const originalGoToSlide = window.goToSlide;

        // Override goToSlide to trigger animations
        window.goToSlide = function(index) {
            // Call original function
            if (originalGoToSlide) {
                originalGoToSlide(index);
            }

            // Trigger slide-specific animations
            animateSlideContent(index);
        };
    }

    // Animate content when slide becomes active
    function animateSlideContent(slideIndex) {
        const slides = document.querySelectorAll('.cv-scroll-section .slide');
        if (!slides[slideIndex]) return;

        const slide = slides[slideIndex];
        const slideId = slide.id;

        // Clear previous animations
        gsap.killTweensOf(slide.querySelectorAll('*'));

        // Animation timeline for the slide
        const tl = gsap.timeline({
            defaults: {
                ease: 'power3.out'
            }
        });

        switch(slideId) {
            case 'experience':
                animateExperienceSlide(tl, slide);
                break;

            case 'skills':
                animateSkillsSlide(tl, slide);
                break;

            case 'projects':
                animateProjectsSlide(tl, slide);
                break;

            case 'education':
                animateEducationSlide(tl, slide);
                break;
        }
    }

    // Expose globally
    window.animateSlideContent = animateSlideContent;

    // Experience slide animations
    function animateExperienceSlide(tl, slide) {
        tl.fromTo(slide.querySelector('.section-number'),
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6 }
        )
        .fromTo(slide.querySelector('.section-title'),
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8 },
            '-=0.4'
        )
        .fromTo(slide.querySelector('.section-description'),
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6 },
            '-=0.5'
        )
        .fromTo(slide.querySelectorAll('.experience-card'),
            { y: 60, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.2)' },
            '-=0.3'
        );

        // Add hover animations for experience cards
        slide.querySelectorAll('.experience-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Skills slide animations
    function animateSkillsSlide(tl, slide) {
        tl.fromTo(slide.querySelector('.section-number'),
            { x: -30, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.6 }
        )
        .fromTo(slide.querySelector('.section-title'),
            { x: -40, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.8 },
            '-=0.4'
        )
        .fromTo(slide.querySelector('.section-description'),
            { x: -20, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.6 },
            '-=0.5'
        )
        .fromTo(slide.querySelectorAll('.skill-category'),
            { scale: 0.8, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.5)' },
            '-=0.3'
        )
        .fromTo(slide.querySelectorAll('.skill-tag'),
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.4, stagger: { each: 0.05, from: 'start' }, ease: 'back.out(2)' },
            '-=0.5'
        );

        // Add hover animation for skill tags
        slide.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                gsap.to(tag, {
                    scale: 1.1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
            tag.addEventListener('mouseleave', () => {
                gsap.to(tag, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Projects slide animations
    function animateProjectsSlide(tl, slide) {
        tl.fromTo(slide.querySelector('.section-number'),
            { rotationY: 90, autoAlpha: 0 },
            { rotationY: 0, autoAlpha: 1, duration: 0.8 }
        )
        .fromTo(slide.querySelector('.section-title'),
            { rotationY: 90, autoAlpha: 0 },
            { rotationY: 0, autoAlpha: 1, duration: 0.8 },
            '-=0.6'
        )
        .fromTo(slide.querySelectorAll('.project-card'),
            { x: -100, rotationX: -15, autoAlpha: 0 },
            { x: 0, rotationX: 0, autoAlpha: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
            '-=0.4'
        )
        .fromTo(slide.querySelectorAll('.project-icon'),
            { rotation: -360, scale: 0, autoAlpha: 0 },
            { rotation: 0, scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(2)' },
            '-=1.2'
        );

        // Add hover animation for project cards
        slide.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    x: 10,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(card.querySelector('.project-icon'), {
                    rotation: 360,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(card.querySelector('.project-icon'), {
                    rotation: 0,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                });
            });
        });
    }

    // Education slide animations
    function animateEducationSlide(tl, slide) {
        tl.fromTo(slide.querySelector('.section-number'),
            { opacity: 0, scale: 0, visibility: 'hidden' },
            { opacity: 1, scale: 1, visibility: 'visible', duration: 0.6, ease: 'back.out(2)' }
        )
        .fromTo(slide.querySelector('.section-title'),
            { opacity: 0, scale: 0.5, visibility: 'hidden' },
            { opacity: 1, scale: 1, visibility: 'visible', duration: 0.8, ease: 'back.out(1.7)' },
            '-=0.3'
        )
        .fromTo(slide.querySelectorAll('.education-card'),
            { opacity: 0, y: 80, rotation: 5, visibility: 'hidden' },
            { opacity: 1, y: 0, rotation: 0, visibility: 'visible', duration: 0.8, stagger: 0.15, ease: 'power3.out' },
            '-=0.4'
        )
        .fromTo(slide.querySelector('footer'),
            { opacity: 0, y: 30, visibility: 'hidden' },
            { opacity: 1, y: 0, visibility: 'visible', duration: 0.8 },
            '-=0.2'
        );

        // Add hover animation for education cards
        slide.querySelectorAll('.education-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Animate navigation links on hover
    function setupNavAnimations() {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    x: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Logo animation
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                gsap.to(logo, {
                    rotation: 360,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                });
            });
            logo.addEventListener('mouseleave', () => {
                gsap.to(logo, {
                    rotation: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                });
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupNavAnimations();
        });
    } else {
        init();
        setupNavAnimations();
    }

})();
