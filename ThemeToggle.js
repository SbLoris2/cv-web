// Theme Toggle System

(function() {
    'use strict';

    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Default theme is dark
    const defaultTheme = 'dark';
    
    // Initialize theme
    function initTheme() {
        // Check for saved theme preference, otherwise use default
        const savedTheme = localStorage.getItem('theme') || defaultTheme;
        setTheme(savedTheme);
    }

    // Set theme
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateRendererBackground(theme);
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Update Three.js renderer background color
    function updateRendererBackground(theme) {
        const bgColor = theme === 'dark' ? 0x0F0F0F : 0xF1F1F1;

        // Update warp drive canvas (landing page)
        if (window.sceneRenderer) {
            window.sceneRenderer.setClearColor(bgColor, 1);
        }

        // Update CV canvas (Perlin sphere)
        if (window.cvSceneRenderer) {
            window.cvSceneRenderer.setClearColor(bgColor, 1);
        }
    }

    // Event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

})();