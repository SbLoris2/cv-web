// Warp Drive WebGL Scene - Optimized

(function() {
    'use strict';

    var canvas = document.querySelector('#warpScene');
    if (!canvas) {
        console.error('Warp canvas not found');
        return;
    }

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

    // Create individual animation objects for each vertex (like original)
    var vertexObjects = [];
    for (var i = 0; i < sphereGeom.vertices.length; i++) {
        vertexObjects.push({
            x: originalPositions[i * 3],
            y: originalPositions[i * 3 + 1],
            z: originalPositions[i * 3 + 2]
        });
    }

    // Animate each dot individually (exact original approach)
    function animateDot(index, vector) {
        var delay = Math.abs(vector.y / radius) * 2;

        gsap.to(vector, {
            x: 0,
            z: 0,
            duration: 4,
            ease: "back.out(1.7)",
            delay: delay,
            repeat: -1,
            yoyo: true,
            yoyoEase: "back.out(1.7)",
            onUpdate: function() {
                updateDot(index, vector);
            }
        });
    }

    // Update single dot position
    function updateDot(index, vector) {
        positions[index * 3] = vector.x;
        positions[index * 3 + 1] = vector.y;
        positions[index * 3 + 2] = vector.z;
    }

    // Start animations for all vertices
    for (var i = 0; i < vertexObjects.length; i++) {
        animateDot(i, vertexObjects[i]);
    }

    // Update positions (called in render loop)
    function updatePositions() {
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

    // Mouse interaction with parallax
    var mouse = { x: 0, y: 0 };
    var targetRotation = { x: 0, z: 0 };
    var targetPosition = { x: 0, y: 0 };

    function onMouseMove(e) {
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;

        // Rotation effect
        targetRotation.x = mouse.y * Math.PI * 0.5;
        targetRotation.z = mouse.x * Math.PI * 0.2;

        // Parallax position effect (subtle)
        targetPosition.x = mouse.x * 20;
        targetPosition.y = -mouse.y * 20;

        gsap.to(dots.rotation, {
            x: targetRotation.x,
            z: targetRotation.z,
            duration: 2,
            ease: "power2.out",
            overwrite: 'auto'
        });

        // Apply parallax to position
        gsap.to(dots.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            duration: 2.5,
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

    // Report to loader that warp scene is ready
    if (window.Loader && window.Loader.reportWarpSceneReady) {
        window.Loader.reportWarpSceneReady();
    }

})();
