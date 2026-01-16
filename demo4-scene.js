// Spherical Three.js Scene for Contact Page
// Based on demo4 from Decorative WebGL Backgrounds

(function() {
    'use strict';

    let canvas, renderer, scene, camera, sphere;
    let width, height;
    let material;
    const linesAmount = 18;
    const radius = 100;
    const verticesAmount = 50;
    let animationFrameId;

    function init() {
        canvas = document.getElementById('scene-contact');
        if (!canvas) return;

        width = canvas.offsetWidth;
        height = canvas.offsetHeight;

        // Setup renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);

        // Setup scene
        scene = new THREE.Scene();

        // Setup camera
        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        camera.position.set(0, 0, 350);

        // Create sphere group
        sphere = new THREE.Group();
        scene.add(sphere);

        // Get current theme color
        const root = document.documentElement;
        const accentColor = getComputedStyle(root).getPropertyValue('--color-accent').trim();
        const colorValue = accentColor.startsWith('#') ? parseInt(accentColor.slice(1), 16) : 0x00ff88;

        // Material for lines
        material = new THREE.LineBasicMaterial({
            color: colorValue
        });

        // Create sphere lines
        for (let j = 0; j < linesAmount; j++) {
            const index = j;
            const geometry = new THREE.Geometry();
            geometry.y = (index / linesAmount) * radius * 2;

            for (let i = 0; i <= verticesAmount; i++) {
                const vector = new THREE.Vector3();
                vector.x = Math.cos(i / verticesAmount * Math.PI * 2);
                vector.z = Math.sin(i / verticesAmount * Math.PI * 2);
                vector._o = vector.clone();
                geometry.vertices.push(vector);
            }

            const line = new THREE.Line(geometry, material);
            sphere.add(line);
        }

        // Start animation
        render(0);

        // Setup mouse interaction
        window.addEventListener('mousemove', onMouseMove);

        // Setup resize handler
        let resizeTm;
        window.addEventListener('resize', function() {
            resizeTm = clearTimeout(resizeTm);
            resizeTm = setTimeout(onResize, 200);
        });

        // Listen for theme changes
        window.addEventListener('themeChanged', updateThemeColor);
    }

    function updateVertices(a) {
        for (let j = 0; j < sphere.children.length; j++) {
            const line = sphere.children[j];
            line.geometry.y += 0.3;

            if (line.geometry.y > radius * 2) {
                line.geometry.y = 0;
            }

            const radiusHeight = Math.sqrt(line.geometry.y * (2 * radius - line.geometry.y));

            for (let i = 0; i <= verticesAmount; i++) {
                const vector = line.geometry.vertices[i];
                const ratio = noise.simplex3(
                    vector.x * 0.009,
                    vector.z * 0.009 + a * 0.0006,
                    line.geometry.y * 0.009
                ) * 15;

                vector.copy(vector._o);
                vector.multiplyScalar(radiusHeight + ratio);
                vector.y = line.geometry.y - radius;
            }

            line.geometry.verticesNeedUpdate = true;
        }
    }

    function render(a) {
        animationFrameId = requestAnimationFrame(render);
        updateVertices(a);
        renderer.render(scene, camera);
    }

    function onResize() {
        if (!canvas) return;

        canvas.style.width = '';
        canvas.style.height = '';
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    const mouse = new THREE.Vector2(0.8, 0.5);
    function onMouseMove(e) {
        mouse.y = e.clientY / window.innerHeight;
        if (typeof gsap !== 'undefined') {
            gsap.to(sphere.rotation, {
                x: (mouse.y * 1),
                duration: 2,
                ease: 'power1.out'
            });
        }
    }

    function updateThemeColor() {
        const root = document.documentElement;
        const accentColor = getComputedStyle(root).getPropertyValue('--color-accent').trim();
        const colorValue = accentColor.startsWith('#') ? parseInt(accentColor.slice(1), 16) : 0x00ff88;

        if (material) {
            material.color.setHex(colorValue);
        }
    }

    function destroy() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('themeChanged', updateThemeColor);
    }

    // Don't auto-initialize - wait for manual call
    // Expose init and destroy functions for manual control
    window.initContactScene = init;
    window.destroyContactScene = destroy;

    // Report to loader that contact scene is ready (loaded, not initialized)
    if (window.Loader && window.Loader.reportContactSceneReady) {
        window.Loader.reportContactSceneReady();
    }

})();
