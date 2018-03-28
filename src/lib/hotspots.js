/*
 * @author Pablo Acuña / pbk.pablo.a@gmail.com/, 
 * @author Jorge Mayoraz / jorge.emh@hotmail.com/, 
 * @author Luciano Rodriguez / luciano.rdz@gmail.com /
 */
import * as THREE from 'three'

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};


THREE.HotspotGlobals = {
    hotspotList: [],
    init: function() {
        var HTSPTG = this;
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector3();
        var obj = {};
        var canDoClick = false;
        var contPos = getPos(HTSPTG.container);
        var canvas = this.container;

        this.over = false;
        this.down = false;

        canvas.addEventListener('mousedown', function(e) {
            var _event = {};
            _event.clientX = e.clientX - contPos.x;
            _event.clientY = e.clientY - contPos.y;
            onMouseDown(_event);
        }, false);

        canvas.addEventListener("mouseup", function(e) {
            var _event = {};
            _event.clientX = e.clientX - contPos.x;
            _event.clientY = e.clientY - contPos.y;
            onMouseUp(_event);
        });

        canvas.addEventListener("mousemove", function(e) {
            var _event = {};
            _event.clientX = e.clientX - contPos.x;
            _event.clientY = e.clientY - contPos.y;
            onMouseMove(_event);
        });

        canvas.addEventListener('touchstart', function(e) {
            var _event = {};
            _event.clientX = e.changedTouches[0].pageX - contPos.x;
            _event.clientY = e.changedTouches[0].pageY - contPos.y;
            onMouseMove(_event);
            onMouseDown(_event);
        }, false);

        canvas.addEventListener('touchend', function(e) {
            var _event = {};
            _event.clientX = e.changedTouches[0].pageX - contPos.x;
            _event.clientY = e.changedTouches[0].pageY - contPos.y;
            onMouseUp(_event);
        }, false);


        function onMouseDown(event) {
            mouse.x = (event.clientX - (HTSPTG.container.offsetWidth / 2));
            mouse.y = -(event.clientY - (HTSPTG.container.offsetHeight / 2));
            mouse.z = 10;

            HTSPTG.down = false;

            var dest = new THREE.Vector3(0, 0, -1);
            raycaster.set(mouse, dest);
            var intersects = raycaster.intersectObjects(HTSPTG.hotspotList);
            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    var intersection = intersects[i];
                    obj = intersection.object;

                    if (obj.controller.itsActive > 0 && obj.material.opacity) {
                        obj.material.color.setHex(0xb2b2b2);

                        if (isFunction(HTSPTG.over.controller.onMouseDown)) {
                            HTSPTG.over.controller.onMouseDown();
                        } else if (isFunction(obj.controller.mouseDown)) {
                            obj.controller.mouseDown();
                        }

                        if (obj.controller.isBind()) {
                            HTSPTG.down = obj;
                        }

                        break;
                    }
                }
            }

        };

        function onMouseMove(event) {

            mouse.x = (event.clientX - (HTSPTG.container.offsetWidth / 2));
            mouse.y = -(event.clientY - (HTSPTG.container.offsetHeight / 2));
            mouse.z = 10;

            var dest = new THREE.Vector3(0, 0, -1);
            raycaster.set(mouse, dest);
            var intersects = raycaster.intersectObjects(HTSPTG.hotspotList);
            if (intersects.length > 0) {

                var oks = false;

                for (var i = 0; i < intersects.length; i++) {
                    var intersection = intersects[i];
                    obj = intersection.object;

                    if (obj.controller.itsActive > 0 && obj.material.opacity) {
                        if (HTSPTG.over) {
                            if (HTSPTG.over.controller.selector != obj.controller.selector) {
                                if (isFunction(HTSPTG.over.controller.onMouseOut)) {
                                    HTSPTG.over.controller.onMouseOut();
                                }
                                HTSPTG.over = false;
                            }

                        }

                        if (isFunction(obj.controller.onMouseOver)) {
                            obj.controller.onMouseOver();
                        } else if (isFunction(obj.controller.mouseOver)) {
                            obj.controller.mouseOver();
                        }

                        HTSPTG.over = obj;
                        oks = true;

                        break;
                    }

                }

                if (!oks) {
                    if (HTSPTG.over) {
                        if (isFunction(HTSPTG.over.controller.onMouseOut)) {
                            HTSPTG.over.controller.onMouseOut();
                        } else if (isFunction(obj.controller.mouseOut)) {
                            obj.controller.mouseOut();
                        }
                        HTSPTG.over = false;
                    }
                }

            } else if (HTSPTG.over) {
                if (isFunction(HTSPTG.over.controller.onMouseOut)) {
                    HTSPTG.over.controller.onMouseOut();
                }
                HTSPTG.over = false;
            }
        };


        function onMouseUp(event) {

            mouse.x = (event.clientX - (HTSPTG.container.offsetWidth / 2));
            mouse.y = -(event.clientY - (HTSPTG.container.offsetHeight / 2));
            mouse.z = 10;

            var dest = new THREE.Vector3(0, 0, -1);
            raycaster.set(mouse, dest);
            var intersects = raycaster.intersectObjects(HTSPTG.hotspotList);
            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    var intersection = intersects[i];
                    obj = intersection.object;

                    if (obj.controller.itsActive > 0 && obj.material.opacity) {
                        if (isFunction(obj.controller.onMouseUp)) {
                            obj.controller.onMouseUp();
                        } else if (isFunction(obj.controller.mouseUp)) {
                            obj.controller.mouseUp();
                        }

                        if (!HTSPTG.down) {
                            return;
                        }

                        if (!obj.controller.isBind()) {
                            HTSPTG.down = false;
                            return;
                        }

                        if (obj.material) {
                            obj.material.color.setHex(0xffffff);
                        }

                        if (HTSPTG.down.controller.selector == obj.controller.selector) {
                            HTSPTG.down = false;

                            if (isFunction(obj.controller.onClick)) {
                                obj.controller.onClick();
                            } else if (isFunction(obj.controller.click)) {
                                obj.controller.click();
                            }
                        }

                        break;
                    }
                }
            }



        };

        function getPos(el) {
            // yay readability
            for (var lx = 0, ly = 0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
            return {
                x: lx,
                y: ly
            };
        };
        HTSPTG.initialized = true;
    },
    onResizeFunc: function() {
        this.orthoCamera.left = -this.container.offsetWidth / 2;
        this.orthoCamera.right = this.container.offsetWidth / 2;
        this.orthoCamera.top = this.container.offsetHeight / 2;
        this.orthoCamera.bottom = -this.container.offsetHeight / 2;
        this.orthoCamera.updateProjectionMatrix();
    },
    update: function() {
        this.renderer.clearDepth();
        this.renderer.render(this.orthoScene, this.orthoCamera);
    }
};

THREE.threeDataConfig = {};

THREE.Hotspot = function(imgURL, rangeAngle, directionAngle) {
    THREE.Object3D.call(this);

    // API
    this.itsActive = true;
    this.offset = {
        x: 0,
        y: 0
    };
    this.pivotPoint = THREE.HotspotPivotPoints.BOTTOM_LEFT;

    // Internals
    this.hsptImg;
    this.selector = generateUUID(); // asign uuid
    this.rangeAngle = rangeAngle;
    this.directionAngle = directionAngle;
    this.alpha = 1;

    // by global
    this.renderer = THREE.threeDataConfig.renderer;
    this.camera = THREE.threeDataConfig.camera;
    this.container = THREE.threeDataConfig.renderer.domElement;

    if (!THREE.HotspotGlobals.orthoCamera) {
        //console.log('pixel ratio: ', window.devicePixelRatio);
        if (window.devicePixelRatio > 1) {
            THREE.HotspotGlobals.orthoCamera = new THREE.OrthographicCamera(-this.container.offsetWidth / 2, this.container.offsetWidth / 2, this.container.offsetHeight / 2 + 50, -this.container.offsetHeight / 2 - 50, 1, 1000000);
        } else {
            THREE.HotspotGlobals.orthoCamera = new THREE.OrthographicCamera(-this.container.offsetWidth / 2, this.container.offsetWidth / 2, this.container.offsetHeight / 2, -this.container.offsetHeight / 2, 1, 1000000);
        }
        THREE.HotspotGlobals.orthoCamera.position.z = 10;
    }
    if (!THREE.HotspotGlobals.orthoScene) {
        THREE.HotspotGlobals.orthoScene = new THREE.Scene();
    }
    if (!THREE.HotspotGlobals.container) {
        THREE.HotspotGlobals.container = THREE.threeDataConfig.renderer.domElement;
    }
    if (!THREE.HotspotGlobals.renderer) {
        THREE.HotspotGlobals.renderer = THREE.threeDataConfig.renderer;
    }
    if (!THREE.HotspotGlobals.initialized) {
        THREE.HotspotGlobals.init(this.container);
    }

    var width, height;
    var HP = this;
    var material = new THREE.SpriteMaterial({
        map: THREE.ImageUtils.loadTexture(imgURL, undefined, function() {
            HP.hosptWidth = material.map.image.width / 2;
            HP.hosptHeight = material.map.image.height / 2;
            HP.hsptImg.scale.set(HP.hosptWidth, HP.hosptHeight, 1);
        })
    });
    this.hsptImg = new THREE.Sprite(material);
    this.hsptImg.controller = this;
    THREE.HotspotGlobals.orthoScene.add(this.hsptImg);
    THREE.HotspotGlobals.hotspotList.push(this.hsptImg);
};

THREE.Hotspot.prototype = Object.create(THREE.Object3D.prototype);
THREE.Hotspot.prototype.constructor = THREE.Hotspot;

THREE.Hotspot.prototype.update = function() {
    this.updateElementPos();
    this.updateElementAlpha();
    this.checkIfBehindCamera();
};


THREE.Hotspot.prototype.isBind = function() {
    if (this.onClick) {
        return true
    } else if (this.click) {
        return true
    } else {
        return false;
    }
};


THREE.Hotspot.prototype.updateElementPos = function() {

    var halfWidth = this.container.offsetWidth / 2;
    var halfHeight = this.container.offsetHeight / 2;

    if (this.autoUpdate != false) {
        var proj = this.toScreenPosition();
    }

    var x = 0,
        y = 0;
    switch (this.pivotPoint) {
        case THREE.HotspotPivotPoints.TOP_LEFT:
            x = proj.x + (this.hosptWidth / 2);
            y = proj.y + (this.hosptHeight / 2);
            break;
        case THREE.HotspotPivotPoints.TOP:
            x = proj.x;
            y = proj.y + (this.hosptHeight / 2);
            break;
        case THREE.HotspotPivotPoints.TOP_RIGHT:
            x = proj.x - (this.hosptWidth / 2);
            y = proj.y + (this.hosptHeight / 2);
            break;
        case THREE.HotspotPivotPoints.RIGHT:
            x = proj.x - (this.hosptWidth / 2);
            y = proj.y;
            break;
        case THREE.HotspotPivotPoints.BOTTOM_RIGHT:
            x = proj.x - (this.hosptWidth / 2);
            y = proj.y - (this.hosptHeight / 2);
            break;
        case THREE.HotspotPivotPoints.BOTTOM:
            x = proj.x;
            y = proj.y - (this.hosptHeight / 2);
            break;
        case THREE.HotspotPivotPoints.BOTTOM_LEFT:
            x = proj.x + (this.hosptWidth / 2);
            y = proj.y - (this.hosptHeight / 2);
            break;
        case THREE.HotspotPivotPoints.LEFT:
            x = proj.x + (this.hosptWidth / 2);
            y = proj.y;
            break;
        case THREE.HotspotPivotPoints.CENTER:
            x = proj.x;
            y = proj.y;
            break;
    }

    var rpx = -(halfWidth - (x + this.offset.x));
    var rpy = (halfHeight - (y - this.offset.y));
    this.hsptImg.position.set(rpx, rpy, 0);
};

THREE.Hotspot.prototype.toScreenPosition = function() {
    var vector = new THREE.Vector3();

    this.widthHalf = 0.5 * this.renderer.context.canvas.width;
    this.heightHalf = 0.5 * this.renderer.context.canvas.height;

    this.updateMatrixWorld();
    vector.setFromMatrixPosition(this.matrixWorld);
    vector.project(this.camera);

    vector.x = (vector.x * this.widthHalf) + this.widthHalf;
    vector.y = -(vector.y * this.heightHalf) + this.heightHalf;

    vector.x = (vector.x / window.devicePixelRatio);
    vector.y = (vector.y / window.devicePixelRatio);

    return {
        x: vector.x,
        y: vector.y
    };
};


THREE.Hotspot.prototype.updateElementAlpha = function() {
    if (this.itsActive) {
        if (this.rangeAngle !== 360) {
            var angleDeg = Math.atan2(this.camera.position.z - this.position.z, this.camera.position.x - this.position.x) * 180 / Math.PI;
            var angle = angleDeg + 90 + this.directionAngle;

            if (angle > 360)
                angle = -(angle - 360);
            if (angle < 0)
                angle = 360 + angle;

            if (angle >= 180) {
                if (angle <= (this.rangeAngle + 180))
                    this.alpha = (((Math.abs((this.rangeAngle + 180) - angle) * 100)) / this.rangeAngle) / 100;
                else
                    this.alpha = 0;
            } else {
                if (angle >= (180 - this.rangeAngle))
                    this.alpha = (((Math.abs((360 - this.rangeAngle - 180) - angle) * 100)) / this.rangeAngle) / 100;
                else
                    this.alpha = 0;
            }

            if (angle <= 0)
                this.alpha = 0;

            this.hsptImg.material.opacity = this.alpha;
        } else {
            this.hsptImg.material.opacity = 1;
        }
    } else {
        this.hsptImg.material.opacity = 0;
    }
};

THREE.Hotspot.prototype.checkIfBehindCamera = function(){
        var cameraFoward = this.camera.getWorldDirection();
        var vectorToHotspot = new THREE.Vector3();
        vectorToHotspot.subVectors(this.position, this.camera.position);
        if(cameraFoward.dot(vectorToHotspot) < 0){
            this.hsptImg.visible = false;
        } else {
            this.hsptImg.visible = true;
        }
}

THREE.Hotspot.prototype.disable = function() {
    this.itsActive = false;
};

THREE.Hotspot.prototype.enable = function() {
    this.itsActive = true;
};

THREE.Hotspot.prototype.hide = function() {
    this.hsptImg.material.opacity = 0;
    this.originalItsActive = this.itsActive;
    this.itsActive = false;
};

THREE.Hotspot.prototype.show = function() {
    this.hsptImg.material.opacity = 1;
    this.itsActive = this.originalItsActive || true;
};

// retro-compatibility 
THREE.Hotspot.prototype.turnOff = function() {
    this.hsptImg.material.opacity = 0;
    this.originalItsActive = this.itsActive;
    this.itsActive = false;
};

THREE.Hotspot.prototype.turnOn = function() {
    this.hsptImg.material.opacity = 1;
    this.itsActive = this.originalItsActive || true;
};


THREE.HotspotPivotPoints = {
    TOP_LEFT: 0,
    TOP: 1,
    TOP_RIGHT: 2,
    RIGHT: 3,
    BOTTOM_RIGHT: 4,
    BOTTOM: 5,
    BOTTOM_LEFT: 6,
    LEFT: 7,
    CENTER: 8
};

export default THREE
