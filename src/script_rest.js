import "./style.css";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import fragmentShaderHeightMap from "./shaders/oil/oilHeightMap.fragment.glsl";
import fragmentShaderRTT from "./shaders/renderTarget/rtt.fragment.glsl";

const canvas = document.querySelector("canvas.webgl");
const clock = new THREE.Clock();
let rendersCompleted = 0;

function textureToCanvas(texture, width, height) {
  let captureCanvas = document.createElement("canvas");
  let ctx = captureCanvas.getContext("2d");
  captureCanvas.width = width;
  captureCanvas.height = height;

  let imageData = ctx.createImageData(width, height);
  imageData.data.set(texture);
  ctx.putImageData(imageData, 0, 0);

  return texture.image;
}
/**
 * SHADER STUFF
 */

const camera = new THREE.OrthographicCamera(
  -1, // left
  1, // right
  1, // top
  -1, // bottom
  -1, // near,
  1 // far
);
const scene = new THREE.Scene();
const plane = new THREE.PlaneGeometry(2, 2);

const loader = new THREE.TextureLoader();
const dummyNull = loader.load("/black.png");
const textureNoise3D = loader.load("rgba3d_noise_flattened_32_32_32.png");

let shouldFreeze = false;
const uniformsHeightMap = {
  iTime: { value: 0 },
  iTimeDelta: { value: 0 },
  iResolution: { value: new THREE.Vector3() },
  iMouse: { value: new THREE.Vector3() },
  iChannel0: { value: textureNoise3D },
  iChannel1: { value: dummyNull },
  iChannel2: { value: dummyNull },
  shouldFreeze: { value: shouldFreeze },
};

const materialHeightMap = new THREE.ShaderMaterial({
  fragmentShader: fragmentShaderHeightMap,
  uniforms: uniformsHeightMap,
  depthWrite: false,
});
const rTTMat = new THREE.ShaderMaterial({
  fragmentShader: fragmentShaderRTT,
  depthWrite: false,
});

scene.add(new THREE.Mesh(plane, materialHeightMap), camera);

/*************** *****************************************/
/**
 * Objects
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  composer.setSize(sizes.width, sizes.height);
  renderTarget.setSize(sizes.width, sizes.height);
  rtCamera.aspect = camera.aspect;
  rtCamera.updateProjectionMatrix();
  screenShotBuffer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener("pointerdown", () => {
  uniformsHeightMap.iMouse.value.z = 1.0;
});

window.addEventListener("pointermove", (e) => {
  uniformsHeightMap.iMouse.value.x = e.clientX;
  uniformsHeightMap.iMouse.value.y = window.innerHeight - e.clientY;
});
window.addEventListener("pointerup", () => {
  uniformsHeightMap.iMouse.value.z = 0.0;
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.autoClearColor = false;
renderer.preserveDrawingBuffer = true;
renderer.alpha = true;
renderer.pres;
renderer.setSize(sizes.width, sizes.height);

const screenShotBuffer = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight
);
screenShotBuffer.setSize(sizes.width, sizes.height);

const composer = new EffectComposer(renderer, screenShotBuffer);

const heightMapShader = new ShaderPass(materialHeightMap);
heightMapShader.renderToScreen = true;

composer.addPass(heightMapShader);

const rtWidth = window.innerWidth;
const rtHeight = window.innerHeight;
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
  depthBuffer: false,
  stencilBuffer: false,
});
const rtCamera = new THREE.OrthographicCamera(
  -1, // left
  1, // right
  1, // top
  -1, // bottom
  -1, // near,
  10 // far
);
rtCamera.position.z = 5;

const tick = (time) => {
  time *= 0.001;

  window.requestAnimationFrame(tick);

  const canvas = renderer.domElement;
  uniformsHeightMap.iResolution.value.set(canvas.width, canvas.height, 1);
  uniformsHeightMap.iTime.value = time;
  uniformsHeightMap.iTimeDelta.value = clock.getDelta();
  rendersCompleted++;
  if (rendersCompleted > 200) {
    uniformsHeightMap.shouldFreeze.value = true;
    console.log("freezed");
  }

  if (rendersCompleted > 50) {
    renderer.render(scene, camera);
    const imgData = renderer.domElement.toDataURL();
    const texImage = new Image();
    texImage.src = imgData;
    let texture = new THREE.Texture();
    texture.image = texImage;
    texImage.onload = function () {
      texture.needsUpdate = true;
    };
    materialHeightMap.uniforms["iChannel1"].value = texture;
  }
  // composer.render();
  renderer.setRenderTarget(renderTarget);
  renderer.clear();
  renderer.render(scene, rtCamera);

  // Render full screen quad with generated texture

  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(scene, camera);

  // canvas.toBlob((blob, callback) => {
  //   materialHeightMap.uniforms["iChannel1"].value = new THREE.DataTexture(
  //     blob,
  //     window.innerWidth,
  //     window.innerHeight,
  //     THREE.RGBFormat
  //   );
  // });
};
tick();
