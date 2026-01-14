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
        tl.from('.main-header', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        })

        // Animate hero title with split effect
        .from('.content__title', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
        }, '-=0.5')

        // Animate hero subtitle
        .from('.content__subtitle', {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, '-=0.6')

        // Animate hero description
        .from('.content__description', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, '-=0.5')

        // Animate hero stats
        .from('.hero-stats .stat-item', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2
        }, '-=0.4')

        // Animate scroll down indicator
        .from('.scroll-down-indicator', {
            opacity: 0,
            y: -20,
            duration: 0.8
        }, '-=0.3');

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
                ease: 'power3.out',
                clearProps: 'all'
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
        tl.from(slide.querySelector('.section-number'), {
            opacity: 0,
            y: 30,
            duration: 0.6
        })
        .from(slide.querySelector('.section-title'), {
            opacity: 0,
            y: 40,
            duration: 0.8
        }, '-=0.4')
        .from(slide.querySelector('.section-description'), {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, '-=0.5')
        .from(slide.querySelectorAll('.experience-card'), {
            opacity: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.2)'
        }, '-=0.3');

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
        tl.from(slide.querySelector('.section-number'), {
            opacity: 0,
            x: -30,
            duration: 0.6
        })
        .from(slide.querySelector('.section-title'), {
            opacity: 0,
            x: -40,
            duration: 0.8
        }, '-=0.4')
        .from(slide.querySelector('.section-description'), {
            opacity: 0,
            x: -20,
            duration: 0.6
        }, '-=0.5')
        .from(slide.querySelectorAll('.skill-category'), {
            opacity: 0,
            scale: 0.8,
            duration: 0.7,
            stagger: 0.15,
            ease: 'back.out(1.5)'
        }, '-=0.3')
        .from(slide.querySelectorAll('.skill-tag'), {
            opacity: 0,
            scale: 0,
            duration: 0.4,
            stagger: {
                each: 0.05,
                from: 'start'
            },
            ease: 'back.out(2)'
        }, '-=0.5');

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
        tl.from(slide.querySelector('.section-number'), {
            opacity: 0,
            rotationY: 90,
            duration: 0.8
        })
        .from(slide.querySelector('.section-title'), {
            opacity: 0,
            rotationY: 90,
            duration: 0.8
        }, '-=0.6')
        .from(slide.querySelectorAll('.project-card'), {
            opacity: 0,
            x: -100,
            rotationX: -15,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        }, '-=0.4')
        .from(slide.querySelectorAll('.project-icon'), {
            rotation: -360,
            scale: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'back.out(2)'
        }, '-=1.2');

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
        tl.from(slide.querySelector('.section-number'), {
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: 'back.out(2)'
        })
        .from(slide.querySelector('.section-title'), {
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, '-=0.3')
        .from(slide.querySelectorAll('.education-card'), {
            opacity: 0,
            y: 80,
            rotation: 5,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }, '-=0.4')
        .from(slide.querySelector('footer'), {
            opacity: 0,
            y: 30,
            duration: 0.8
        }, '-=0.2');

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
