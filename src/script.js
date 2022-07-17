import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { DotScreenShader } from "three/examples/jsm/shaders/DotScreenShader.js";
import fragmentShader from "./shaders/outlinesWobble/outlinesWobble.fragment";
import fragmentShaderHeightMap from "./shaders/oil/oilHeightMap.fragment";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const sun = new THREE.DirectionalLight(0xffffff, 1.3);
sun.castShadow = true;
sun.position.set(2, 2, 0.5);
scene.add(sun);

const shadowHolder = new THREE.MeshPhongMaterial({ shininess: 0.0 });

/**
 * SHADER STUFF
 */
const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;

// const uniforms = {
//   iTime: { value: 0 },
//   iResolution: { value: new THREE.Vector3() },
// };

const loader = new THREE.TextureLoader();
const texture = loader.load("/bayer.png");
const textureNoise = loader.load("/noise.png");
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
const uniforms = {
  iTime: { value: 0 },
  iResolution: { value: new THREE.Vector3() },
  iChannel0: { value: texture },
  iChannel1: { value: textureNoise },
};
const uniformsHeightMap = {
  iTime: { value: 0 },
  iTimeDelta: { value: 0 },
  iResolution: { value: new THREE.Vector3() },
  iChannel0: { value: texture },
  iChannel1: { value: textureNoise },
};

const material = new THREE.ShaderMaterial({
  fragmentShader,
  uniforms,
  vertexShader,
});
const materialHeightMap = new THREE.ShaderMaterial({
  fragmentShader: fragmentShaderHeightMap,
  uniforms: uniformsHeightMap,
  vertexShader,
});

/*************** *****************************************/
/**
 * Objects
 */
const normalShader = new THREE.MeshNormalMaterial();
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 30, 30),
  normalShader
);
sphere.position.y = 0.7;
const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), normalShader);
floor.rotation.set(-Math.PI / 2, 0, 0);
floor.receiveShadow = true;
sphere.castShadow = true;
sun.castShadow = true;
scene.add(floor, sphere);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  composer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  shadowBuffer.setSize(sizes.width, sizes.height);
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
camera.position.y = 5;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
// renderer.setClearColor(0x777777, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1;
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
const controls = new OrbitControls(camera, renderer.domElement);
// controls.target = new THREE.Vector3(0, 15, 0);

const SHADOW_MAP_SIZE = 1024;

// sun.shadow.mapSize.width = SHADOW_MAP_SIZE;
// sun.shadow.mapSize.height = SHADOW_MAP_SIZE;
// sun.shadow.camera.far = 3500;
// sun.shadow.bias = -0.0001;

const PARAMETERS = {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBFormat,
  stencilBuffer: false,
};

const shadowBuffer = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight
);
shadowBuffer.setSize(sizes.width, sizes.height);
const fragmentShaderD = "";
const drawShader = {
  uniforms: {
    tDiffuse: { type: "t", value: null },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShaderD,
};

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// const pass = new ShaderPass(drawShader);
// pass.renderToScreen = true;
// composer.addPass(pass);
const heightMapShader = new ShaderPass(materialHeightMap);
// materialOil.uniforms["iChannel0"].value = composer.renderTarget2.texture;
composer.addPass(heightMapShader);

const wobble = new ShaderPass(material);
// wobble.renderToScreen = true;
// material.uniforms["iChannel0"].value = composer.renderTarget1.texture;
// console.log(composer);
// material.extensions.derivatives = true;
// composer.addPass(wobble);

const tick = (time) => {
  time *= 0.001;

  window.requestAnimationFrame(tick);
  controls.update();
  const canvas = renderer.domElement;
  uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
  uniformsHeightMap.iResolution.value.set(canvas.width, canvas.height, 1);
  uniforms.iTime.value = time;
  uniformsHeightMap.iTime.value = time;
  uniformsHeightMap.iTimeDelta.value = clock.getDelta();

  floor.material = shadowHolder;
  sphere.material = shadowHolder;
  // renderer.setRenderTarget(shadowBuffer);
  // renderer.render(scene, camera);

  // materialOil.uniforms.shadowSaved.value = shadowBuffer.texture;
  // console.log(uniformsOil.shadowSaved.value);

  floor.material = normalShader;
  sphere.material = normalShader;
  // renderer.render(scene, camera);
  composer.render();
};
tick();
