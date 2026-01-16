// Loading Screen Controller
(function() {
    'use strict';

    let progress = 0;
    let loaderOverlay, progressFill, percentageText;
    const minLoadTime = 800; // Minimum loading time in ms
    const startTime = Date.now();

    // Track which assets have loaded (to prevent double-counting)
    const loadedAssets = {
        three: false,
        gsap: false,
        warpScene: false,
        cvScene: false,
        contactScene: false
    };

    // Total checkpoints (5 key milestones)
    const totalCheckpoints = 5;
    let completedCheckpoints = 0;

    function init() {
        loaderOverlay = document.getElementById('loaderOverlay');
        progressFill = document.getElementById('loaderProgressFill');
        percentageText = document.getElementById('loaderPercentage');

        if (!loaderOverlay || !progressFill || !percentageText) {
            console.error('Loader elements not found');
            return;
        }

        // Initial setup - ensure loader is visible
        updateProgress(0);

        console.log('Loader initialized, waiting for assets...');
    }

    function updateProgress(percentage) {
        // Ensure progress never goes backwards
        const newProgress = Math.max(progress, Math.min(100, percentage));

        if (newProgress < progress) {
            console.warn('Attempted to decrease progress - ignoring');
            return;
        }

        progress = newProgress;

        if (progressFill) {
            progressFill.style.width = progress + '%';
        }

        if (percentageText) {
            percentageText.textContent = Math.round(progress) + '%';
        }

        console.log(`Progress: ${Math.round(progress)}%`);
    }

    function markAssetLoaded(assetName) {
        // Prevent double-counting
        if (loadedAssets[assetName]) {
            console.log(`Asset ${assetName} already counted, skipping`);
            return;
        }

        loadedAssets[assetName] = true;
        completedCheckpoints++;

        const newProgress = (completedCheckpoints / totalCheckpoints) * 100;
        console.log(`Asset loaded: ${assetName} (${completedCheckpoints}/${totalCheckpoints})`);
        updateProgress(newProgress);

        // Check if all assets loaded
        if (completedCheckpoints >= totalCheckpoints) {
            // Ensure minimum load time has elapsed
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);

            console.log(`All assets loaded! Completing in ${remainingTime}ms...`);

            setTimeout(() => {
                completeLoading();
            }, remainingTime);
        }
    }

    function completeLoading() {
        console.log('Completing loading, hiding loader');

        // Ensure we're at 100%
        updateProgress(100);

        // Wait a bit before hiding
        setTimeout(() => {
            if (loaderOverlay) {
                loaderOverlay.classList.add('hidden');

                // Remove from DOM after transition
                setTimeout(() => {
                    if (loaderOverlay && loaderOverlay.parentNode) {
                        loaderOverlay.parentNode.removeChild(loaderOverlay);
                    }
                }, 800); // Match CSS transition duration
            }

            // Trigger page load animations
            if (window.initPageLoadAnimations) {
                window.initPageLoadAnimations();
            }
        }, 300);
    }

    function checkLibraries() {
        // Check if Three.js loaded
        if (typeof THREE !== 'undefined' && !loadedAssets.three) {
            markAssetLoaded('three');
        }

        // Check if GSAP loaded
        if (typeof gsap !== 'undefined' && !loadedAssets.gsap) {
            markAssetLoaded('gsap');
        }

        // If both libraries loaded, stop checking
        if (loadedAssets.three && loadedAssets.gsap) {
            clearInterval(libraryCheckInterval);
        }
    }

    // Public API
    window.Loader = {
        init: init,
        updateProgress: updateProgress,

        // Scenes report when they're ready
        reportWarpSceneReady: function() {
            markAssetLoaded('warpScene');
        },
        reportCVSceneReady: function() {
            markAssetLoaded('cvScene');
        },
        reportContactSceneReady: function() {
            markAssetLoaded('contactScene');
        },

        // Legacy support (deprecated)
        incrementProgress: function(amount) {
            console.warn('incrementProgress is deprecated, use specific report methods');
        },

        complete: completeLoading
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Start checking for libraries
    const libraryCheckInterval = setInterval(checkLibraries, 50);

    // Timeout after 5 seconds - force completion if stuck
    setTimeout(() => {
        if (completedCheckpoints < totalCheckpoints) {
            console.warn('Loading timeout - forcing completion');
            clearInterval(libraryCheckInterval);
            completeLoading();
        }
    }, 5000);

})();
