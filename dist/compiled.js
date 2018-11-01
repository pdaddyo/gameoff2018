/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babylonjs/babylon.js":
/*!*******************************************!*\
  !*** ./node_modules/babylonjs/babylon.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || Function(\"return this\")() || (1, eval)(\"this\");\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/Game.ts":
/*!*********************!*\
  !*** ./src/Game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar babylonjs_1 = __webpack_require__(/*! babylonjs */ \"./node_modules/babylonjs/babylon.js\");\nvar Snow_1 = __webpack_require__(/*! ./Snow */ \"./src/Snow.ts\");\nvar Track_1 = __webpack_require__(/*! ./Track */ \"./src/Track.ts\");\nvar Player_1 = __webpack_require__(/*! ./Player */ \"./src/Player.ts\");\nvar Game = (function () {\n    function Game(canvas) {\n        this.isPointerDown = false;\n        this.gameObjects = [];\n        Game.instance = this;\n        this.canvas = canvas;\n        this.engine = new babylonjs_1.Engine(canvas, true);\n        this.scene = this.setupScene();\n        this.player = new Player_1.default();\n        this.camera = this.setupCamera();\n        this.light = this.setupLights();\n        this.setupRenderPipeline();\n        this.setupDebug();\n        this.setupResize();\n        this.track = new Track_1.default();\n        new Snow_1.default();\n    }\n    Game.prototype.addGameObject = function (gameObject) {\n        this.gameObjects.push(gameObject);\n    };\n    Game.prototype.start = function () {\n        this.startGameObjects();\n        this.setupRenderLoop();\n    };\n    Game.prototype.startGameObjects = function () {\n        for (var _i = 0, _a = this.gameObjects; _i < _a.length; _i++) {\n            var gameObject = _a[_i];\n            gameObject.start();\n        }\n    };\n    Game.prototype.setupRenderLoop = function () {\n        var _this = this;\n        this.engine.runRenderLoop(function () {\n            _this.scene.render();\n        });\n    };\n    Game.prototype.setupScene = function () {\n        var _this = this;\n        var scene = new babylonjs_1.Scene(this.engine);\n        scene.clearColor = babylonjs_1.Color4.FromHexString('#77ccecff');\n        scene.onPointerDown = function (evt) {\n            evt.preventDefault();\n            _this.isPointerDown = true;\n        };\n        scene.onPointerUp = function (evt) {\n            evt.preventDefault();\n            _this.isPointerDown = false;\n        };\n        return scene;\n    };\n    Game.prototype.setupLights = function () {\n        this.scene.ambientColor = babylonjs_1.Color3.FromHexString('#99a4cc');\n        var hemi = new babylonjs_1.HemisphericLight('lighthemi', new babylonjs_1.Vector3(0, 0.5, 1), this.scene);\n        hemi.intensity = 0.95;\n        hemi.groundColor = babylonjs_1.Color3.FromHexString('#8894bc');\n        var light = new babylonjs_1.DirectionalLight('light1', new babylonjs_1.Vector3(-1, -1, 0), this.scene);\n        light.shadowEnabled = true;\n        light.position = new babylonjs_1.Vector3(50, 30, -50);\n        light.diffuse = new babylonjs_1.Color3(1, 0.97, 0.97);\n        light.specular = babylonjs_1.Color3.FromHexString('#99a4cc');\n        light.intensity = 0.84;\n        var shadowGenerator = new babylonjs_1.ShadowGenerator(512, light);\n        shadowGenerator.getShadowMap().renderList.push(this.player.mesh);\n        shadowGenerator.useBlurExponentialShadowMap = true;\n        shadowGenerator.blurBoxOffset = 4;\n        shadowGenerator.normalBias = 0.1;\n        shadowGenerator.setDarkness(0.5);\n        return light;\n    };\n    Game.prototype.setupFollowCamera = function () {\n        var camera = new babylonjs_1.FollowCamera('Camera', new babylonjs_1.Vector3(-10, 10, 10), this.scene, this.player.mesh);\n        camera.radius = 70;\n        camera.heightOffset = 70;\n        camera.rotationOffset = -55;\n        camera.cameraAcceleration = 0.003;\n        camera.maxCameraSpeed = 7;\n        camera.lockedTarget = this.player.mesh;\n        camera.attachControl(this.canvas, true);\n        return camera;\n    };\n    Game.prototype.setupArcCamera = function () {\n        var camera = new babylonjs_1.ArcRotateCamera('Camera', Math.PI / 1.5, Math.PI / 4, 120, new babylonjs_1.Vector3(0, -40, 0), this.scene);\n        camera.attachControl(this.canvas, true);\n        return camera;\n    };\n    Game.prototype.setupCamera = function () {\n        return this.setupArcCamera();\n    };\n    Game.prototype.setupRenderPipeline = function () {\n        var pipeline = new BABYLON.DefaultRenderingPipeline('pipeline', true, this.scene, [this.camera]);\n        pipeline.fxaaEnabled = false;\n        pipeline.bloomEnabled = true;\n        pipeline.bloomWeight = 0.15;\n        pipeline.bloomScale = 0.3;\n        pipeline.imageProcessingEnabled = true;\n        pipeline.imageProcessing.vignetteEnabled = true;\n        pipeline.imageProcessing.vignetteBlendMode =\n            BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;\n        pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0, 0, 0, 0.9);\n        pipeline.imageProcessing.vignetteWeight = 1.5;\n        pipeline.imageProcessing.colorCurvesEnabled = true;\n        pipeline.imageProcessing.contrast = 1;\n        pipeline.imageProcessing.exposure = 1;\n    };\n    Game.prototype.setupDebug = function () {\n        var scene = this.scene;\n        var button = document.getElementById('enableDebug');\n        if (button) {\n            button.addEventListener('click', function () {\n                if (scene) {\n                    var debugLayer = scene.debugLayer;\n                    if (debugLayer.isVisible()) {\n                        debugLayer.hide();\n                    }\n                    else {\n                        debugLayer.show();\n                    }\n                }\n            });\n        }\n    };\n    Game.prototype.setupResize = function () {\n        var _this = this;\n        window.addEventListener('resize', function () {\n            _this.engine.resize();\n        });\n    };\n    return Game;\n}());\nexports.default = Game;\n\n\n//# sourceURL=webpack:///./src/Game.ts?");

/***/ }),

/***/ "./src/GameObject.ts":
/*!***************************!*\
  !*** ./src/GameObject.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Game_1 = __webpack_require__(/*! ./Game */ \"./src/Game.ts\");\nvar GameObject = (function () {\n    function GameObject() {\n        this.game = Game_1.default.instance;\n        this.scene = this.game.scene;\n        this.game.addGameObject(this);\n        this.start = this.start.bind(this);\n        this.update = this.update.bind(this);\n        this.scene.registerBeforeRender(this.update);\n    }\n    GameObject.prototype.start = function () { };\n    GameObject.prototype.update = function () { };\n    return GameObject;\n}());\nexports.default = GameObject;\n\n\n//# sourceURL=webpack:///./src/GameObject.ts?");

/***/ }),

/***/ "./src/Player.ts":
/*!***********************!*\
  !*** ./src/Player.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar GameObject_1 = __webpack_require__(/*! ./GameObject */ \"./src/GameObject.ts\");\nvar babylonjs_1 = __webpack_require__(/*! babylonjs */ \"./node_modules/babylonjs/babylon.js\");\nvar down = babylonjs_1.Vector3.Down();\nvar touchingDistance = 0.3;\nvar terminalVelocity = 2;\nvar gravity = new babylonjs_1.Vector3(0, -9.81, 0);\nvar Player = (function (_super) {\n    __extends(Player, _super);\n    function Player() {\n        var _this = _super !== null && _super.apply(this, arguments) || this;\n        _this.velocity = babylonjs_1.Vector3.Zero();\n        _this.ray = new babylonjs_1.Ray(babylonjs_1.Vector3.Zero(), down);\n        _this.mass = 10;\n        return _this;\n    }\n    Player.prototype.start = function () {\n        this.mesh = babylonjs_1.MeshBuilder.CreateBox('playerBox', { size: 4, width: 2, height: 2 }, this.scene);\n        this.mesh.setPositionWithLocalVector(new babylonjs_1.Vector3(0, 5, 2));\n    };\n    Player.prototype.update = function () {\n        var delta = this.game.engine.getDeltaTime();\n        var position = this.mesh.position;\n        this.ray.origin = position;\n        this.ray.direction = down;\n        var result = this.ray.intersectsMesh(this.game.track.mesh, false);\n        if (result.hit) {\n            var distanceToFloor = result.distance;\n            if (distanceToFloor <= touchingDistance) {\n                this.velocity = babylonjs_1.Vector3.Zero();\n                console.log('touching ground!');\n            }\n            else {\n                console.log('mid air!', this.velocity);\n                this.velocity.addInPlace(gravity.scale((this.mass / 1000000) * delta));\n            }\n            var normal = result.getNormal(true, true);\n            this.mesh.lookAt(position.add(normal));\n            this.mesh.translate(this.velocity.normalizeToNew(), this.velocity.length(), babylonjs_1.Space.WORLD);\n        }\n    };\n    return Player;\n}(GameObject_1.default));\nexports.default = Player;\n\n\n//# sourceURL=webpack:///./src/Player.ts?");

/***/ }),

/***/ "./src/Snow.ts":
/*!*********************!*\
  !*** ./src/Snow.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar babylonjs_1 = __webpack_require__(/*! babylonjs */ \"./node_modules/babylonjs/babylon.js\");\nvar GameObject_1 = __webpack_require__(/*! ./GameObject */ \"./src/GameObject.ts\");\nvar Snow = (function (_super) {\n    __extends(Snow, _super);\n    function Snow() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    Snow.prototype.start = function () {\n        this.particleSystem = new babylonjs_1.ParticleSystem('particles', 500, this.scene, null, true);\n        this.mesh = babylonjs_1.Mesh.CreateBox('fountain', 0.1, this.scene);\n        this.mesh.position.y = 50;\n        this.mesh.isVisible = false;\n        var particleSystem = this.particleSystem;\n        particleSystem.particleTexture = new babylonjs_1.Texture('/dist/snowflake.png', this.scene);\n        particleSystem.startSpriteCellID = 0;\n        particleSystem.endSpriteCellID = 1;\n        particleSystem.spriteCellHeight = 512;\n        particleSystem.spriteCellWidth = 512;\n        particleSystem.emitter = this.mesh;\n        particleSystem.minEmitBox = new babylonjs_1.Vector3(-100, 0, -100);\n        particleSystem.maxEmitBox = new babylonjs_1.Vector3(100, 0, 100);\n        particleSystem.minSize = 0.4;\n        particleSystem.maxSize = 3;\n        particleSystem.minLifeTime = 1.2;\n        particleSystem.maxLifeTime = 1.6;\n        particleSystem.emitRate = 250;\n        particleSystem.blendMode = babylonjs_1.ParticleSystem.BLENDMODE_ONEONE;\n        particleSystem.gravity = new babylonjs_1.Vector3(0, -98, 0);\n        particleSystem.direction1 = new babylonjs_1.Vector3(5.5, -1, 5.5);\n        particleSystem.direction2 = new babylonjs_1.Vector3(-5.5, -1, -5.5);\n        particleSystem.minAngularSpeed = 0;\n        particleSystem.maxAngularSpeed = Math.PI;\n        particleSystem.minEmitPower = 1;\n        particleSystem.maxEmitPower = 10;\n        particleSystem.updateSpeed = 0.005;\n        particleSystem.startSpriteCellID = Math.round(Math.random() * 3 - 1);\n        particleSystem.endSpriteCellID = particleSystem.startSpriteCellID;\n        particleSystem.preWarmCycles = 200;\n        particleSystem.start();\n    };\n    Snow.prototype.update = function () {\n        var randomIndex = Math.round(Math.random() * 3 - 1);\n        this.particleSystem.startSpriteCellID = this.particleSystem.endSpriteCellID = randomIndex;\n    };\n    return Snow;\n}(GameObject_1.default));\nexports.default = Snow;\n\n\n//# sourceURL=webpack:///./src/Snow.ts?");

/***/ }),

/***/ "./src/Track.ts":
/*!**********************!*\
  !*** ./src/Track.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar GameObject_1 = __webpack_require__(/*! ./GameObject */ \"./src/GameObject.ts\");\nvar TrackBuilder_1 = __webpack_require__(/*! ./TrackBuilder */ \"./src/TrackBuilder.ts\");\nvar demoTrack_1 = __webpack_require__(/*! ./util/demoTrack */ \"./src/util/demoTrack.ts\");\nvar Track = (function (_super) {\n    __extends(Track, _super);\n    function Track() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    Track.prototype.start = function () {\n        var builder = new TrackBuilder_1.default(this.scene);\n        this.mesh = builder.createTrack(demoTrack_1.default.concat(demoTrack_1.default, demoTrack_1.default, demoTrack_1.default));\n    };\n    return Track;\n}(GameObject_1.default));\nexports.default = Track;\n\n\n//# sourceURL=webpack:///./src/Track.ts?");

/***/ }),

/***/ "./src/TrackBuilder.ts":
/*!*****************************!*\
  !*** ./src/TrackBuilder.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar babylonjs_1 = __webpack_require__(/*! babylonjs */ \"./node_modules/babylonjs/babylon.js\");\nvar TrackChunkType;\n(function (TrackChunkType) {\n    TrackChunkType[TrackChunkType[\"Straight\"] = 0] = \"Straight\";\n    TrackChunkType[TrackChunkType[\"LeftCorner\"] = 1] = \"LeftCorner\";\n    TrackChunkType[TrackChunkType[\"RightCorner\"] = 2] = \"RightCorner\";\n})(TrackChunkType = exports.TrackChunkType || (exports.TrackChunkType = {}));\nvar TrackBuilder = (function () {\n    function TrackBuilder(scene) {\n        this.defaultCornerRadius = 22;\n        this.defaultTrackWidth = 10;\n        this.defaultDivisions = 12;\n        this.parallelPathCount = 5;\n        this.cornerOuterBias = 0.25;\n        this.bowlHeight = 0;\n        this.scene = scene;\n        this.cursor = new babylonjs_1.TransformNode('trackBuilderCursor');\n    }\n    TrackBuilder.prototype.createTrack = function (chunks) {\n        var paths = this.createPaths(chunks);\n        var track = babylonjs_1.MeshBuilder.CreateRibbon('track', {\n            pathArray: paths,\n        });\n        var material = new BABYLON.StandardMaterial('mat1', this.scene);\n        material.alpha = 1.0;\n        material.diffuseColor = new BABYLON.Color3(0.95, 0.97, 1);\n        material.wireframe = false;\n        material.twoSidedLighting = true;\n        material.backFaceCulling = false;\n        track.material = material;\n        return track;\n    };\n    TrackBuilder.prototype.createPaths = function (chunks) {\n        var centerPath = [];\n        var paths = [];\n        for (var pathIndex = 0; pathIndex < this.parallelPathCount; pathIndex++) {\n            paths[pathIndex] = [];\n        }\n        for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {\n            var trackChunk = chunks_1[_i];\n            var divisions = trackChunk.divisions || this.defaultDivisions;\n            var trackWidth = trackChunk.width || this.defaultTrackWidth;\n            var divisionLength = trackChunk.type === TrackChunkType.Straight\n                ? trackChunk.length / divisions\n                : (trackChunk.radius || this.defaultCornerRadius) / divisions;\n            for (var divisionIndex = 0; divisionIndex < divisions; divisionIndex++) {\n                centerPath.push(this.cursor.position);\n                var cornerMultiplier = trackChunk.type == TrackChunkType.Straight\n                    ? 0\n                    : trackChunk.type === TrackChunkType.LeftCorner\n                        ? -1\n                        : 1;\n                for (var pathIndex = 0; pathIndex < this.parallelPathCount; pathIndex++) {\n                    var translation = new babylonjs_1.Vector3((trackWidth / this.parallelPathCount) * pathIndex -\n                        trackWidth / 2, 0, 0);\n                    this.cursor.locallyTranslate(translation);\n                    paths[pathIndex].push(this.cursor.position.add(new babylonjs_1.Vector3(0, -this.bowlHeight *\n                        Math.sin((pathIndex / (this.parallelPathCount - 1) -\n                            cornerMultiplier * this.cornerOuterBias) *\n                            Math.PI), 0)));\n                    this.cursor.locallyTranslate(translation.multiplyInPlace(new babylonjs_1.Vector3(-1, -1, -1)));\n                }\n                this.cursor.translate(babylonjs_1.Vector3.Forward(), divisionLength, babylonjs_1.Space.LOCAL);\n                this.cursor.position.y -= trackChunk.height / divisions;\n                if (trackChunk.type === TrackChunkType.LeftCorner ||\n                    trackChunk.type === TrackChunkType.RightCorner) {\n                    var rotations = trackChunk.rotations || 1 / 2;\n                    this.cursor.rotate(babylonjs_1.Axis.Y, ((Math.PI * rotations * 2) / divisions) * cornerMultiplier, babylonjs_1.Space.WORLD);\n                }\n            }\n        }\n        return paths;\n    };\n    return TrackBuilder;\n}());\nexports.default = TrackBuilder;\n\n\n//# sourceURL=webpack:///./src/TrackBuilder.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Game_1 = __webpack_require__(/*! ./Game */ \"./src/Game.ts\");\nvar canvas = document.getElementById('renderCanvas');\nvar game = new Game_1.default(canvas);\ngame.start();\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ }),

/***/ "./src/util/demoTrack.ts":
/*!*******************************!*\
  !*** ./src/util/demoTrack.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar TrackBuilder_1 = __webpack_require__(/*! ../TrackBuilder */ \"./src/TrackBuilder.ts\");\nexports.default = [\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 6,\n        length: 30,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.LeftCorner,\n        height: 2,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 3,\n        length: 12,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 3,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 3,\n        length: 12,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.LeftCorner,\n        height: 5,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 3,\n        length: 12,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 9,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 15,\n        length: 75,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 1,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 4,\n        length: 28,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.LeftCorner,\n        height: 2,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 5,\n        length: 18,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 1,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 8,\n        length: 35,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.LeftCorner,\n        height: 2,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 5,\n        length: 15,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 2,\n        rotations: 1 / 3,\n        radius: 10,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 8,\n        length: 28,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.LeftCorner,\n        height: 2,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 10,\n        length: 15,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 2,\n        rotations: 1 / 3,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 5,\n        length: 8,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.LeftCorner,\n        height: 2,\n        rotations: 1 / 3,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 10,\n        length: 35,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 2,\n        rotations: 1 / 4,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 5,\n        length: 28,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 2,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 5,\n        length: 18,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.RightCorner,\n        height: 2,\n        rotations: 1 / 2,\n    },\n    {\n        type: TrackBuilder_1.TrackChunkType.Straight,\n        height: 10,\n        length: 45,\n    },\n];\n\n\n//# sourceURL=webpack:///./src/util/demoTrack.ts?");

/***/ }),

/***/ "cannon":
/*!*************************!*\
  !*** external "cannon" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("if(typeof cannon === 'undefined') {var e = new Error(\"Cannot find module 'cannon'\"); e.code = 'MODULE_NOT_FOUND'; throw e;}\nmodule.exports = cannon;\n\n//# sourceURL=webpack:///external_%22cannon%22?");

/***/ }),

/***/ "earcut":
/*!*************************!*\
  !*** external "earcut" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("if(typeof earcut === 'undefined') {var e = new Error(\"Cannot find module 'earcut'\"); e.code = 'MODULE_NOT_FOUND'; throw e;}\nmodule.exports = earcut;\n\n//# sourceURL=webpack:///external_%22earcut%22?");

/***/ }),

/***/ "oimo":
/*!***********************!*\
  !*** external "oimo" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("if(typeof oimo === 'undefined') {var e = new Error(\"Cannot find module 'oimo'\"); e.code = 'MODULE_NOT_FOUND'; throw e;}\nmodule.exports = oimo;\n\n//# sourceURL=webpack:///external_%22oimo%22?");

/***/ })

/******/ });