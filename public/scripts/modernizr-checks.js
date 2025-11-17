'use strict';

// Non-invasive browser support check

(function () {
    // Check on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkFeatures);
    } else {
        checkFeatures();
    }

    // Check features support
    function checkFeatures() { }

    // Load polyfill..
})();
