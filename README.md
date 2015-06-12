Three.js — Auto Show — Bugatti Veyron
-------------------------------------
Project created during my Master's Degree in Computer Science for the _Interactive 3D Graphics_ class.

__Live preview__: [https://palexcom.github.io/threejs-auto-show-bugatti](https://palexcom.github.io/threejs-auto-show-bugatti)

__Debug Live preview__: [https://palexcom.github.io/threejs-auto-show-bugatti?debug=true](https://palexcom.github.io/threejs-auto-show-bugatti?debug=true)


__________________


#### Project Goals
Develop a web page based on 3D graphics, using the three.js library,
that showcases a product using realistic materials and illumination.

#### Scene
Composed by a _garage, 3 lights,a car_  and a _stand_ where the car is placed.
All the components are created using three.js primitive geometries except the car model.

#### Light Staging
The scene is composed by 3 directional lights respectively placed in:

1. First light: ```new THREE.Vector3(0, 200, 0)```
2. Second light: ```new THREE.Vector3(100, 200, 0)```
3. Third light: ```new THREE.Vector3(-100, 200, 0)```

Light source is a [Standard Fluorescent](http://planetpixelemporium.com/tutorialpages/light.html) light
expressed in rgb values as ```244, 255, 250```.

#### Materials
The product use realistic materials based on diffuse plus micro-facet BRDFs, and normal mapping.
For the above purpose, custom shader were created. Other objects in the scene, use primitive three.js materials.

#### Interaction
The user is able to inspect the object using appropriate camera control mechanism (orbit around the product, zoom).
It can also interact with the showcase product by changing the car back, top and front torso color.

#### Product
The product in the showcase is a Bugatti Veyron car.
The 3d model used was originally created by [Troyano](http://artist-3d.com/free_3d_models/dnm/model_disp.php?uid=1129)
and taken from an official [three.js example](https://github.com/mrdoob/three.js/tree/master/examples/obj/veyron).

#### Post-Processing
Vignetting post-processing effect was used for reduction of the image brightness and saturation at the periphery.


#### Credits
Color icon: [Freepik](http://www.flaticon.com/authors/freepik)

Bugatti Veyron model: by [Troyano](http://artist-3d.com/free_3d_models/dnm/model_disp.php?uid=1129)
