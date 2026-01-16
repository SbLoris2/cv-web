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
            const elements = slide.querySelectorAll('.section-number, .section-title, .section-description, .contact-subtitle, .experience-card, .skill-category, .skill-tag, .project-card, .project-icon, .education-card, .contact-link, .contact-location, footer');
            gsap.set(elements, {
                autoAlpha: 1,
                clearProps: 'transform'
            });
            return;
        }

        // Get all animated elements in this slide
        const elements = slide.querySelectorAll('.section-number, .section-title, .section-description, .contact-subtitle, .experience-card, .skill-category, .skill-tag, .project-card, .project-icon, .education-card, .contact-link, .contact-location, footer');

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

            case 'contact':
                animateContactSlide(tl, slide);
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

    // Skills slide animations - Professional & Smooth
    function animateSkillsSlide(tl, slide) {
        // Set initial positions - subtle and professional
        gsap.set(slide.querySelector('.section-number'), {
            y: 40,
            transformOrigin: 'center center'
        });
        gsap.set(slide.querySelector('.section-title'), {
            y: 50,
            transformOrigin: 'center center'
        });
        gsap.set(slide.querySelector('.section-description'), {
            y: 30,
            transformOrigin: 'center center'
        });

        // Categories with simple fade and slide
        const categories = slide.querySelectorAll('.skill-category');
        gsap.set(categories, {
            y: 60,
            transformOrigin: 'center center'
        });

        // All tags start with simple fade
        const allTags = slide.querySelectorAll('.skill-tag');
        gsap.set(allTags, {
            y: 20,
            transformOrigin: 'center center'
        });

        // Animate header with smooth slide
        tl.to(slide.querySelector('.section-number'), {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power3.out'
        })
        .to(slide.querySelector('.section-title'), {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .to(slide.querySelector('.section-description'), {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.6')

        // Categories appear with smooth wave
        .to(categories, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: {
                each: 0.15,
                from: 'start',
                ease: 'power2.out'
            },
            ease: 'power3.out'
        }, '-=0.4')

        // ALL tags appear together with smooth opacity
        .to(allTags, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: {
                amount: 0.5,
                from: 'start',
                ease: 'power1.inOut'
            },
            ease: 'power2.out'
        }, '-=0.5');

        // Subtle professional hover animation for skill tags
        slide.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                gsap.to(tag, {
                    scale: 1.08,
                    y: -3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            tag.addEventListener('mouseleave', () => {
                gsap.to(tag, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
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

    // Education slide animations - Professional & Elegant
    function animateEducationSlide(tl, slide) {
        // Set initial positions - elegant fade and slide
        gsap.set(slide.querySelector('.section-number'), {
            y: 40,
            scale: 0.95,
            transformOrigin: 'center center'
        });
        gsap.set(slide.querySelector('.section-title'), {
            y: 50,
            scale: 0.95,
            transformOrigin: 'center center'
        });

        // Cards start with subtle 3D rotation
        const cards = slide.querySelectorAll('.education-card');
        gsap.set(cards, {
            rotationY: 15,
            y: 60,
            scale: 0.9,
            transformOrigin: 'center center'
        });

        gsap.set(slide.querySelector('footer'), {
            y: 40,
            transformOrigin: 'center center'
        });

        // Animate header with smooth scale and fade
        tl.to(slide.querySelector('.section-number'), {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out'
        })
        .to(slide.querySelector('.section-title'), {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power3.out'
        }, '-=0.6')

        // Cards appear with elegant cascade and subtle 3D
        .to(cards, {
            rotationY: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.9,
            stagger: {
                each: 0.15,
                from: 'start',
                ease: 'power2.out'
            },
            ease: 'power3.out'
        }, '-=0.5')

        // Footer slides up smoothly
        .to(slide.querySelector('footer'), {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.4');

        // Subtle professional hover with slight lift
        slide.querySelectorAll('.education-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.03,
                    y: -5,
                    rotationY: 2,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    y: 0,
                    rotationY: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Contact page animations - Separate section
    function animateContactPage() {
        console.log('animateContactPage called');

        // Check if animation already played
        if (sessionStorage.getItem('animation_contact_played')) {
            console.log('Animation already played, showing elements immediately');
            // Animation already played, just show elements immediately
            const elements = document.querySelectorAll('.contact-title, .contact-subtitle, .contact-link, .contact-location');
            console.log('Found elements:', elements.length);
            gsap.set(elements, {
                autoAlpha: 1,
                clearProps: 'transform'
            });
            return;
        }

        console.log('Starting fresh animation');

        // Set initial positions
        gsap.set('.contact-title', {
            y: 50,
            scale: 0.95,
            autoAlpha: 0
        });
        gsap.set('.contact-subtitle', {
            y: 30,
            scale: 0.95,
            autoAlpha: 0
        });
        gsap.set('.contact-link', {
            y: 60,
            scale: 0.9,
            autoAlpha: 0
        });
        gsap.set('.contact-location', {
            y: 40,
            autoAlpha: 0
        });

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
                sessionStorage.setItem('animation_contact_played', 'true');
            }
        });

        tl.to('.contact-title', {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.8
        })
        .to('.contact-subtitle', {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.6
        }, '-=0.5')
        .to('.contact-link', {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            stagger: {
                each: 0.12,
                from: 'start',
                ease: 'power2.out'
            }
        }, '-=0.3')
        .to('.contact-location', {
            y: 0,
            autoAlpha: 1,
            duration: 0.6
        }, '-=0.4');

        // Hover animations for contact links
        document.querySelectorAll('.contact-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.05,
                    y: -8,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(link.querySelector('.contact-icon'), {
                    scale: 1.15,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(link.querySelector('.contact-icon'), {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
        });
    }

    // Expose globally
    window.animateContactPage = animateContactPage;

    // Contact slide animations - Professional & Elegant (deprecated - for old structure)
    function animateContactSlide(tl, slide) {
        // Set initial positions - fade and slide
        gsap.set(slide.querySelector('.section-number'), {
            y: 40,
            scale: 0.95
        });
        gsap.set(slide.querySelector('.section-title'), {
            y: 50,
            scale: 0.95
        });
        gsap.set(slide.querySelector('.contact-subtitle'), {
            y: 30,
            scale: 0.95
        });

        // Contact links start hidden
        const contactLinks = slide.querySelectorAll('.contact-link');
        gsap.set(contactLinks, {
            y: 60,
            scale: 0.9
        });

        // Location starts hidden
        gsap.set(slide.querySelector('.contact-location'), {
            y: 40
        });

        // Animate header
        tl.to(slide.querySelector('.section-number'), {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power3.out'
        })
        .to(slide.querySelector('.section-title'), {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .to(slide.querySelector('.contact-subtitle'), {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.5')

        // Contact links appear with elegant cascade
        .to(contactLinks, {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            stagger: {
                each: 0.12,
                from: 'start',
                ease: 'power2.out'
            },
            ease: 'power3.out'
        }, '-=0.3')

        // Location appears last
        .to(slide.querySelector('.contact-location'), {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4');

        // Hover animations for contact links
        slide.querySelectorAll('.contact-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.05,
                    y: -8,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(link.querySelector('.contact-icon'), {
                    scale: 1.15,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(link.querySelector('.contact-icon'), {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
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
