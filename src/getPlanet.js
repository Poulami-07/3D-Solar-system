import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

const texLoader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 6);

function getPlanet({
  children = [],
  distance = 0,
  img = '',
  size = 1,
  rotationSpeed = 1,
  planetSpeeds = {}
}) {
  const orbitGroup = new THREE.Group(); 

  const path = `./textures/${img}`;
  const map = texLoader.load(path);
  const planetMat = new THREE.MeshStandardMaterial({ map });
  const planet = new THREE.Mesh(geo, planetMat);
  planet.scale.setScalar(size);

  const planetName = img.split('.')[0].charAt(0).toUpperCase() + img.split('.')[0].slice(1);
  planet.userData.name = planetName;


  const planetRimMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0x000000 });
  const planetRimMesh = new THREE.Mesh(geo, planetRimMat);
  planetRimMesh.scale.setScalar(1.01);
  planetRimMesh.userData.name = planetName;
  planet.add(planetRimMesh);


  const planetHolder = new THREE.Group();
  planet.position.set(distance, 0, 0);
  planetHolder.add(planet);

  children.forEach((child) => {
    child.position.set(distance, 0, 0);
    planetHolder.add(child);
  });

  orbitGroup.add(planetHolder);

  orbitGroup.userData.update = (t) => {
    const speed = planetSpeeds[planetName] ?? rotationSpeed;
    orbitGroup.rotation.y = t * speed;

    children.forEach((child) => {
      child.userData?.update?.(t);
    });
  };

  return orbitGroup;
}

export default getPlanet;
