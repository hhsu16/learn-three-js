import "./style.css";

// always need three objects for three: scene, camera, renderer
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// like container holds objects like camera and light
const scene = new THREE.Scene();

// mimic human eyeball 75 is field of view, second parameter is aspect ratio browser window, control which object is visible
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// find the html tag to render
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

// set the render method to the device pixel
renderer.setPixelRatio(window.devicePixelRatio);

// full window size
renderer.setSize(window.innerWidth, window.innerHeight);

// set in middle
camera.position.setZ(30);

// run
renderer.render(scene, camera);

// geometry space more in three.js documentation
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// geometry skin
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});

const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// light buble
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// lightHelper show direction and position of the light
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);

scene.add(lightHelper, gridHelper);

// makes control
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // generate random number between 1 - 100
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("space3.jpeg");
scene.background = spaceTexture;

// Avatar
const gTexture = new THREE.TextureLoader().load("guo.png");

const g = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: gTexture })
);

scene.add(g);

// Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpeg");
const normalTexture = new THREE.TextureLoader().load("normal.jpeg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({ map: moonTexture, noramlMap: normalTexture })
);

moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  g.rotation.x += 0.01;
  g.rotation.y += 0.01;

  camera.position.z = t * -0.0000001;
  camera.position.x = t * -0.0000002;
  camera.position.y = t * -0.0000002;
}

document.body.onscroll = moveCamera;

// like game loop
function animate() {
  requestAnimationFrame(animate);

  // animation motion axis in x,y,z
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
