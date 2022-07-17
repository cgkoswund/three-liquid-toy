
I took a look at the docs, it seems the Quaternion class has all the nice rotation helper functions :-(


I got something
//```js
document.addEventListener("keypress", (event) => {
  //Taking advantage of integer nature of keys pressed to simplify 
  //all rotation cases into 1 case.

  const inKey = parseInt(event.key) - 1; //convert key into 'iterator'
  const step = { factor: 0 }; //cos GSAP needs value as a property/object

  //stop smart people from breaking your app with alphabet iterators :-)
  if (Number.isNaN(inKey)) return;

  //Create quaternion objects to store mesh's initial & final/target rotation.
  //setFromEuler(x,y,z) converts a regular <x,y,z> rotation vector to
  //a quaternion <x,y,z,w>
  const initRot = new THREE.Quaternion().copy(mesh.quaternion);
  const targetRot = new THREE.Quaternion().setFromEuler(
    //effectively 1=>0°,2=>90°,3=>180°,4=>270°
    new THREE.Euler(0, (inKey * Math.PI) / 2, 0)
  );

  //GSAP tweening a number 'step.factor' from 0 to 1
  GSAP.to(step, {
    factor: 1, //use this factor to interpolate "manually"
    duration: 0.2,

    //fake "render loop" :-) 
    onUpdate: () =>
      mesh.quaternion.slerpQuaternions(initRot, targetRot, step.factor),
  }); //end of GSAP.to
}); //end of addEventListener
//```