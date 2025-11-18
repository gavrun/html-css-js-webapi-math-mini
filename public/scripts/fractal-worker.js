// Web Worker thread to handle Sierpinski fractal coordinates calculation
'use strict';

self.onmessage = function (e) {
    const { type } = e.data;

    if (type === 'calculateSierpinski') {
        calculateSierpinski(e.data);
    }
};

// Calculate points for Sierpinski triangle fractal
function calculateSierpinski(data) {
    const { triangle, depth } = data;
    const triangles = [];

    // Recursive Sierpinski
    function sierpinski(p1, p2, p3, level) {
        if (level === 0) {
            // Base case
            triangles.push({ p1: p1, p2: p2, p3: p3 });
        } else {
            // Calculate midpoints of each triangle side
            const mid1 = midpoint(p1, p2);
            const mid2 = midpoint(p2, p3);
            const mid3 = midpoint(p3, p1);

            // Draw three smaller triangles excluding the center triangle
            sierpinski(p1, mid1, mid3, level - 1);  // top
            sierpinski(mid1, p2, mid2, level - 1);  // bottom-left
            sierpinski(mid3, mid2, p3, level - 1);  // bottom-right
        }
    }

    function midpoint(point1, point2) {
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
        };
    }

    sierpinski(triangle.p1, triangle.p2, triangle.p3, depth);

    // Send results back to main thread
    self.postMessage({
        type: 'sierpinskiCalculated',
        data: {
            triangles: triangles
        }
    });
}
