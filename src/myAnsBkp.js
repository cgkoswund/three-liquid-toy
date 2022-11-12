```
So the main issue here is that regular (Euler) rotation angles don't interpolate well when they have to cross zero. 

Quaternions to the rescue!

I know, I know, quaternions are hard to understand. But no worries, just call on the quaternion helper methods to do the heavy lifting :-). Once you convert all angles to quaternions they interpolate really really well.

Second issue is that GSAP doesn't know quaternion values represent an angle, so the interpolation is really weird. It does the job, but the motion looks really weird. Best to just use the 3D library's quaternion interpolation methods (together with GSAP). Spherical linear interpolation (slerp) is used in this example


----------
(ThreeJS implementation)

    //OBJECTIVE
    //User presses keys 1,2,3 or 4 which should rotate model's mesh to face 0,90,
    //180 or 270 degrees respectively (rotating on the y-axis)
    
    document.addEventListener("keypress", (event) => {
      //Taking advantage of integer keypress to simplify all rotation cases
      // into 1 case. For other cases like alphabet key presses you can create
      // a map of some sort
    
      const inKey = parseInt(event.key) - 1; //convert input key to 0 indexed 'iterator'
      const step = { factor: 0 }; //GSAP needs value set up as a property/object
    
      //prevent smart people from breaking your app with alphabet iterators :-)
      if (Number.isNaN(inKey)) return;
    
      //Create quaternion objects to store mesh's initial & final/target rotation.
      //Here, setFromEuler(x,y,z) converts a regular <x,y,z> rotation vector to
      // a quaternion <x,y,z,w>
      const initRot = new THREE.Quaternion().copy(mesh.quaternion);
      const targetRot = new THREE.Quaternion().setFromEuler(

        //Destination y-axis angle uses integer keypress input like an 'iterator'
        // current value, to make an implicit "map" for this exact use case/keypress.
        // Effectively 1=>0°,2=>90°,3=>180°,4=>270°,other input numbers modulo 4
        new THREE.Euler(0, (inKey * Math.PI) / 2, 0)
      );
    
      //GSAP tweening a number 'step.factor' from 0 to 1
      GSAP.to(step, {
        factor: 1, //use this factor to interpolate "manually"
        duration: 0.2,
    
        //Fake "render loop" :-) Interpolate using threeJS slerpQuaternion
        // since GSAP doesn't know its an angle and interpolates awkwardly :-(.
        // This way we can run a custom interpolate on tick
        onUpdate: () =>
          mesh.quaternion.slerpQuaternions(initRot, targetRot, step.factor),
      }); //end of GSAP.to
    }); //end of addEventListener

TL;DR. Here's how to rotate 3D object "mesh" on keypress. (same but without comments)


    document.addEventListener("keypress", (event) => {
      const inKey = parseInt(event.key) - 1; 
      const step = { factor: 0 }; 
      if (Number.isNaN(inKey)) return;
    
      const initRot = new THREE.Quaternion().copy(mesh.quaternion);
      const targetRot = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, (inKey * Math.PI) / 2, 0)
      );
    
      GSAP.to(step, {
        factor: 1, 
        duration: 0.2,
        onUpdate: () =>
          mesh.quaternion.slerpQuaternions(initRot, targetRot, step.factor),
      }); 
    }); 



```;

const sphereRad = 5,
  radLong = 2,
  radLat = 4;
const pX = sphereRad * Math.cos(radLat) * Math.sin(radLong);

const p = sphereRad * Math.cos(radLat) * Math.sin(radLong);

const pY = sphereRad * Math.sin(radLat);
