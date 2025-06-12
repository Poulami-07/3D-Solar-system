import * as THREE from 'three';

function getInstanced({ distance, mesh, size }) {
    const numObjs = 25 + Math.floor(Math.random() * 25);
    const instaMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, numObjs);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < numObjs; i += 1) {
        const radius = distance + Math.random() * 0.2 - 0.1;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const position = new THREE.Vector3(x, 0, z);
        const quaternion = new THREE.Quaternion();
        quaternion.random();
        const currentSize = size + Math.random() * 0.05 - 0.025;
        const scale = new THREE.Vector3().setScalar(currentSize);
        matrix.compose(position, quaternion, scale);
        instaMesh.setMatrixAt(i, matrix);
    }

    instaMesh.userData = {
        update(t) {
            instaMesh.rotation.y = t * 0.02;
        }
    };

    return instaMesh;
}

function getAsteroidBelt(objs, { radiusMin = 5.1, radiusMax = 5.6 } = {}) {
    const group = new THREE.Group();
    const beltWidth = radiusMax - radiusMin;

    objs.forEach((obj, i) => {
        const distance = radiusMin + (i / objs.length) * beltWidth;
        const asteroids = getInstanced({ distance, mesh: obj, size: 0.035 });
        group.add(asteroids);
    });

    return group;
}

export default getAsteroidBelt;
