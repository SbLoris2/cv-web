// Interactive Timeline with GSAP ScrollTrigger
(function() {
    'use strict';

    let timelineInitialized = false;
    let timelineScrollProgress = 0;
    let isTimelineComplete = false;

    function initTimeline() {
        if (timelineInitialized) return;
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, timeline animations disabled');
            return;
        }

        const timelineContainer = document.getElementById('timelineContainer');
        const timelineProgress = document.getElementById('timelineProgress');
        const timelineItems = document.querySelectorAll('.timeline-item');

        if (!timelineContainer || !timelineItems.length) {
            return;
        }

        console.log('Initializing interactive timeline with GSAP');
        timelineInitialized = true;

        // Create master timeline
        const masterTimeline = gsap.timeline({
            defaults: {
                ease: 'power3.out'
            }
        });

        // Animate each timeline item sequentially with stagger
        timelineItems.forEach((item, index) => {
            const dot = item.querySelector('.timeline-dot');
            const content = item.querySelector('.timeline-content');
            const year = item.querySelector('.timeline-year');
            const title = item.querySelector('.timeline-title');
            const company = item.querySelector('.timeline-company');
            const description = item.querySelector('.timeline-description');
            const tags = item.querySelectorAll('.timeline-tag');

            // Set initial states
            gsap.set(item, {
                opacity: 0,
                y: 50
            });

            gsap.set(dot, {
                scale: 0,
                rotate: -180
            });

            gsap.set(content, {
                opacity: 0,
                scale: 0.9,
                rotateY: -15
            });

            gsap.set([year, title, company, description], {
                opacity: 0,
                y: 20
            });

            gsap.set(tags, {
                opacity: 0,
                scale: 0,
                y: 10
            });

            // Create timeline for this item
            const itemTimeline = gsap.timeline({
                delay: index * 0.15 // Stagger effect
            });

            itemTimeline
                // Fade in item container
                .to(item, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6
                })
                // Animate dot with bounce
                .to(dot, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                }, '-=0.3')
                // Animate content card with 3D flip
                .to(content, {
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                }, '-=0.3')
                // Animate text elements
                .to(year, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4
                }, '-=0.4')
                .to(title, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                }, '-=0.3')
                .to(company, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4
                }, '-=0.4')
                .to(description, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                }, '-=0.3')
                // Animate tags with stagger
                .to(tags, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: 'back.out(1.7)'
                }, '-=0.3');

            // Add to master timeline
            masterTimeline.add(itemTimeline, index * 0.1);
        });

        // Animate progress line as items appear
        masterTimeline.to(timelineProgress, {
            height: '100%',
            duration: masterTimeline.duration(),
            ease: 'none'
        }, 0);

        // Hover interactions with GSAP
        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            const dot = item.querySelector('.timeline-dot');
            const title = item.querySelector('.timeline-title');
            const tags = item.querySelectorAll('.timeline-tag');

            item.addEventListener('mouseenter', () => {
                gsap.to(content, {
                    scale: 1.03,
                    y: -5,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                gsap.to(dot, {
                    scale: 1.3,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });

                gsap.to(title, {
                    x: 10,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Subtle wave animation on tags
                gsap.to(tags, {
                    y: -3,
                    duration: 0.3,
                    stagger: 0.03,
                    ease: 'power1.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(content, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                gsap.to(dot, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });

                gsap.to(title, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                gsap.to(tags, {
                    y: 0,
                    duration: 0.3,
                    stagger: 0.03,
                    ease: 'power1.out'
                });
            });

            // Click to expand/highlight
            item.addEventListener('click', () => {
                // Pulse effect on click
                gsap.fromTo(dot,
                    {
                        boxShadow: '0 0 0 0 rgba(88, 196, 130, 0.7)'
                    },
                    {
                        boxShadow: '0 0 0 30px rgba(88, 196, 130, 0)',
                        duration: 0.6,
                        ease: 'power2.out'
                    }
                );

                // Highlight effect
                gsap.fromTo(content,
                    {
                        borderColor: 'var(--color-primary)'
                    },
                    {
                        borderColor: 'var(--color-border)',
                        duration: 1,
                        ease: 'power2.inOut'
                    }
                );
            });
        });

        // Parallax effect on scroll (subtle)
        timelineItems.forEach((item, index) => {
            const isOdd = index % 2 === 0;
            const content = item.querySelector('.timeline-content');

            gsap.to(content, {
                y: isOdd ? 20 : -20,
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    markers: false
                }
            });
        });

        // Progress line follows scroll
        gsap.to(timelineProgress, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: timelineContainer,
                start: 'top center',
                end: 'bottom center',
                scrub: 0.5,
                markers: false
            }
        });

        console.log('Timeline animations initialized successfully');

        // Setup timeline scroll tracking
        setupTimelineScrollTracking(timelineContainer, timelineItems);
    }

    // Setup timeline scroll tracking with snap-to-item behavior
    function setupTimelineScrollTracking(container, items) {
        let currentItemIndex = 0;
        let isAnimating = false;
        let scrollTimeout;

        // Calculate item positions
        const getItemPositions = () => {
            return Array.from(items).map(item => ({
                element: item,
                offsetTop: item.offsetTop
            }));
        };

        // Scroll to specific item with GSAP animation
        const scrollToItem = (index, duration = 1) => {
            if (index < 0 || index >= items.length || isAnimating) return;

            isAnimating = true;
            const itemPositions = getItemPositions();
            const targetPosition = itemPositions[index].offsetTop - 50; // 50px offset from top

            // Animate scroll with GSAP
            gsap.to(container, {
                scrollTop: targetPosition,
                duration: duration,
                ease: 'power3.out',
                onComplete: () => {
                    isAnimating = false;
                    currentItemIndex = index;

                    // Update completion status
                    if (index >= items.length - 1) {
                        isTimelineComplete = true;
                        timelineScrollProgress = 1;
                        console.log('Timeline scroll complete - horizontal navigation unlocked');
                    } else {
                        isTimelineComplete = false;
                        timelineScrollProgress = index / (items.length - 1);
                    }

                    // Animate current item
                    animateTimelineItem(items[index]);
                }
            });
        };

        // Animate individual timeline item - simplified
        const animateTimelineItem = (item) => {
            const dot = item.querySelector('.timeline-dot');
            const content = item.querySelector('.timeline-content');

            // Pulse dot - subtle
            gsap.fromTo(dot,
                { scale: 1 },
                {
                    scale: 1.8,
                    duration: 0.4,
                    ease: 'back.out(1.7)',
                    yoyo: true,
                    repeat: 1
                }
            );

            // Subtle content fade
            gsap.fromTo(content,
                { opacity: 0.7 },
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }
            );
        };

        // Handle wheel events for snap scrolling
        container.addEventListener('wheel', (e) => {
            if (isAnimating) {
                e.preventDefault();
                return;
            }

            // Prevent default scrolling
            e.preventDefault();

            // Determine scroll direction
            const direction = e.deltaY > 0 ? 1 : -1;
            const nextIndex = currentItemIndex + direction;

            // Scroll to next/previous item
            if (nextIndex >= 0 && nextIndex < items.length) {
                scrollToItem(nextIndex);
            }
        }, { passive: false });

        // Initialize - scroll to first item
        setTimeout(() => {
            scrollToItem(0, 0.5);
        }, 300);

        // Reset on slide activation
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const slide = container.closest('.slide');
                    if (slide && slide.classList.contains('active')) {
                        // Reset to first item when slide becomes active
                        if (currentItemIndex !== 0) {
                            setTimeout(() => {
                                scrollToItem(0, 0.5);
                            }, 300);
                        }
                    }
                }
            });
        });

        const slide = container.closest('.slide');
        if (slide) {
            observer.observe(slide, { attributes: true });
        }
    }

    // Reset timeline scroll state when leaving the timeline
    function resetTimelineScroll() {
        timelineScrollProgress = 0;
        isTimelineComplete = false;
    }

    // Expose functions
    window.initTimeline = initTimeline;
    window.isTimelineComplete = () => isTimelineComplete;
    window.resetTimelineScroll = resetTimelineScroll;
    window.getTimelineScrollProgress = () => timelineScrollProgress;

    // Auto-init when DOM is ready and GSAP is loaded
    function tryInit() {
        if (typeof gsap !== 'undefined') {
            // Wait a bit for everything to be ready
            setTimeout(initTimeline, 500);
        } else {
            // Retry after a delay
            setTimeout(tryInit, 200);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }

})();
