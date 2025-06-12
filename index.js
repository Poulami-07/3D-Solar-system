import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { OBJLoader } from "jsm/loaders/OBJLoader.js";
import getSun from "./src/getSun.js";
import getNebula from "./src/getNebula.js";
import getStarfield from "./src/getStarfield.js";
import getPlanet from "./src/getPlanet.js";
import getAsteroidBelt from "./src/getAsteroidBelt.js";
import getElipticLines from "./src/getElipticLines.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 100);
camera.position.set(0, 3, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
let useAnimatedCamera = true;
let isPaused = false;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');

window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const planet = intersects.find(i => i.object.userData.name)?.object;
    console.log("Clicked object:", planet.userData.name || "Unnamed object");

    if (planet.userData.name) {
      const pos = planet.getWorldPosition(new THREE.Vector3());
      const direction = new THREE.Vector3().subVectors(camera.position, pos).normalize();
      const zoomDistance = 3;  // Adjust for how close you want
      const targetPos = pos.clone().add(direction.multiplyScalar(zoomDistance));

      gsap.to(camera.position, {
        duration: 2,
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        onUpdate: () => camera.lookAt(pos)
      });
      useAnimatedCamera = false;
    }
  }
});

function createOrbit(distance) {
  const segments = 64;
  const orbitGeometry = new THREE.BufferGeometry();
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
  }
  orbitGeometry.setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
  return new THREE.LineLoop(orbitGeometry, orbitMaterial);
}

const planetSpeeds = {
  Mercury: 0.04,
  Venus: 0.015,
  Earth: 0.01,
  Mars: 0.008,
  Jupiter: 0.002,
  Saturn: 0.0015,
  Uranus: 0.001,
  Neptune: 0.0005
};

const slidersContainer = document.getElementById('sliders');
Object.keys(planetSpeeds).forEach(planetName => {
  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '10px';
  const label = document.createElement('label');
  label.innerText = `${planetName}: `;
  label.style.display = 'inline-block';
  label.style.width = '70px';
  const input = document.createElement('input');
  input.type = 'range';
  input.min = '0';
  input.max = '0.05';
  input.step = '0.001';
  input.value = planetSpeeds[planetName];
  input.style.width = '100px';
  input.oninput = (e) => {
    planetSpeeds[planetName] = parseFloat(e.target.value);
  };
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  slidersContainer.appendChild(wrapper);
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  isPaused = !isPaused;
  document.getElementById("pauseBtn").innerText = isPaused ? "Resume" : "Pause";
});

function initScene(data) {
  const { objs } = data;
  const solarSystem = new THREE.Group();
  solarSystem.userData.update = (t) => {
    solarSystem.children.forEach((child) => {
      child.userData.update?.(t);
    });
  };
  scene.add(solarSystem);

  const sun = getSun();
  solarSystem.add(sun);

  function createLabeledPlanet(opts, name) {
    const planet = getPlanet(opts);
    planet.userData.name = name;
    return planet;
  }

  solarSystem.add(createLabeledPlanet({ size: 0.07, distance: 1.2, img: 'mercury.png', rotationSpeed: 3 }, "Mercury"), createOrbit(1.2));
  solarSystem.add(createLabeledPlanet({ size: 0.12, distance: 1.7, img: 'venus.png', rotationSpeed: 4 }, "Venus"), createOrbit(1.7));
  solarSystem.add(createLabeledPlanet({ size: 0.13, distance: 2.2, img: 'earth.png', rotationSpeed: 2 }, "Earth"), createOrbit(2.2));
  solarSystem.add(createLabeledPlanet({ size: 0.1, distance: 2.6, img: 'mars.png', rotationSpeed: 2.5 }, "Mars"), createOrbit(2.6));

  const asteroidBelt = getAsteroidBelt(objs);
  solarSystem.add(asteroidBelt);

  solarSystem.add(createLabeledPlanet({ size: 0.25, distance: 3.1, img: 'jupiter.png', rotationSpeed: 4.5 }, "Jupiter"), createOrbit(3.1));

  const sRingGeo = new THREE.TorusGeometry(0.4, 0.1, 10, 64);
  const sRingMat = new THREE.MeshStandardMaterial();
  const saturnRing = new THREE.Mesh(sRingGeo, sRingMat);
  saturnRing.scale.z = 0.1;
  saturnRing.rotation.x = Math.PI * 0.5;
  solarSystem.add(createLabeledPlanet({ children: [saturnRing], size: 0.22, distance: 3.6, img: 'saturn.png', rotationSpeed: 3 }, "Saturn"), createOrbit(3.6));

  const uRingGeo = new THREE.TorusGeometry(0.25, 0.04, 8, 60);
  const uRingMat = new THREE.MeshBasicMaterial({ color: 0xccccff, transparent: true, opacity: 0.3 });
  const uranusRing = new THREE.Mesh(uRingGeo, uRingMat);
  uranusRing.scale.z = 0.05;
  solarSystem.add(createLabeledPlanet({ children: [uranusRing], size: 0.18, distance: 4.1, img: 'uranus.png', rotationSpeed: 2.5 }, "Uranus"), createOrbit(4.1));

  solarSystem.add(createLabeledPlanet({ size: 0.18, distance: 4.6, img: 'neptune.png', rotationSpeed: 2 }, "Neptune"), createOrbit(4.6));

  const elipticLines = getElipticLines();
  solarSystem.add(elipticLines);
  const starfield = getStarfield({ numStars: 800, size: 0.25 });
  scene.add(starfield);
  scene.add(getNebula({ hue: 0.6, numSprites: 8, opacity: 0.2, radius: 30, size: 60, z: -40 }));
  scene.add(getNebula({ hue: 0.0, numSprites: 8, opacity: 0.2, radius: 30, size: 60, z: 40 }));
  scene.add(new THREE.DirectionalLight(0x0099ff, 1.3).position.set(1, 3, 1));

  const cameraDistance = 5;
  function animate(t = 0) {
    requestAnimationFrame(animate);
    const time = t * 0.0002;
    if (!isPaused) solarSystem.userData.update(time);
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      if (hovered.userData.name) {
        tooltip.style.display = 'block';
        tooltip.innerText = hovered.userData.name;
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
      }
    } else {
      tooltip.style.display = 'none';
    }
    renderer.render(scene, camera);
    if (useAnimatedCamera) {
      camera.position.x = Math.cos(time * 0.75) * cameraDistance;
      camera.position.y = Math.cos(time * 0.75);
      camera.position.z = Math.sin(time * 0.75) * cameraDistance;
      camera.lookAt(0, 0, 0);
      controls.enabled = false;
    } else {
      controls.enabled = true;
      controls.update();
    }
  }
  animate();
}

const sceneData = { objs: [] };
const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);
const loader = new OBJLoader(manager);
['Rock1', 'Rock2', 'Rock3'].forEach((name) => {
  loader.load(`./rocks/${name}.obj`, (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        const mesh = child.clone();
        mesh.scale.setScalar(0.4);
        sceneData.objs.push(mesh);
      }
    });
  });
});

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);