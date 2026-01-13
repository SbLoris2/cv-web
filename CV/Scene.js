// Three.js Scene - Quantum Organic Sphere

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
renderer.setClearColor(0xF1F1F1, 1);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
camera.position.set(120, 0, 300);

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
    
    // Move sphere based on scroll
    // X position: move from left to right as we scroll
    shape.position.x = (scrollProgress * 400) - 200; // Range: -200 to 200
    
    // Y position: slight wave motion
    shape.position.y = Math.sin(scrollProgress * Math.PI * 2) * 30;
    
    // Z position: move closer/further
    shape.position.z = Math.cos(scrollProgress * Math.PI) * 50;
    
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