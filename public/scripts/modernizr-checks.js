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
    function checkFeatures() {
        if (typeof Modernizr === 'undefined') {
            // console.error('Modernizr failed to load');
            return;
        }

        const criticalFeatures = {
            'localStorage': 'Web Storage API (localStorage)',
            'webworkers': 'Web Workers'
        };

        const missingFeatures = [];

        for (let feature in criticalFeatures) {
            if (!Modernizr[feature]) {
                missingFeatures.push(criticalFeatures[feature]);
                console.error(`${criticalFeatures[feature]} not supported`);
            }
        }

        const optionalFeatures = {
            'flexbox': 'CSS Flexbox',
            'cssgrid': 'CSS Grid',
            'draganddrop': 'Drag and Drop API',
            'fetch': 'Fetch API'
        };

        for (let feature in optionalFeatures) {
            const isSupported = feature.includes('.')
                ? checkNestedFeature(feature)
                : Modernizr[feature];

            if (!isSupported) {
                console.warn(`${optionalFeatures[feature]} not supported`);
            }
        }

        if (missingFeatures.length === 0) {
            // console.log('All supported');
        } else {
            // console.error('Something not supported:', missingFeatures.join(', '));
        }

        // Fallback from Fetch API to XMLHttpRequest
        if (!Modernizr.fetch) {
            polyfillFetch();
        }
    }

    // Load polyfill..
    function polyfillFetch() {
        if (typeof fetch === 'undefined') {
            window.fetch = function (url) {
                return new Promise(function (resolve, reject) {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', url);
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            resolve({
                                ok: true,
                                text: function () {
                                    return Promise.resolve(xhr.responseText);
                                }
                            });
                        } else {
                            reject(new Error('HTTP ' + xhr.status));
                        }
                    };
                    xhr.onerror = function () {
                        reject(new Error('Network error'));
                    };
                    xhr.send();
                });
            };
        }
    }
})();
