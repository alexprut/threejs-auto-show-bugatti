var Observable = function () {
  this.observers = []
}
Observable.prototype.constructor = Observable
Observable.prototype.registerObserver = function (observer) {
  this.observers.push(observer)
}
Observable.prototype.notifyObservers = function () {
  for (var indexObserver in this.observers) {
    this.observers[indexObserver].update()
  }
}

var ShaderManager = function (vertexShader, fragmentShader, uniforms, defines) {
  if (!vertexShader || !fragmentShader) {
    throw new Error('you need to provide a vertex shader and a fragment shader')
  }

  this.vertexShader = vertexShader
  this.fragmentShader = fragmentShader
  this.uniforms = uniforms || {}
  this.defines = defines || {}
}
ShaderManager.prototype.constructor = ShaderManager
ShaderManager.prototype.setUniforms = function (options) {
  for (var indexOption in options) {
    this.uniforms[indexOption] = options[indexOption]
  }
}
ShaderManager.prototype.setDefines = function (options) {
  for (var indexOption in options) {
    this.defines[indexOption] = options[indexOption]
  }
}
ShaderManager.prototype.createUniforms = function (options) {
  var uniforms = JSON.parse(JSON.stringify(this.uniforms))

  for (var indexOption in options) {
    uniforms[indexOption] = options[indexOption]
  }

  return uniforms
}
ShaderManager.prototype.createDefines = function (options) {
  var defines = JSON.parse(JSON.stringify(this.defines))

  for (var indexOption in options) {
    defines[indexOption] = options[indexOption]
  }

  return defines
}

var BugattiCar = function (uniforms, shaderManager) {
  Observable.call(this)
  if (!(shaderManager instanceof ShaderManager)) {
    throw new Error('shaderManager needs to be instance of ShaderManager')
  }

  this.shaderManager = shaderManager
  this.uniforms = uniforms
  this.modelData = 'data/bugatti/VeyronNoUv_bin.js'
  this.geometry = null
  this.mesh = null
  this.materialPalette = {
    'pure-chrome': new THREE.MeshPhongMaterial({color: 0xffffff}),
    'black-rough': new THREE.MeshLambertMaterial({color: 0x050505}),
    'red-glass-50': new THREE.MeshLambertMaterial({color: 0xff0000, opacity: 0.5, transparent: true}),
    'dark-glass': new THREE.MeshLambertMaterial({color: 0x101046, opacity: 0.20, transparent: true}),
    'green-metal': new THREE.MeshLambertMaterial({color: 0x007711, combine: THREE.MultiplyOperation}),
    'black-metal': new THREE.MeshPhongMaterial({color: 0x222222, combine: THREE.MultiplyOperation}),
    'orange-metal': new THREE.MeshLambertMaterial({color: 0xff6600, combine: THREE.MultiplyOperation}),
    'blue-metal': new THREE.MeshLambertMaterial({color: 0x001133, combine: THREE.MultiplyOperation}),
    'red-metal': new THREE.MeshLambertMaterial({color: 0x770000}),
    'orange-glass-50': new THREE.MeshLambertMaterial({color: 0xffbb00, opacity: 0.5, transparent: true})
  }
  this.carPieces = {
    tiresAndInside: {
      material: this.materialPalette['black-rough'],
      faceMaterialOrder: 0
    },
    wheelsAndExtraChrome: {
      material: new THREE.ShaderMaterial({
        uniforms: this.shaderManager.createUniforms({
          type: {
            type: 'i',
            value: 2
          },
          ambient: {
            type: 'v3',
            value: new THREE.Vector3(0.15, 0.15, 0.15)
          },
          diffuseColor: {
            type: 'v3',
            value: new THREE.Vector3(0.6, 0.6, 0.6)
          },
          specColor: {
            type: 'v3',
            value: new THREE.Vector3(0.4, 0.4, 0.4)
          },
          roughness: {
            type: 'f',
            value: 0.1
          }
        }),
        vertexShader: this.shaderManager.vertexShader,
        fragmentShader: this.shaderManager.fragmentShader
      }),
      faceMaterialOrder: 1
    },
    backAndTopAndFrontTorso: {
      material: new THREE.ShaderMaterial({
        uniforms: this.shaderManager.createUniforms({
          type: {
            type: 'i',
            value: 2
          },
          ambient: {
            type: 'v3',
            value: new THREE.Vector3(0.15, 0.15, 0.15)
          },
          rho: {
            type: 'v3',
            value: new THREE.Vector3(0.47, 0.0, 0.0)
          },
          specColor: {
            type: 'v3',
            value: new THREE.Vector3(0.47, 0.0, 0.0)
          },
          roughness: {
            type: 'f',
            value: 0.2
          }
        }),
        vertexShader: this.shaderManager.vertexShader,
        fragmentShader: this.shaderManager.fragmentShader,
        defines: this.shaderManager.defines
      }),
      faceMaterialOrder: 2
    },
    glass: {
      material: this.materialPalette['dark-glass'],
      faceMaterialOrder: 3
    },
    sidesTorso: {
      material: new THREE.ShaderMaterial({
        uniforms: this.shaderManager.createUniforms({
          type: {
            type: 'i',
            value: 1
          },
          ambient: {
            type: 'v3',
            value: new THREE.Vector3(0.0, 0.0, 0.0)
          },
          diffuseColor: {
            type: 'v3',
            value: new THREE.Vector3(0.0663, 0.0663, 0.0663)
          },
          specColor: {
            type: 'v3',
            value: new THREE.Vector3(0.03, 0.03, 0.03)
          }
        }),
        vertexShader: this.shaderManager.vertexShader,
        fragmentShader: this.shaderManager.fragmentShader
      }),
      faceMaterialOrder: 4
    },
    engine: {
      material: new THREE.ShaderMaterial({
        uniforms: this.shaderManager.createUniforms({
          type: {
            type: 'i',
            value: 2
          },
          ambient: {
            type: 'v3',
            value: new THREE.Vector3(0.15, 0.15, 0.15)
          },
          rho: {
            type: 'v3',
            value: new THREE.Vector3(0.6, 0.6, 0.4)
          },
          specColor: {
            type: 'v3',
            value: new THREE.Vector3(0.4, 0.4, 0.4)
          },
          roughness: {
            type: 'f',
            value: 0.15
          }
        }),
        vertexShader: this.shaderManager.vertexShader,
        fragmentShader: this.shaderManager.fragmentShader
      }),
      faceMaterialOrder: 5
    },
    backLights: {
      material: this.materialPalette['red-glass-50'],
      faceMaterialOrder: 6
    },
    backSignals: {
      material: this.materialPalette['orange-glass-50'],
      faceMaterialOrder: 7
    }
  }
}
BugattiCar.prototype.constructor = BugattiCar
BugattiCar.prototype = Object.create(Observable.prototype)
BugattiCar.prototype.setColorBackAndTopAndFrontTorso = function (color) {
  if (!(color instanceof THREE.Color)) {
    throw new Error('color param need to be an instance of THREE.Color')
  }

  this.carPieces
    .backAndTopAndFrontTorso
    .material
    .uniforms.rho.value = new THREE.Vector3(color.r, color.g, color.b)

  this.carPieces
    .backAndTopAndFrontTorso
    .material
    .uniforms.specColor.value = new THREE.Vector3(color.r, color.g, color.b)
}
BugattiCar.prototype.createMesh = function () {
  var meshFaceMaterial = new THREE.MeshFaceMaterial()

  for (var pieceIndex in this.carPieces) {
    meshFaceMaterial.materials[this.carPieces[pieceIndex].faceMaterialOrder] = this.carPieces[pieceIndex].material
  }

  this.mesh = new THREE.Mesh(this.geometry, meshFaceMaterial)
  this.mesh.position.y = 44

  return this.mesh
}
BugattiCar.prototype.loadCar = function () {
  var loader = new THREE.BinaryLoader(true)

  loader.load(this.modelData, function (carGeometry) {
    this.geometry = carGeometry
    this.notifyObservers()
  }.bind(this))
}
BugattiCar.prototype.getVertexShader = function (idDOM) {
  return document.getElementById(idDOM).innerHTML
}
BugattiCar.prototype.getFragmentShader = function (idDOM) {
  return document.getElementById(idDOM).innerHTML
}
BugattiCar.prototype.createUniforms = function (color) {
  var uniforms = this.uniforms
  color = new THREE.Color(color)

  uniforms.materialColor = {
    type: 'v3',
    value: new THREE.Vector3(color.r, color.g, color.b)
  }

  uniforms.rho.value = new THREE.Vector3(color.r, color.g, color.b)
  uniforms.lightPower.value = new THREE.Vector3(5000.0, 5000.0, 5000.0)

  return uniforms
}

var AutoShow = function () {
  this.renderer = null
  this.scene = null
  this.camera = null
  this.stats = null
  this.controls = null
  this.floor = null
  this.stand = null
  this.car = null
  this.lights = []
  this.postProcessing = null
  this.imgPath = 'img/texture/'
  this.shaderManager = null
  this.countAssetsToLoad = 8 // FIXME Big shit here, refactor asap
}
AutoShow.prototype.constructor = AutoShow
AutoShow.prototype.initShaders = function () {
  this.shaderManager = new ShaderManager(
    document.getElementById('vertex-shader').innerHTML,
    document.getElementById('fragment-shader').innerHTML
  )

  this.shaderManager.setUniforms({
    type: {
      type: 'i',
      value: 0 // 0 = lambert, 1 = phong, 2 = microfacet
    },
    rho: {
      type: 'v3',
      value: new THREE.Vector3(0, 0, 0)
    },
    lightPosition: {
      type: 'v3v',
      value: [this.lights[0].position, this.lights[1].position, this.lights[2].position, this.lights[3].position]
    },
    ambient: {
      type: 'v3',
      value: new THREE.Vector3(0.15, 0.15, 0.15)
    },
    lightPower: {
      type: 'v3',
      value: new THREE.Vector3(5000.0, 5000.0, 5000.0)
    },
    map: {
      type: 't',
      value: null
    },
    normalMap: {
      type: 't',
      value: null
    },
    textureRepeat: {
      type: 'v2',
      value: new THREE.Vector2(1, 1)
    },
    diffuseColor: {
      type: 'v3',
      value: new THREE.Vector3()
    },
    specColor: {
      type: 'v3',
      value: new THREE.Vector3()
    },
    roughness: {
      type: 'f',
      value: 0.0
    },
    offset: {
      type: 'f',
      value: 0.0
    },
    darkness: {
      type: 'f',
      value: 0.0
    },
    tDiffuse: {
      type: 't',
      value: null
    }
  })
}
AutoShow.prototype.initCamera = function () {
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
  camera.position.set(0, 150, 350)

  return camera
}
AutoShow.prototype.initRender = function () {
  var renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMapEnabled = true

  return renderer
}
AutoShow.prototype.initCar = function () {
  this.car = new BugattiCar(this.createUniforms(), this.shaderManager)
  this.car.registerObserver(this)
  this.car.loadCar()
}
AutoShow.prototype.updateLoadedAssets = function () {
  this.countAssetsToLoad--

  if (this.countAssetsToLoad === 0) {
    console.log('loaded all assets')
    document.getElementById('loader').style.visibility = 'hidden'
  }
}
AutoShow.prototype.update = function () {
  this.scene.add(this.car.createMesh())
  this.updateLoadedAssets()
}
AutoShow.prototype.createUniforms = function () {
  return {
    lightPosition: {
      type: 'v3v',
      value: [this.lights[0].position, this.lights[1].position, this.lights[2].position, this.lights[3].position]
    },
    ambient: {
      type: 'v3',
      value: new THREE.Vector3(0.1, 0.1, 0.1)
    },
    rho: {
      type: 'v3',
      value: new THREE.Vector3(0, 0, 0)
    },
    lightPower: {
      type: 'v3',
      value: this.lights[1].intensity
    }
  }
}
AutoShow.prototype.initFloor = function () {
  var texture = THREE.ImageUtils.loadTexture(this.imgPath + 'cement_256_d.png', null, function () {
    this.updateLoadedAssets()
  }.bind(this))
  texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
  texture.repeat.set(Math.floor(3000 / 128), Math.floor(3000 / 128))

  var normalMap = THREE.ImageUtils.loadTexture(this.imgPath + 'cement_256_n.png', null, function () {
    this.updateLoadedAssets()
  }.bind(this))
  normalMap.wrapS = normalMap.wrapT = THREE.MirroredRepeatWrapping
  normalMap.repeat.set(Math.floor(3000 / 128), Math.floor(3000 / 128))

  var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshLambertMaterial({side: THREE.DoubleSide, map: texture, normalMap: normalMap})
  )

  floor.rotation.x = 90 * Math.PI / 180

  return floor
}
AutoShow.prototype.initDebugMode = function () {
  this.stats = this.initStats()
  this.initGui()
}
AutoShow.prototype.initPostProcessing = function () {
  this.postProcessing = new THREE.EffectComposer(this.renderer)
  this.postProcessing.addPass(new THREE.RenderPass(this.scene, this.camera))

  this.postProcessing.effects = {}
  this.postProcessing.effects.vignette = new THREE.ShaderPass(
    {
      uniforms: {
        'tDiffuse': {type: 't', value: null},
        'offset': {type: 'f', value: 0.8},
        'darkness': {type: 'f', value: 1.8}
      },
      vertexShader: document.getElementById('vertex-default-texture').innerHTML,
      fragmentShader: document.getElementById('fragment-vignette').innerHTML
    }
  )
  this.postProcessing.effects.vignette.renderToScreen = true

  this.postProcessing.addPass(this.postProcessing.effects.vignette)
}
AutoShow.prototype.initRoof = function () {
  var texture = THREE.ImageUtils.loadTexture(this.imgPath + 'cement_256_d.png', null, function () {
    this.updateLoadedAssets()
  }.bind(this))
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(30, 30)

  var normalMap = THREE.ImageUtils.loadTexture(this.imgPath + 'cement_256_n.png', null, function () {
    this.updateLoadedAssets()
  }.bind(this))
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
  normalMap.repeat.set(30, 30)

  var roof = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture, normalMap: normalMap})
  )

  roof.rotation.x = 90 * Math.PI / 180
  roof.position.y = 200

  return roof
}
AutoShow.prototype.initStand = function () {
  var texture = THREE.ImageUtils.loadTexture(this.imgPath + 'metal_256_d.png', null, function () {
    this.updateLoadedAssets()
  }.bind(this))
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  var normalMap = THREE.ImageUtils.loadTexture(this.imgPath + 'metal_256_n.png', null, function () {
    this.updateLoadedAssets()
  }.bind(this))
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping

  var stand = new THREE.Mesh(
    new THREE.BoxGeometry(240, 8, 340, 1, 1),
    new THREE.ShaderMaterial({
      uniforms: this.shaderManager.createUniforms({
        map: {
          type: 't',
          value: texture
        },
        normalMap: {
          type: 't',
          value: normalMap
        },
        textureRepeat: {
          type: 'v2',
          value: new THREE.Vector2(6, 6)
        }
      }),
      vertexShader: this.shaderManager.vertexShader,
      fragmentShader: this.shaderManager.fragmentShader,
      defines: this.shaderManager.createDefines({
        HAS_NORMAL_MAP: true,
        HAS_MAP: true,
        HAS_UV: true
      })
    })
  )

  stand.position.y = 2.1

  return stand
}
AutoShow.prototype.initColumns = function () {
  var texture = THREE.ImageUtils.loadTexture(this.imgPath + 'cement_256_d.png', null, function () {
    this.updateLoadedAssets()
  }.bind(this))
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 2)

  var geometry = new THREE.BoxGeometry(70, 200, 70)
  var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture})

  var column1 = new THREE.Mesh(geometry, material)
  var column2 = new THREE.Mesh(geometry, material)
  var column3 = new THREE.Mesh(geometry, material)
  var column4 = new THREE.Mesh(geometry, material)

  column1.position.set(300, 100, -300)
  column2.position.set(-300, 100, -300)
  column3.position.set(300, 100, 300)
  column4.position.set(-300, 100, 300)

  this.scene.add(column1)
  this.scene.add(column2)
  this.scene.add(column3)
  this.scene.add(column4)
}
AutoShow.prototype.initLights = function () {
  // Standard Fluorescent, http://planetpixelemporium.com/tutorialpages/light.html
  var lightColor = 0xF4FFFA
  this.lights = []

  for (var i = 0; i < 4; i++) {
    this.lights.push(new THREE.DirectionalLight(lightColor, 0.5))
    this.lights[i].castShadow = true
    this.scene.add(this.lights[i])
  }

  this.lights[0].position.set(0, 200, -140)
  this.lights[1].position.set(0, 200, 140)
  this.lights[2].position.set(180, 200, 0)
  this.lights[3].position.set(-180, 200, 0)
}
AutoShow.prototype.initStats = function () {
  var stats = new Stats()
  stats.setMode(0)

  document.body.appendChild(stats.domElement)

  return stats
}
AutoShow.prototype.initControls = function () {
  this.controls = new THREE.OrbitControls(this.camera)
  this.controls.maxDistance = 370
  this.controls.minDistance = 150
  this.controls.minPolarAngle = 60 * Math.PI / 180
  this.controls.maxPolarAngle = 85 * Math.PI / 180
}
AutoShow.prototype.initOnWindowsResizeEvent = function () {
  window.addEventListener('resize', function () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }.bind(this))
}
AutoShow.prototype.initColorPicker = function (object) {
  var colorVector = this.car.carPieces.backAndTopAndFrontTorso.material.uniforms.rho.value
  var defaultHexColor = new THREE.Color(colorVector.x, colorVector.y, colorVector.w)

  object.colpick({
    layout: 'hex',
    submit: false,
    colorScheme: 'dark',
    color: defaultHexColor.getHexString(),
    onChange: function (hsb, hex) {
      this.car.setColorBackAndTopAndFrontTorso(new THREE.Color('#' + hex))
    }.bind(this),
    onShow: function (el) {
      el = $(el)
      el.css('top', 'auto').css('bottom', '70px')
    }
  })
}
AutoShow.prototype.initGui = function () {
  var gui = new dat.GUI()

  guiParams = {
    wireframe: true
  }

  var debugFolder = gui.addFolder('Debug')

  debugFolder.add(guiParams, 'wireframe').listen().onFinishChange(function () {
  }.bind(this))

  return gui
}
AutoShow.prototype.init = function () {
  this.scene = new THREE.Scene()
  this.renderer = this.initRender()
  this.camera = this.initCamera()
  this.initLights()
  this.initShaders()
  this.stand = this.initStand()
  this.floor = this.initFloor()
  this.roof = this.initRoof()

  this.scene.fog = new THREE.Fog(0x000000, 200, 2000)

  this.initColumns()
  this.initControls()
  this.initCar()
  this.initColorPicker($('#controls button'))
  this.initOnWindowsResizeEvent()

  this.scene.add(this.roof)
  this.scene.add(this.floor)
  this.scene.add(this.stand)

  if (document.location.href.indexOf('?debug=true') !== -1) {
    this.initDebugMode()
  }

  this.initPostProcessing()

  document.body.appendChild(this.renderer.domElement)
  this.render()
}
AutoShow.prototype.render = function () {
  requestAnimationFrame(this.render.bind(this))

  if (this.stats) {
    this.stats.begin()
  }

  if (this.postProcessing) {
    this.postProcessing.render()
  } else {
    this.renderer.render(this.scene, this.camera)
  }

  if (this.stats) {
    this.stats.end()
  }
}

var autoShow = new AutoShow()
autoShow.init()
