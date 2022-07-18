import * as THREE from "three";
import "./style.css";
import fragmentShaderHeightMap from "./shaders/oil/oilHeightMap.fragment.glsl";

import Stats from "three/examples/jsm/libs/stats.module.js";

let container, stats;

let cameraRTT, camera, sceneRTT, sceneScreen, scene, renderer, zmesh1, zmesh2;

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

  return captureCanvas;
}

let rtTexture, material, quad, quad2;

let delta = 0.01;

const loader = new THREE.TextureLoader();
const dummyNull = loader.load("/black.png");
let prevFrame = loader.load("/black.png");
let currFrame = loader.load("/black.png");
const textureNoise3D = loader.load("rgba3d_noise_flattened_32_32_32.png");
let shouldFreeze = false;
const uniformsHeightMap = {
  iTime: { value: 0 },
  iTimeDelta: { value: 0 },
  iResolution: { value: new THREE.Vector3() },
  iMouse: { value: new THREE.Vector3() },
  iChannel0: { value: textureNoise3D },
  iChannel1: { value: dummyNull },
  iChannel2: { value: currFrame },
  iChannel3: { value: prevFrame },
  shouldFreeze: { value: shouldFreeze },
};

function init() {
  container = document.getElementById("container");

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 100;

  cameraRTT = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    -10000,
    10000
  );
  cameraRTT.position.z = 100;

  //

  scene = new THREE.Scene();
  sceneRTT = new THREE.Scene();
  sceneScreen = new THREE.Scene();

  let light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 0, 1).normalize();
  sceneRTT.add(light);

  light = new THREE.DirectionalLight(0xffaaaa, 1.5);
  light.position.set(0, 0, -1).normalize();
  sceneRTT.add(light);

  rtTexture = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight
  );

  material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0.0 } },
    vertexShader: `
    			varying vec2 vUv;

			void main() {

				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
    `,
    fragmentShader: `

			varying vec2 vUv;
			uniform float time;

			void main() {

				float r = vUv.x;
				if( vUv.y < 0.5 ) r = 0.0;
				float g = vUv.y;
				if( vUv.x < 0.5 ) g = 0.0;

				gl_FragColor = vec4( r, g, time, 1.0 );

			}
    `,
  });

  const materialScreen = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: rtTexture.texture } },
    vertexShader: `
    			varying vec2 vUv;

			void main() {

				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
    `,
    fragmentShader: `

			varying vec2 vUv;
			uniform sampler2D tDiffuse;

			void main() {

				gl_FragColor = texture2D( tDiffuse, vUv );

			}
    `,

    depthWrite: false,
  });

  const plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

  quad = new THREE.Mesh(plane, material);
  quad.position.z = -100;

  const materialHeightMap = new THREE.ShaderMaterial({
    fragmentShader: fragmentShaderHeightMap,
    uniforms: uniformsHeightMap,
    depthWrite: false,
  });

  quad2 = new THREE.Mesh(plane, materialHeightMap);

  quad2.position.set(100, 100, 100);
  quad2.scale.set(0.8, 1.6, 1);
  sceneRTT.add(quad, quad2);

  quad = new THREE.Mesh(plane, materialScreen);
  quad.position.z = -100;
  sceneScreen.add(quad);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;

  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  document.addEventListener("mousemove", onDocumentMouseMove);
}

window.addEventListener("resize", () => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvasElem = render.domElement;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  cameraRTT.aspect = camera.aspect;
  cameraRTT.updateProjectionMatrix();
  console.log("resizing");
});

function onDocumentMouseMove(event) {
  uniformsHeightMap.iMouse.value.x = event.clientX;
  uniformsHeightMap.iMouse.value.y = window.innerHeight - event.clientY;
}

window.addEventListener("pointerup", () => {
  uniformsHeightMap.iMouse.value.z = 0.0;
});
window.addEventListener("pointerdown", () => {
  uniformsHeightMap.iMouse.value.z = 1.0;
});

//

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render(time) {
  time *= 0.001;

  const canvas = renderer.domElement;
  uniformsHeightMap.iResolution.value.set(canvas.width, canvas.height, 1);
  uniformsHeightMap.iTime.value = time;
  uniformsHeightMap.iTimeDelta.value = clock.getDelta();
  rendersCompleted++;
  if (rendersCompleted > 200) {
    uniformsHeightMap.shouldFreeze.value = true;
    console.log("freezed");
  } else
    console.log(
      textureToCanvas(rtTexture, window.innerWidth, window.innerHeight)
    );

  camera.lookAt(scene.position);

  if (zmesh1 && zmesh2) {
    zmesh1.rotation.y = -time;
    zmesh2.rotation.y = -time + Math.PI / 2;
  }

  if (
    material.uniforms["time"].value > 1 ||
    material.uniforms["time"].value < 0
  ) {
    delta *= -1;
  }

  material.uniforms["time"].value += delta;
  prevFrame = currFrame;
  currFrame = rtTexture.texture;
  // uniformsHeightMap.iChannel1.value = rtTexture.texture;
  uniformsHeightMap.iChannel2.value = currFrame;
  uniformsHeightMap.iChannel1.value = prevFrame;
  // Render first scene into texture

  renderer.setRenderTarget(rtTexture);
  renderer.clear();
  renderer.render(sceneRTT, cameraRTT);

  // Render full screen quad with generated texture

  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(sceneScreen, cameraRTT);

  // Render second scene to screen
  // (using first scene as regular texture)

  renderer.render(scene, camera);
}
init();
animate();
