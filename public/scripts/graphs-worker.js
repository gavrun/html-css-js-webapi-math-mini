// Web Worker thread to handle graphs coordinates calculations
'use strict';

self.onmessage = function (e) {
    const { type } = e.data;

    if (type === 'calculateGraphs') {
        calculateGraphs(e.data);
    }
};

// Calculate points for mathematical functions graphs
function calculateGraphs(data) {
    const { range } = data;
    const { min, max, step } = range;

    // Linear function
    const linear = [];
    for (let x = min; x <= max; x += step) {
        linear.push({ x: x, y: x });
    }

    // Quadratic function
    const quadratic = [];
    for (let x = min; x <= max; x += step) {
        quadratic.push({ x: x, y: x * x });
    }

    // Inverse function
    const inverseLeft = [];
    const inverseRight = [];
    for (let x = min; x <= max; x += step) {
        if (x < -0.1) {
            inverseLeft.push({ x: x, y: 1 / x });
        } else if (x > 0.1) {
            inverseRight.push({ x: x, y: 1 / x });
        }
    }
    const inverse = [inverseLeft, inverseRight];

    // Square root function
    const sqrt = [];
    for (let x = 0; x <= max; x += step) {
        sqrt.push({ x: x, y: Math.sqrt(x) });
    }

    // Send results back to main thread
    self.postMessage({
        type: 'graphsCalculated',
        data: {
            linear: linear,
            quadratic: quadratic,
            inverse: inverse,
            sqrt: sqrt
        }
    });
}