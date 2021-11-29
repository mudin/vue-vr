<template>
  <div
    style="width: 100%; height: 100%; margin: 0; border: 0; padding: 0;"
  ></div>
</template>

<style scoped>
div {
  cursor: pointer;
}
</style>

<script>
import * as PanoLens from './lib/panolens';
import * as THREE from 'three';
const _log = console.log.bind(console);

export default {
  name: 'Tour',
  props: {
    scenes: {
      type: Array,
      default: () => {
        return [];
      }
    },
    sceneIndex: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: undefined
    },
    height: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      size: {
        width: this.width,
        height: this.height
      },
      scene_index: -1,
      viewer: null,
      panorama: null,
      hotspots: [],
      arrowGroup: null
    };
  },
  created() {
    window.addEventListener('resize', this.onResize, false);
  },
  mounted() {
    if (this.width === undefined || this.height === undefined) {
      this.size = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      };
    }

    this.viewer = new PanoLens.Viewer({
      container: this.$el,
      cameraFov: 100
    });
    if (this.scene_index === -1) {
      this.loadScene(this.sceneIndex);
    }
  },
  // watch: {
  //   scenes () {
  //     if (!this.viewer) return
  //     if (!this.scenes || this.scenes.length === 0) return
  //     this.loadScene()
  //   }
  // },
  methods: {
    onResize() {
      if (this.width === undefined || this.height === undefined) {
        this.$nextTick(() => {
          this.size = {
            width: this.$el.offsetWidth,
            height: this.$el.offsetHeight
          };
        });
      }
    },
    getSceneIndexByKey(key) {
      for (let i = 0; i < this.scenes.length; i++) {
        if (this.scenes[i].key === key) {
          return i;
        }
      }
      return -1;
    },
    loadScene(index) {
      this.$emit('on-load-start');
      _log('this.scenes = ' + this.scenes);
      if (!this.scenes || this.scenes.length === 0) return;

      if (this.scene_index === index) return;

      this.scene_index = index;

      let scene = this.scenes[index];

      let pano = scene.panorama;
      let source = pano.source;

      switch (pano.type) {
        case 'cube':
          let l = source.replace('%s', 'l');
          let f = source.replace('%s', 'f');
          let r = source.replace('%s', 'r');
          let b = source.replace('%s', 'b');
          let u = source.replace('%s', 'u');
          let d = source.replace('%s', 'd');
          this.panorama = new PanoLens.CubePanorama([r, l, u, d, f, b]);
          break;
        case 'video':
          this.panorama = new PanoLens.VideoPanorama(source, {
            autoplay: true
          });
          _log('this is video');
          break;
        default:
          this.panorama = new PanoLens.ImagePanorama(source);
          break;
      }

      this.viewer.camera.near = 0.001;
      this.viewer.camera.position.set(scene.x, scene.y, scene.z);

      this.viewer.camera.translateZ(1);

      this.viewer.add(this.panorama);

      this.viewer.panorama.rotation.set(0, Math.PI, 0);
      this.panorama.parent.rotation.set(0, Math.PI, 0);
      this.viewer.panorama.position.set(scene.x, scene.y, scene.z);

      this.viewer.control.target = this.viewer.panorama.position;

      _log(this.viewer);
      _log('panorama = ', this.panorama);

      // remove arrows if exist
      if (this.arrowGroup) {
        this.viewer.remove(this.arrowGroup);
      }

      // remove hotspots if exist
      if (this.hotspots) {
        this.hotspots.forEach(hotspot => {
          this.viewer.remove(hotspot);
        });
      }

      // add hotspots

      this.arrowGroup = new THREE.Object3D();

      scene.connections.forEach(key => {
        _log('connections key = ', key);
        let index = this.getSceneIndexByKey(key);
        _log('connections index = ', index);
        if (index === -1) return;

        let hotspot = addHotspot(scene, this.scenes[index]);
        this.viewer.add(hotspot);

        this.hotspots.push(hotspot);

        let arrow = addArrow(scene, this.scenes[index]);

        arrow.addEventListener('mouseover', () => {
          _log('hoverred');
        });

        this.arrowGroup.add(arrow);
      });

      let that = this;

      let raycaster = new THREE.Raycaster();

      let INTERSECTED = null;

      this.viewer.container.addEventListener('click', event => {
        if (Date.now() - timeStamp < rate) return;

        if (INTERSECTED) {
          _log(INTERSECTED.targetScene);
          // let index = that.getSceneIndexByKey(INTERSECTED.targetScene.key)

          alert('TODO: move to next scene ' + INTERSECTED.targetScene.key);

          // todo move to scene
          // that.panorama.dispose()

          // this.$emit('on-load-start')

          // setTimeout(that.loadScene(index), 10)
          // timeStamp = Date.now()
          // INTERSECTED = null
        }
      });

      // this.viewer.container.addEventListener('mousemove', (event) => {
      //   // _log(e)

      //   let mouse = new THREE.Vector2()
      //   let camera = that.viewer.camera
      //   mouse.x = ((event.clientX - that.$el.parentElement.offsetLeft) / that.viewer.container.offsetWidth) * 2 - 1
      //   mouse.y = -((event.clientY - that.$el.parentElement.offsetTop) / that.viewer.container.offsetHeight) * 2 + 1

      //   raycaster.setFromCamera(mouse, camera)

      //   let	intersects = raycaster.intersectObjects(that.viewer.scene.children, true)

      //   let intersectedObject = null

      //   if (intersects.length >= 0) {
      //     intersects.forEach((intersect, index) => {
      //       if (intersect.object.type === 'hotspot' || intersect.object.type === 'arrow') {
      //         intersectedObject = intersect.object
      //       }
      //     })
      //   }

      //   if (intersectedObject) {
      //     if (INTERSECTED) {
      //       if (INTERSECTED.material.color) {
      //         INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
      //       }

      //       INTERSECTED.scale.set(1, 1, 1)
      //     }
      //     // store reference to closest object as current intersection object
      //     INTERSECTED = intersects[0].object
      //     // store color of closest object (for later restoration)
      //     if (INTERSECTED.material.color) {
      //       INTERSECTED.currentHex = INTERSECTED.material.color.getHex()
      //     }
      //     // set a new color for closest object
      //     if (INTERSECTED.material.color) {
      //       INTERSECTED.material.color.setHex(0xffff00)
      //     }
      //     INTERSECTED.scale.set(1.2, 1.2, 1.2)
      //   } else {
      //     // restore previous intersection object (if it exists) to its original color
      //     if (INTERSECTED) {
      //       if (INTERSECTED.material.color) {
      //         INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
      //       }
      //       INTERSECTED.scale.set(1, 1, 1)
      //     }
      //     // remove previous intersection object reference
      //     //     by setting current intersection object to "nothing"
      //     INTERSECTED = null
      //   }
      // })

      // this.viewer.addUpdateCallback(function () {
      //   // if (objects.length > 0) {
      //   //   this.position.copy(objects[0].origin)
      //   // } else {

      //   // }

      //   this.position.copy(that.viewer.control.target)
      //   // this.rotation.y = that.viewer.camera.rotation.y
      //   this.rotation.z = that.viewer.camera.rotation.z
      //   // this.rotation.x = that.viewer.camera.rotation.x
      //   this.translateZ(0)
      //   this.translateX(0)
      //   this.translateY(-1)
      //   this.translateZ(0)

      //   // this.scale.set(that.viewer.zoom)
      // }.bind(this.arrowGroup))

      this.viewer.add(this.arrowGroup);
      // If you want a visible bounding box

      // this.viewer.add(helper)

      this.panorama.addEventListener('load', () => {
        that.$emit('on-load');
      });
    }
  }
};

let rate = 1000;
let timeStamp = Date.now() - rate;

function addHotspot(scene, targetScene) {
  let pos = {
    x: targetScene.x,
    y: targetScene.y,
    z: targetScene.z
  };

  let geometry = new THREE.RingGeometry(8, 13, 100, 100);
  let material = new THREE.MeshPhongMaterial({
    color: 1668818,
    emissive: 0xffffff,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    polygonOffset: !0,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4
  });

  let geometryBorder = new THREE.CircleGeometry(9, 32, 32);
  let materialBorder = new THREE.MeshPhongMaterial();
  materialBorder.copy(material);

  materialBorder.opacity = 0.5;

  let circle = new THREE.Mesh(geometryBorder);

  let hotspot = new THREE.Mesh(geometry);

  let merged = new THREE.Geometry();

  circle.updateMatrix();
  merged.merge(circle.geometry, circle.matrix, 0);
  hotspot.updateMatrix();

  merged.merge(hotspot.geometry, hotspot.matrix, 1);

  let group = new THREE.Mesh(
    merged,
    new THREE.MeshFaceMaterial([material, materialBorder])
  );

  group.rotation.set(toRadian(90), 0, 0);
  group.position.set(pos.x, pos.y - 100, pos.z);

  group.type = 'hotspot';

  group.targetScene = targetScene;

  return group;
}

function addArrow(scene, targetScene) {
  let arrowGeometry = makeArrowGeometry();
  let arrowMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.8,
    color: 1668818,
    emissive: 0xffffff,
    side: THREE.DoubleSide,
    polygonOffset: !0,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4
  });

  let arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);

  let x1 = targetScene.x;
  let z1 = targetScene.z;
  let x2 = scene.x;
  let z2 = scene.z;

  let ath = toDegree(Math.atan2(z1 - z2, x1 - x2));

  arrow.rotation.set(toRadian(90), 0, toRadian(ath));

  let arrowPos = sphereToWorld(ath, 0);

  arrow.position.set(arrowPos.x, arrowPos.y, arrowPos.z);
  arrow.type = 'arrow';
  arrow.targetScene = targetScene;
  return arrow;
}

function makeArrowGeometry() {
  let t = 1 / 10.0;
  let i = (2 * t) / 3;
  let n = t * Math.cos(60 * THREE.Math.DEG2RAD);
  let r = t * Math.sin(60 * THREE.Math.DEG2RAD);
  let o = new THREE.Shape();
  o.moveTo(i, 0);
  o.lineTo(i - n, r);
  o.lineTo(-n, r);
  o.lineTo(0, 0);
  o.lineTo(-n, -r);
  o.lineTo(i - n, -r);
  o.lineTo(i, 0);
  return new THREE.ShapeGeometry(o);
}

function sphereToWorld(ath, atv) {
  let d = 1 / 2.0;
  ath += 90;
  let mY = -d * Math.sin(toRadian(atv));
  let r = -d * Math.cos(toRadian(atv));
  let mX = r * Math.sin(toRadian(-ath));
  let mZ = r * Math.cos(toRadian(-ath));

  return new THREE.Vector3(mX, mY, mZ);
}
function toRadian(a) {
  return (a * Math.PI) / 180.0;
}

function toDegree(a) {
  return (a * 180.0) / Math.PI;
}
</script>
