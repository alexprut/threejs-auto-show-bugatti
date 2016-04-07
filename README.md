Three.js — Auto Show — Bugatti Veyron
-------------------------------------
Project created during my Master's Degree in Computer Science for the _Interactive 3D Graphics_ class.  
__Live preview__: [https://alexprut.github.io/threejs-auto-show-bugatti](https://alexprut.github.io/threejs-auto-show-bugatti)
__Debug Live preview__: [https://alexprut.github.io/threejs-auto-show-bugatti?debug=true](https://alexprut.github.io/threejs-auto-show-bugatti?debug=true)

![Demo - Auto Show — Bugatti Veyron](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/demo.png)

-------------

#### Project Goals
Develop a web page based on 3D graphics, using the [three.js](http://threejs.org) library,
that showcases a product using realistic materials and illumination.

#### Scene
Composed by a _garage, 4 lights, a car_  and a _stand_ where the car is placed.
All the components are created using three.js primitive geometries except the car model.

#### Light Staging
The scene is composed by 4 directional lights respectively placed in:

1. First light: ```new THREE.Vector3(0, 200, -140)```
2. Second light: ```new THREE.Vector3(0, 200, 140)```
3. Third light: ```new THREE.Vector3(180, 200, 0)```
3. Fourth light: ```new THREE.Vector3(-180, 200, 0)```

Light source is a [Standard Fluorescent](http://planetpixelemporium.com/tutorialpages/light.html) light
expressed in rgb values as ```244, 255, 250```.

#### Materials
The product use realistic materials based on diffuse plus micro-facet BRDFs, and normal mapping.
For the above purpose, [custom fragment and vertex shader](https://github.com/alexprut/threejs-auto-show-bugatti/blob/master/index.html#L56)
were created. Other objects in the scene, use primitive three.js materials. 

In the custom vertex and fragment shader the following shading equation was implemented:  
![Shading equation](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/equations/shading-equation.png)

Beta equation:  
![Beta equation](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/equations/beta.png)

Lambertian BRDF equation:  
![Lambertian BRDF](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/equations/lambertian-brdf.png)

Micro-facet BRDF equation:  
![Micro-facet BRDF](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/equations/microfacet-brdf.png)

Fresnel effect using the Schlick Approximation equation:  
![Fresnel effect using the Schlick Approximation](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/equations/fresnel-schlick.png)

D(h) using Trowbridge-Reitz equation:  
![Trowbridge-Reitz](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/equations/d-trowbridge-reitz.png)

G(l,v, h) - Geometry Factor using an easier approximation of Cook-Torrance equation:  
![Cook-Torrance](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/equations/cook-torrance.png)

#### Interaction
The user is able to inspect the object using appropriate camera control mechanism (orbit around the product, zoom).
It can also interact with the showcase product by changing the car back, top and front torso color.

![Demo - Interaction](https://github.com/alexprut/threejs-auto-show-bugatti/raw/master/img/demo-interaction.png)

#### Product
The product in the showcase is a Bugatti Veyron car.
The 3d model used was originally created by [Troyano](http://artist-3d.com/free_3d_models/dnm/model_disp.php?uid=1129)
and taken from an official [three.js example](https://github.com/mrdoob/three.js/tree/master/examples/obj/veyron).

#### Post-Processing
Vignetting post-processing effect was used for reduction of the image brightness and saturation at the periphery. For the
above purpose a custom [fragment shader](https://github.com/alexprut/threejs-auto-show-bugatti/blob/master/index.html#L189) was created.

#### Credits
Color icon: [Freepik](http://www.flaticon.com/authors/freepik)  
Bugatti Veyron model: by [Troyano](http://artist-3d.com/free_3d_models/dnm/model_disp.php?uid=1129)  
Bugatti logo and favicon: from the official [Bugatti](http://www.bugatti.com) website
