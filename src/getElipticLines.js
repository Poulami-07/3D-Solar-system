import * as THREE from 'three';
import { LineMaterial } from 'jsm/lines/LineMaterial.js';
import { Line2 } from 'jsm/lines/Line2.js';
import { LineGeometry } from 'jsm/lines/LineGeometry.js';

const w = window.innerWidth;
const h = window.innerHeight;

function getLine({ width }) {
    const points = [];
    const colors = [];
    const baseRadius = 5.1 + Math.random() * 0.5;
    const hue = 0.25 - Math.random() * 0.27;

    for (let i = 0; i <= 30; i++) {
        const angle = (i / 30) * Math.PI * 2; 
        const radius = baseRadius + (Math.random() - 0.5) * 0.2;
        const { r, g, b } = new THREE.Color().setHSL(hue, 1.0, 0.5);
        colors.push(r, g, b);
        points.push(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
    }

    const material = new LineMaterial({
        linewidth: width,
        vertexColors: true,
    });
    material.resolution.set(w, h);

    const geometry = new LineGeometry();
    geometry.setColors(colors);
    geometry.setPositions(points);

    const line = new Line2(geometry, material);
    line.computeLineDistances();
    return line;
}


function getRing({ distance, hue = 0, lightness = 1.0, width = 2 }) {
    const positions = [];
    const numVerts = 128;

    for (let i = 0; i <= numVerts; i++) {
        const angle = (i / numVerts) * Math.PI * 2;
        positions.push(
            distance * Math.cos(angle),
            distance * Math.sin(angle),
            0
        );
    }

    const color = new THREE.Color().setHSL(hue, 1, lightness);
    const material = new LineMaterial({
        color,
        linewidth: width,
    });
    material.resolution.set(w, h);

    const geometry = new LineGeometry();
    geometry.setPositions(positions);

    const ring = new Line2(geometry, material);
    ring.rotation.x = Math.PI * 0.5;
    ring.computeLineDistances();

    return ring;
}

function getElipticLines() {
    const ringGroup = new THREE.Group();
    const distances = [1.2, 1.7, 2.2, 2.6, 3.1, 3.6, 4.1, 4.6];

    for (let i = 0; i < distances.length; i += 1) {
        const hue = 0.25 - i / distances.length * 0.27;
        const lightness = 0.5 - i / distances.length * 0.3;
        const width = 0.75 + Math.random() * 0.5;
        const ring = getRing({
            distance: distances[i],
            hue,
            lightness,
            width,
        });
        ringGroup.add(ring);
    }

    return ringGroup;
}



export default getElipticLines;
