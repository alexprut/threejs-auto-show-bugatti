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

var BugattiCar = function () {
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
            material: this.materialPalette["pure-chrome"],
            faceMaterialOrder: 1
        },
        backAndTopAndFrontTorso: {
            material: this.materialPalette["red-metal"],
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
BugattiCar.prototype = new Observable();
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


var AutoShow = function () {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.stats = null;
    this.controls = null;
    this.floor = null;
    this.stand = null;
    this.car = null;
    this.lights = null;
};
AutoShow.prototype.constructor = AutoShow;
AutoShow.prototype.initCamera = function () {
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.x = -150;
    camera.position.y = 150;
    camera.position.z = 350;

    return camera;
};
AutoShow.prototype.initRender = function () {
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
};
AutoShow.prototype.initCar = function () {
    this.car = new BugattiCar();
    this.car.registerObserver(this);
    this.car.loadCar();

};
AutoShow.prototype.update = function () {
    this.scene.add(this.car.createMesh());
};
AutoShow.prototype.initFloor = function () {
    var texture = THREE.ImageUtils.loadTexture('img/texture/cement_256_d.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
    var geometry = new THREE.PlaneGeometry(3000, 3000);
    var material = new THREE.MeshLambertMaterial({side: THREE.DoubleSide, map: texture});
    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = 90 * Math.PI / 180;

    return floor;
};
AutoShow.prototype.initRoof = function () {
    var texture = THREE.ImageUtils.loadTexture('img/texture/cement_256_d.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
    var geometry = new THREE.PlaneGeometry(3000, 3000);
    var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture});
    var roof = new THREE.Mesh(geometry, material);
    roof.rotation.x = 90 * Math.PI / 180;
    roof.position.y = 200;

    return roof;
};
AutoShow.prototype.initStand = function () {
    var texture = THREE.ImageUtils.loadTexture('img/texture/metal_256_d.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    var geometry = new THREE.BoxGeometry(170 * 2, 8, 170 * 2, 1, 1);
    var material = new THREE.MeshPhongMaterial({map: texture});
    var stand = new THREE.Mesh(geometry, material);
    stand.position.y = 2.1;

    return stand;
};
AutoShow.prototype.initColumns = function () {
    var texture = THREE.ImageUtils.loadTexture('img/texture/cement_256_d.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 2);
    var geometry = new THREE.BoxGeometry(70, 200, 70);
    var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture});
    var firstColumn = new THREE.Mesh(geometry, material);
    firstColumn.position.y = 100;
    firstColumn.position.x = 300;
    firstColumn.position.z = -300;
    this.scene.add(firstColumn);


    var secondColumn = new THREE.Mesh(geometry, material);
    secondColumn.position.y = 100;
    secondColumn.position.x = -300;
    secondColumn.position.z = -300;
    this.scene.add(secondColumn);

    var thirdColumn = new THREE.Mesh(geometry, material);
    thirdColumn.position.y = 100;
    thirdColumn.position.x = 300;
    thirdColumn.position.z = 300;
    this.scene.add(thirdColumn);


    var fourthColumn = new THREE.Mesh(geometry, material);
    fourthColumn.position.y = 100;
    fourthColumn.position.x = -300;
    fourthColumn.position.z = 300;
    this.scene.add(fourthColumn);

};
AutoShow.prototype.initLights = function () {
    // Standard Fluorescent, http://planetpixelemporium.com/tutorialpages/light.html
    var lightColor = 0xF4FFFA;

    var firstLight = new THREE.DirectionalLight(lightColor, 0.5);
    firstLight.position.set(100, 200, 0);
    this.scene.add(firstLight);

    var secondLight = new THREE.DirectionalLight(lightColor, 0.5);
    secondLight.position.set(0, 200, 0);
    this.scene.add(secondLight);

    var thirdLight = new THREE.DirectionalLight(lightColor, 0.5);
    thirdLight.position.set(-100, 200, 0);
    this.scene.add(thirdLight);
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

    this.initControls();
    this.initLights();
    this.initCar();
    this.initColumns();

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
