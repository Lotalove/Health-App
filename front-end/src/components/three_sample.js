import * as THREE from 'three';
import { useEffect, useRef } from 'react';

// in this application three js will be used as the engine to drive workout avatar animation


function createScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  return { scene, camera, renderer };
}

function createCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  return new THREE.Mesh(geometry, material);
}

function animate(cube, scene, camera, renderer) {
  const render = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
}

function MyThree() {
  const refContainer = useRef(null);

  useEffect(() => {
    const { scene, camera, renderer } = createScene();
    const cube = createCube();
    scene.add(cube);
    camera.position.z = 5;

    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    animate(cube, scene, camera, renderer);

    return () => {
      refContainer.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={refContainer} />;
}

export default MyThree;
