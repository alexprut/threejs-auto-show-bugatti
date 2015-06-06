var Observable = function () {
    this.observers = [];
};
Observable.prototype.constructor = Observable;
Observable.prototype.registerObserver = function (observer) {
    this.observers.push(observer);
};
Observable.prototype.notifyObservers = function () {
    for (var indexObserver in this.observers) {
        this.observers[indexObserver].update();
    }
};

var BugattiCar = function (uniforms) {
    Observable.call(this);
    this.uniforms = uniforms;
    this.modelData = 'data/bugatti/VeyronNoUv_bin.js';
    this.geometry = null;
    this.mesh = null;
    this.materialPalette = {
        "pure-chrome": new THREE.MeshPhongMaterial({color: 0xffffff}),
        "black-rough": new THREE.MeshLambertMaterial({color: 0x050505}),
        "red-glass-50": new THREE.MeshLambertMaterial({color: 0xff0000, opacity: 0.5, transparent: true}),
        "dark-glass": new THREE.MeshLambertMaterial({color: 0x101046, opacity: 0.20, transparent: true}),
        "green-metal": new THREE.MeshLambertMaterial({color: 0x007711, combine: THREE.MultiplyOperation}),
        "black-metal": new THREE.MeshPhongMaterial({color: 0x222222, combine: THREE.MultiplyOperation}),
        "orange-metal": new THREE.MeshLambertMaterial({color: 0xff6600, combine: THREE.MultiplyOperation}),
        "blue-metal": new THREE.MeshLambertMaterial({color: 0x001133, combine: THREE.MultiplyOperation}),
        "red-metal": new THREE.MeshLambertMaterial({color: 0x770000}),
        "orange-glass-50": new THREE.MeshLambertMaterial({color: 0xffbb00, opacity: 0.5, transparent: true})
    };
    this.carPieces = {
        tiresAndInside: {
            material: this.materialPalette["black-rough"],
            faceMaterialOrder: 0
        },
        wheelsAndExtraChrome: {
            material: new THREE.ShaderMaterial({
                uniforms: this.createUniforms(0x770000),
                fragmentShader: this.getFragmentShader('fragment'),
                vertexShader: this.getVertexShader('vertex')
            }),
            faceMaterialOrder: 1
        },
        backAndTopAndFrontTorso: {
            material: new THREE.ShaderMaterial({
                uniforms: this.createUniforms(0x770000),
                fragmentShader: this.getFragmentShader('fragment-backAndTopAndFrontTorso'),
                vertexShader: this.getVertexShader('vertex-backAndTopAndFrontTorso')
            }),
            faceMaterialOrder: 2
        },
        glass: {
            material: this.materialPalette["dark-glass"],
            faceMaterialOrder: 3
        },
        sidesTorso: {
            material: this.materialPalette["black-metal"],
            faceMaterialOrder: 4
        },
        engine: {
            material: this.materialPalette["pure-chrome"],
            faceMaterialOrder: 5
        },
        backLights: {
            material: this.materialPalette["red-glass-50"],
            faceMaterialOrder: 6
        },
        backSignals: {
            material: this.materialPalette["orange-glass-50"],
            faceMaterialOrder: 7
        }
    };
};
BugattiCar.prototype.constructor = BugattiCar;
BugattiCar.prototype = Object.create(Observable.prototype);
BugattiCar.prototype.createMesh = function () {
    var meshFaceMaterial = new THREE.MeshFaceMaterial();

    for (var pieceIndex in this.carPieces) {
        meshFaceMaterial.materials[this.carPieces[pieceIndex].faceMaterialOrder] = this.carPieces[pieceIndex].material;
    }

    this.mesh = new THREE.Mesh(this.geometry, meshFaceMaterial);
    this.mesh.position.y = 41.5;

    return this.mesh;
};
BugattiCar.prototype.loadCar = function () {
    var loader = new THREE.BinaryLoader(true);

    loader.load(this.modelData, (function (carGeometry) {
        this.geometry = carGeometry;
        this.notifyObservers();
    }).bind(this));
};
BugattiCar.prototype.getVertexShader = function (idDOM) {
    return document.getElementById(idDOM).innerHTML;
};
BugattiCar.prototype.getFragmentShader = function (idDOM) {
    return document.getElementById(idDOM).innerHTML;
};
BugattiCar.prototype.createUniforms = function (color) {
    var uniforms = this.uniforms;
    color = new THREE.Color(color);

    uniforms.materialColor = {
        type: 'v3',
        value: new THREE.Vector3(color.r, color.g, color.b)
    };

    uniforms.rho.value = new THREE.Vector3(color.r, color.g, color.b);
    uniforms.lightPower.value = new THREE.Vector3(7000.0, 7000.0, 7000.0);

    return uniforms;
};


var AutoShow = function () {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.stats = null;
    this.controls = null;
    this.floor = null;
    this.stand = null;
    this.car = null;
    this.lights = [];
    this.imgPath = "img/texture/";
};
AutoShow.prototype.constructor = AutoShow;
AutoShow.prototype.initCamera = function () {
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(-150, 150, 350);

    return camera;
};
AutoShow.prototype.initRender = function () {
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
};
AutoShow.prototype.initCar = function () {
    this.car = new BugattiCar(this.createUniforms());
    this.car.registerObserver(this);
    this.car.loadCar();

};
AutoShow.prototype.update = function () {
    this.scene.add(this.car.createMesh());
};
AutoShow.prototype.createUniforms = function () {
    return {
        lightPosition: {
            type: 'v3',
            value: this.lights[1].position
        },
        ambient: {
            type: 'v3',
            value: new THREE.Vector3(0.09, 0.09, 0.1)
        },
        rho: {
            type: "v3",
            value: new THREE.Vector3(0, 0, 0)
        },
        lightPower: {
            type: "v3",
            value: this.lights[1].intensity
        }
    };
};
AutoShow.prototype.initFloor = function () {
    var texture = THREE.ImageUtils.loadTexture(this.imgPath + 'cement_256_d.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);

    var floor = new THREE.Mesh(
        new THREE.PlaneGeometry(3000, 3000),
        new THREE.MeshLambertMaterial({side: THREE.DoubleSide, map: texture})
    );

    floor.rotation.x = 90 * Math.PI / 180;

    return floor;
};
AutoShow.prototype.initRoof = function () {
    var texture = THREE.ImageUtils.loadTexture(this.imgPath + 'cement_256_d.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);

    var roof = new THREE.Mesh(
        new THREE.PlaneGeometry(3000, 3000),
        new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture})
    );

    roof.rotation.x = 90 * Math.PI / 180;
    roof.position.y = 200;

    return roof;
};
AutoShow.prototype.initStand = function () {
    var texture = THREE.ImageUtils.loadTexture(this.imgPath + 'metal_256_d.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);

    var stand = new THREE.Mesh(
        new THREE.BoxGeometry(340, 8, 340, 1, 1),
        new THREE.MeshPhongMaterial({map: texture})
    );

    stand.position.y = 2.1;

    return stand;
};
AutoShow.prototype.initColumns = function () {
    var texture = THREE.ImageUtils.loadTexture(this.imgPath + 'cement_256_d.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 2);

    var geometry = new THREE.BoxGeometry(70, 200, 70),
        material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture});

    var column1 = new THREE.Mesh(geometry, material),
        column2 = new THREE.Mesh(geometry, material),
        column3 = new THREE.Mesh(geometry, material),
        column4 = new THREE.Mesh(geometry, material);

    column1.position.set(300, 100, -300);
    column2.position.set(-300, 100, -300);
    column3.position.set(300, 100, 300);
    column4.position.set(-300, 100,300);

    this.scene.add(column1);
    this.scene.add(column2);
    this.scene.add(column3);
    this.scene.add(column4);

};
AutoShow.prototype.initLights = function () {
    // Standard Fluorescent, http://planetpixelemporium.com/tutorialpages/light.html
    var lightColor = 0xF4FFFA;
    this.lights = [];

    for (var i = 0; i < 3; i++) {
        this.lights.push(new THREE.DirectionalLight(lightColor, 0.5));
        this.scene.add(this.lights[i]);
    }

    this.lights[0].position.set(0, 200, 0);
    this.lights[1].position.set(100, 200, 0);
    this.lights[2].position.set(-100, 200, 0);
};
AutoShow.prototype.initStats = function () {
    var stats = new Stats();
    stats.setMode(0);

    document.body.appendChild(stats.domElement);

    return stats;
};
AutoShow.prototype.initControls = function () {
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.maxDistance = 370;
    this.controls.minDistance = 150;
    this.controls.minPolarAngle = 60 * Math.PI / 180;
    this.controls.maxPolarAngle = 85 * Math.PI / 180;
};
AutoShow.prototype.initGui = function () {
    var gui = new dat.GUI();

    guiParams = {
        wireframe: true
    };

    var debugFolder = gui.addFolder('Debug');

    debugFolder.add(guiParams, 'wireframe').listen().onFinishChange((function () {
    }).bind(this));

    return gui;
};
AutoShow.prototype.init = function () {
    this.renderer = this.initRender();
    this.scene = new THREE.Scene();
    this.camera = this.initCamera();
    this.stats = this.initStats();
    this.stand = this.initStand();
    this.floor = this.initFloor();
    this.roof = this.initRoof();

    this.scene.fog = new THREE.Fog(0x000000, 200, 2000);

    this.initColumns();
    this.initControls();
    this.initLights();
    this.initCar();

    this.scene.add(this.roof);
    this.scene.add(this.floor);
    this.scene.add(this.stand);

    this.initGui();

    document.body.appendChild(this.renderer.domElement);
    this.render();
};
AutoShow.prototype.render = function () {
    requestAnimationFrame(this.render.bind(this));

    this.stats.begin();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
};

var autoShow = new AutoShow();
autoShow.init();
