// Custom Cursor with Particle Trail and Micro-interactions
(function() {
    'use strict';

    // Check if device supports hover (desktop only)
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;

    const cursor = document.getElementById('customCursor');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorOutline = cursor?.querySelector('.cursor-outline');
    const particleCanvas = document.getElementById('particleTrail');

    if (!cursor || !cursorDot || !cursorOutline || !particleCanvas) {
        console.warn('Custom cursor elements not found');
        return;
    }

    // Cursor position tracking
    let mouseX = 0;
    let mouseY = 0;
    let cursorDotX = 0;
    let cursorDotY = 0;
    let cursorOutlineX = 0;
    let cursorOutlineY = 0;

    // Particle trail system
    const ctx = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    const particles = [];
    const maxParticles = 18; // Sweet spot between 12 and 30
    let particleId = 0;

    class Particle {
        constructor(x, y) {
            this.id = particleId++;
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2.5 + 0.5; // Slightly larger
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.life = 1;
            this.decay = Math.random() * 0.025 + 0.015; // Slightly slower decay

            // Get theme color
            const root = document.documentElement;
            const accentColor = getComputedStyle(root).getPropertyValue('--color-accent').trim();
            this.color = accentColor || '#58C482';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.size *= 0.98;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create particles (throttled)
    let lastParticleTime = 0;
    const particleInterval = 40; // ms between particles (slightly more frequent)

    function createParticle(x, y) {
        const now = Date.now();
        if (now - lastParticleTime < particleInterval) return;

        lastParticleTime = now;

        if (particles.length < maxParticles) {
            particles.push(new Particle(x, y));
        }
    }

    // Update and render particles
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animateParticles);
    }

    // Start particle animation
    animateParticles();

    // Smooth cursor movement with easing (only dot, no outline)
    function animateCursor() {
        // Dot follows mouse smoothly
        const dotSpeed = 0.25;
        cursorDotX += (mouseX - cursorDotX) * dotSpeed;
        cursorDotY += (mouseY - cursorDotY) * dotSpeed;

        // Apply position with transform for better performance
        cursorDot.style.left = cursorDotX + 'px';
        cursorDot.style.top = cursorDotY + 'px';

        requestAnimationFrame(animateCursor);
    }

    // Start cursor animation
    animateCursor();

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Create particle at cursor position
        createParticle(mouseX, mouseY);
    });

    // Handle hover states for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .skill-tag, .experience-card, .project-card, .education-card, .contact-link, .theme-toggle, .mobile-menu-toggle, .logo, .stat-item');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Handle mouse down/up for active state
    document.addEventListener('mousedown', () => {
        cursor.classList.add('active');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.classList.add('hidden');
    });

    document.addEventListener('mouseenter', () => {
        cursor.classList.remove('hidden');
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    });

    // Micro-interactions: Add subtle ripple effect on click
    document.addEventListener('click', (e) => {
        // Create subtle burst of particles on click
        const burstCount = 6; // Increased from 4
        for (let i = 0; i < burstCount; i++) {
            const angle = (Math.PI * 2 * i) / burstCount;
            const particle = new Particle(e.clientX, e.clientY);
            particle.speedX = Math.cos(angle) * 1.8;
            particle.speedY = Math.sin(angle) * 1.8;
            particle.size = 3; // Slightly larger burst
            particles.push(particle);
        }
    });

    console.log('Custom cursor initialized');

})();
