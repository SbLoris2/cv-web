// Warp Drive WebGL Scene - Optimized

(function() {
    'use strict';

    var canvas = document.querySelector('#scene');
    var width = canvas.offsetWidth,
        height = canvas.offsetHeight;

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);

    // Get initial theme
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    var bgColor = currentTheme === 'dark' ? 0x0F0F0F : 0xF1F1F1;
    renderer.setClearColor(bgColor, 1);

    // Expose renderer globally for theme switching
    window.sceneRenderer = renderer;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 0, 80);

    // Create dot texture programmatically
    function createDotTexture() {
        var canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        var ctx = canvas.getContext('2d');

        var gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    var dotTexture = createDotTexture();

    // Get theme color
    function getThemeColor() {
        var theme = document.documentElement.getAttribute('data-theme') || 'dark';
        return new THREE.Color(0.345, 0.768, 0.510); // #58C482
    }

    var radius = 50;
    var sphereGeom = new THREE.IcosahedronGeometry(radius, 5);
    var bufferDotsGeom = new THREE.BufferGeometry();
    var positions = new Float32Array(sphereGeom.vertices.length * 3);
    var originalPositions = new Float32Array(sphereGeom.vertices.length * 3);

    // Store original and current positions
    for (var i = 0; i < sphereGeom.vertices.length; i++) {
        var vector = sphereGeom.vertices[i];
        positions[i * 3] = vector.x;
        positions[i * 3 + 1] = vector.y;
        positions[i * 3 + 2] = vector.z;

        originalPositions[i * 3] = vector.x;
        originalPositions[i * 3 + 1] = vector.y;
        originalPositions[i * 3 + 2] = vector.z;
    }

    var attributePositions = new THREE.BufferAttribute(positions, 3);
    bufferDotsGeom.addAttribute('position', attributePositions);

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            texture: {
                value: dotTexture
            },
            color: {
                value: getThemeColor()
            }
        },
        vertexShader: document.getElementById("wrapVertexShader").textContent,
        fragmentShader: document.getElementById("wrapFragmentShader").textContent,
        transparent: true
    });

    var dots = new THREE.Points(bufferDotsGeom, shaderMaterial);
    scene.add(dots);

    // Animation state object for GSAP
    var animationState = {
        warpProgress: 0
    };

    // Single GSAP timeline for warp animation
    gsap.to(animationState, {
        warpProgress: 1,
        duration: 4,
        ease: "back.out(1.7)",
        repeat: -1,
        yoyo: true,
        yoyoEase: "back.out(1.7)"
    });

    // Update positions based on animation progress
    function updatePositions() {
        var progress = animationState.warpProgress;
        var minRadius = 0.2; // Minimum radius ratio (20% of original) - stops before passing through center

        for (var i = 0; i < positions.length / 3; i++) {
            var origX = originalPositions[i * 3];
            var origY = originalPositions[i * 3 + 1];
            var origZ = originalPositions[i * 3 + 2];

            // Calculate delay based on Y position
            var normalizedY = Math.abs(origY / radius);
            var delayedProgress = Math.max(0, Math.min(1, (progress - normalizedY * 0.5) * 2));

            // Calculate compression factor that stops at minRadius
            var compressionFactor = 1 - (delayedProgress * (1 - minRadius));

            // Interpolate between original and minimum radius
            positions[i * 3] = origX * compressionFactor;
            positions[i * 3 + 1] = origY; // Y stays the same
            positions[i * 3 + 2] = origZ * compressionFactor;
        }

        attributePositions.needsUpdate = true;
    }

    // Update theme color when theme changes
    function updateThemeColor() {
        if (shaderMaterial && shaderMaterial.uniforms.color) {
            shaderMaterial.uniforms.color.value = getThemeColor();
        }
    }

    // Listen for theme changes
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                updateThemeColor();
                var theme = document.documentElement.getAttribute('data-theme');
                var bgColor = theme === 'dark' ? 0x0F0F0F : 0xF1F1F1;
                renderer.setClearColor(bgColor, 1);
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Render loop
    function render() {
        updatePositions();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    // Resize handler
    function onResize() {
        canvas.style.width = '';
        canvas.style.height = '';
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // Mouse interaction
    var mouse = { x: 0, y: 0 };
    var targetRotation = { x: 0, z: 0 };

    function onMouseMove(e) {
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;

        targetRotation.x = mouse.y * Math.PI * 0.5;
        targetRotation.z = mouse.x * Math.PI * 0.2;

        gsap.to(dots.rotation, {
            x: targetRotation.x,
            z: targetRotation.z,
            duration: 2,
            ease: "power2.out",
            overwrite: 'auto'
        });
    }

    // Start animation
    requestAnimationFrame(render);
    window.addEventListener("mousemove", onMouseMove);

    var resizeTm;
    window.addEventListener("resize", function() {
        resizeTm = clearTimeout(resizeTm);
        resizeTm = setTimeout(onResize, 200);
    });

    // Initial entrance animation
    gsap.from(dots.rotation, {
        x: Math.PI,
        duration: 2,
        ease: "power2.out"
    });

    gsap.from(dots.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 1.5,
        ease: "back.out(1.7)"
    });

})();
