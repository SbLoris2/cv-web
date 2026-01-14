// Three.js Scene - Quantum Organic Sphere

var canvas = document.querySelector('#scene');
if (!canvas) {
    console.error('Scene canvas not found');
} else {
    // Force canvas to be visible for initialization
    canvas.style.display = 'block';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
}

var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);

// Get initial theme
var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
var bgColor = currentTheme === 'dark' ? 0x0F0F0F : 0xFFFFFF;
renderer.setClearColor(bgColor, 1);

// Expose renderer globally for theme switching
window.cvSceneRenderer = renderer;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
camera.position.set(120, 0, 300);
// Lights with theme-aware colors
function updateLights(theme) {
    var hemisphereColor = theme === 'dark' ? 0xffffff : 0xffffff;
    var hemisphereBgColor = theme === 'dark' ? 0x1a5c3a : 0x3a9960;
    
    scene.children.forEach(child => {
        if (child instanceof THREE.HemisphereLight) {
            child.color.setHex(hemisphereColor);
            child.groundColor.setHex(hemisphereBgColor);
        }
    });
}

// Lights with green color scheme
var light = new THREE.HemisphereLight(0xffffff, 0x3a9960, 0.6);
scene.add(light);

var light1 = new THREE.DirectionalLight(0x58C482, 0.5);
light1.position.set(200, 300, 400); 
scene.add(light1);

var light2 = light1.clone();
light2.position.set(-200, 300, 400); 
scene.add(light2);

// Create organic matter sphere
var geometry = new THREE.IcosahedronGeometry(120, 4);

// Store original vertices
for(var i = 0; i < geometry.vertices.length; i++) {
    var vector = geometry.vertices[i];
    vector._o = vector.clone();  
}

var material = new THREE.MeshPhongMaterial({
    color: 0x58C482,
    emissive: 0x3a9960, 
    emissiveIntensity: 0.4,
    shininess: 0
});

var shape = new THREE.Mesh(geometry, material);
scene.add(shape);

// Scroll progress (0 to 1)
var scrollProgress = 0;
var targetScrollProgress = 0;

// Update scroll progress from navigation
window.updateSceneScroll = function(progress) {
    targetScrollProgress = progress;
};

// Update vertices with Perlin noise
function updateVertices(a) {
    for(var i = 0; i < geometry.vertices.length; i++) {
        var vector = geometry.vertices[i];
        vector.copy(vector._o);
        
        var perlin = noise.simplex3(
            (vector.x * 0.006) + (a * 0.0002),
            (vector.y * 0.006) + (a * 0.0003),
            (vector.z * 0.006)
        );
        
        var ratio = ((perlin * 0.4 * (mouse.y + 0.1)) + 0.8);
        vector.multiplyScalar(ratio);
    }
    geometry.verticesNeedUpdate = true;
}

// Render loop
function render(a) {
    requestAnimationFrame(render);

    // Smooth scroll interpolation
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.05;

    // Responsive adjustments
    var isMobile = window.innerWidth <= 768;

    // Move sphere based on scroll
    // X position: start at right, move left as we scroll
    if (isMobile) {
        // On mobile: center the sphere horizontally
        shape.position.x = -50 + (scrollProgress * -100);
    } else {
        // On desktop: start at right
        shape.position.x = 150 - (scrollProgress * 500);
    }

    // Y position: slight wave motion (adjust for mobile)
    shape.position.y = Math.sin(scrollProgress * Math.PI * 2) * (isMobile ? 50 : 30);

    // Z position: move closer/further (push back on mobile)
    shape.position.z = Math.cos(scrollProgress * Math.PI) * 50 - (isMobile ? 100 : 0);

    // Rotation based on scroll
    shape.rotation.y = scrollProgress * Math.PI * 2;
    shape.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.3;

    updateVertices(a);
    renderer.render(scene, camera);
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
var mouse = new THREE.Vector2(0.8, 0.5);

function onMouseMove(e) {
    TweenMax.to(mouse, 0.8, {
        y: (e.clientY / height),
        x: (e.clientX / width),
        ease: Power1.easeOut
    });
}

// Start animation
requestAnimationFrame(render);
window.addEventListener("mousemove", onMouseMove);

var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});