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
        // Check if landing animation already played
        if (sessionStorage.getItem('animation_landing_played')) {
            // Animation already played, just show elements immediately
            gsap.set(['.main-header', '.content__title', '.content__subtitle', '.content__description', '.hero-stats .stat-item', '.scroll-down-indicator'], {
                autoAlpha: 1,
                clearProps: 'transform'
            });

            // Still run the pulse animation
            gsap.to('.theme-toggle', {
                scale: 1.05,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });
            return;
        }

        // Set initial positions
        gsap.set('.main-header', { y: -100 });
        gsap.set('.content__title', { y: 100 });
        gsap.set('.content__subtitle', { y: 50 });
        gsap.set('.content__description', { y: 30 });
        gsap.set('.hero-stats .stat-item', { y: 30 });
        gsap.set('.scroll-down-indicator', { y: -20 });

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
                sessionStorage.setItem('animation_landing_played', 'true');
            }
        });

        // Animate to final state
        tl.to('.main-header', {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: 'power4.out'
        })
        .to('.content__title', {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'power4.out'
        }, '-=0.5')
        .to('.content__subtitle', {
            y: 0,
            autoAlpha: 1,
            duration: 0.8
        }, '-=0.6')
        .to('.content__description', {
            y: 0,
            autoAlpha: 1,
            duration: 0.8
        }, '-=0.5')
        .to('.hero-stats .stat-item', {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.2
        }, '-=0.4')
        .to('.scroll-down-indicator', {
            y: 0,
            autoAlpha: 1,
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

        // Check if animation already played for this slide
        const animationKey = `animation_${slideId}_played`;

        if (sessionStorage.getItem(animationKey)) {
            // Animation already played, just show elements immediately
            const elements = slide.querySelectorAll('.section-number, .section-title, .section-description, .experience-card, .skill-category, .skill-tag, .project-card, .project-icon, .education-card, footer');
            gsap.set(elements, {
                autoAlpha: 1,
                clearProps: 'transform'
            });
            return;
        }

        // Get all animated elements in this slide
        const elements = slide.querySelectorAll('.section-number, .section-title, .section-description, .experience-card, .skill-category, .skill-tag, .project-card, .project-icon, .education-card, footer');

        // Clear previous animations
        gsap.killTweensOf(elements);

        // Reset elements to hidden state before animating
        gsap.set(elements, { autoAlpha: 0 });

        // Animation timeline for the slide
        const tl = gsap.timeline({
            defaults: {
                ease: 'power3.out'
            },
            onComplete: () => {
                // Mark animation as played
                sessionStorage.setItem(animationKey, 'true');
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
        // Set initial positions
        gsap.set(slide.querySelector('.section-number'), { y: 30 });
        gsap.set(slide.querySelector('.section-title'), { y: 40 });
        gsap.set(slide.querySelector('.section-description'), { y: 20 });
        gsap.set(slide.querySelectorAll('.experience-card'), { y: 60 });

        // Animate to final state
        tl.to(slide.querySelector('.section-number'), {
            y: 0,
            autoAlpha: 1,
            duration: 0.6
        })
        .to(slide.querySelector('.section-title'), {
            y: 0,
            autoAlpha: 1,
            duration: 0.8
        }, '-=0.4')
        .to(slide.querySelector('.section-description'), {
            y: 0,
            autoAlpha: 1,
            duration: 0.6
        }, '-=0.5')
        .to(slide.querySelectorAll('.experience-card'), {
            y: 0,
            autoAlpha: 1,
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
        // Set initial positions
        gsap.set(slide.querySelector('.section-number'), { x: -30 });
        gsap.set(slide.querySelector('.section-title'), { x: -40 });
        gsap.set(slide.querySelector('.section-description'), { x: -20 });
        gsap.set(slide.querySelectorAll('.skill-category'), { scale: 0.8 });
        gsap.set(slide.querySelectorAll('.skill-tag'), { scale: 0 });

        // Animate to final state
        tl.to(slide.querySelector('.section-number'), {
            x: 0,
            autoAlpha: 1,
            duration: 0.6
        })
        .to(slide.querySelector('.section-title'), {
            x: 0,
            autoAlpha: 1,
            duration: 0.8
        }, '-=0.4')
        .to(slide.querySelector('.section-description'), {
            x: 0,
            autoAlpha: 1,
            duration: 0.6
        }, '-=0.5')
        .to(slide.querySelectorAll('.skill-category'), {
            scale: 1,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'back.out(1.5)'
        }, '-=0.3')
        .to(slide.querySelectorAll('.skill-tag'), {
            scale: 1,
            autoAlpha: 1,
            duration: 0.4,
            stagger: { each: 0.05, from: 'start' },
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
        // Set initial positions
        gsap.set(slide.querySelector('.section-number'), { rotationY: 90 });
        gsap.set(slide.querySelector('.section-title'), { rotationY: 90 });
        gsap.set(slide.querySelectorAll('.project-card'), { x: -100, rotationX: -15 });
        gsap.set(slide.querySelectorAll('.project-icon'), { rotation: -360, scale: 0 });

        // Animate to final state
        tl.to(slide.querySelector('.section-number'), {
            rotationY: 0,
            autoAlpha: 1,
            duration: 0.8
        })
        .to(slide.querySelector('.section-title'), {
            rotationY: 0,
            autoAlpha: 1,
            duration: 0.8
        }, '-=0.6')
        .to(slide.querySelectorAll('.project-card'), {
            x: 0,
            rotationX: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        }, '-=0.4')
        .to(slide.querySelectorAll('.project-icon'), {
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
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
        // Set initial positions
        gsap.set(slide.querySelector('.section-number'), { scale: 0 });
        gsap.set(slide.querySelector('.section-title'), { scale: 0.5 });
        gsap.set(slide.querySelectorAll('.education-card'), { y: 80, rotation: 5 });
        gsap.set(slide.querySelector('footer'), { y: 30 });

        // Animate to final state
        tl.to(slide.querySelector('.section-number'), {
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'back.out(2)'
        })
        .to(slide.querySelector('.section-title'), {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, '-=0.3')
        .to(slide.querySelectorAll('.education-card'), {
            y: 0,
            rotation: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }, '-=0.4')
        .to(slide.querySelector('footer'), {
            y: 0,
            autoAlpha: 1,
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
