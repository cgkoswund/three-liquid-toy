import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var camera, scene, renderer, controls, mesh, sprite, material;
init();
animate();

function init() {
  // Renderer.
  renderer = new THREE.WebGLRenderer();
  //renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Add renderer to page
  document.body.appendChild(renderer.domElement);

  // Create camera.
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 400;

  // Create scene.
  scene = new THREE.Scene();

  // Create sphere and add to scene.
  var geometry = new THREE.SphereGeometry(162, 32, 32);
  var material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true,
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var planeGeometry = new THREE.PlaneGeometry(10, 10, 16, 16);
  var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  var lookDirection = new THREE.Vector3();
  var target = new THREE.Vector3();

  const geometry2 = {
    vertices: [],
  };

  const pos = geometry.attributes.position.array;
  for (let i = 0; i < pos.length / 3; i++) {
    geometry2.vertices.push({
      x: pos[i * 3],
      y: pos[i * 3 + 1],
      z: pos[i * 3 + 2],
    });
  }

  for (let i = 0; i < geometry2.vertices.length; i++) {
    if (Math.random() * 10 > 2.9956) {
      var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

      // planeMesh.position.set( geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z );
      planeMesh.position.copy(geometry2.vertices[i]); // @ prisoner849

      lookDirection.subVectors(planeMesh.position, mesh.position).normalize();
      target.copy(planeMesh.position).add(lookDirection);
      planeMesh.lookAt(target);

      scene.add(planeMesh);
    }
  }

  // Create ambient light and add to scene.
  var light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  // Create directional light and add to scene.
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Add listener for window resize.
  window.addEventListener("resize", onWindowResize, false);

  // Add stats to page.
  // stats = new Stats();
  // document.body.appendChild(stats.dom);

  // controls
  controls = new OrbitControls(camera, renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  //mesh.rotation.x += 0.005;
  //mesh.rotation.y += 0.01;
  //controls.update();
  renderer.render(scene, camera);
  // stats.update();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
