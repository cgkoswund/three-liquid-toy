I'm not sure you can access node_modules that way.. 
you'll have to import the fonts if you want to use node_modules,

like this: 
```js
//at the very top section of your javascript
import droidFont from "three/examples/fonts/droid/droid_sans_mono_regular.typeface.json"

//at your 3d text section
let textMesh;

const textloader = new FontLoader();
const parsedDroidFont = textloader.parse(droidFont);//add this line <<<------
// textloader.load(//comment out this and next 2 <<<-------------------------
    //'../node_modules/three/examples/fonts/droid/droid_sans_mono_regular.typeface.json',
    // (droidFont) => {
            const textGeometry = new TextGeometry("hello", {
            size: 2,
            height: 10,
            font: parsedDroidFont,//change to the new variable <<<----------
            });
            const textMaterial = new THREE.MeshNormalMaterial();
            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            scene.add(textMesh);

    // );//comment out this line <<<--------------------------------------------

/* ------------------------------ window resize ------------------------------ */

```