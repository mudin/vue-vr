<template>
  <div style="width: 100%; height: 100%; margin: 0; border: 0; padding: 0;">
  </div>
</template>

<style scoped>
  div{
    cursor: pointer;
  }
</style>

<script>
import PanoLens from './lib/panolens'
import * as THREE from 'three'
import {Hotspot} from './lib/hotspots'
export default {
  name: 'Tour',
  props: {
    scenes: {
      type: Array,
      default: () => { return [] }
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
  data () {
    return {
      size: {
        width: this.width,
        height: this.height
      },
      scene_index: -1,
      viewer: null,
      panorama: null,
      hotspots: []
    }
  },
  created () {
    window.addEventListener('resize', this.onResize, false)
  },
  mounted () {
    if (this.width === undefined || this.height === undefined) {
      this.size = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      }
    }

    this.viewer = new PanoLens.Viewer({
      container: this.$el,
      cameraFov: 100
    })

    this.loadScene()
  },
  // watch: {
  //   scenes () {
  //     if (!this.viewer) return
  //     if (!this.scenes || this.scenes.length === 0) return
  //     this.loadScene()
  //   }
  // },
  methods: {
    onResize () {
      if (this.width === undefined || this.height === undefined) {
        this.$nextTick(() => {
          this.size = {
            width: this.$el.offsetWidth,
            height: this.$el.offsetHeight
          }
        })
      }
    },
    getSceneIndexByKey (key) {
      for (let i = 0; i < this.scenes.length; i++) {
        if (this.scenes[i].key === key) {
          return i
        }
      }
      return -1
    },
    loadScene () {
      console.log('this.scenes = ' + this.scenes)
      if (!this.scenes || this.scenes.length === 0) return

      var index = this.sceneIndex

      if (this.scene_index === -1) {
        this.scene_index = this.sceneIndex
      } else {
        index = this.scene_index
      }

      var scene = this.scenes[index]

      var pano = scene.panorama
      var source = pano.source

      switch (pano.type) {
        case 'cube':
          var l = source.replace('%s', 'l')
          var f = source.replace('%s', 'f')
          var r = source.replace('%s', 'r')
          var b = source.replace('%s', 'b')
          var u = source.replace('%s', 'u')
          var d = source.replace('%s', 'd')
          this.panorama = new PanoLens.CubePanorama([r, l, u, d, f, b])
          break
        case 'video':
          this.panorama = new PanoLens.VideoPanorama(source, { autoplay: true })
          console.log('this is video')
          break
        default:
          this.panorama = new PanoLens.ImagePanorama(source)
          break
      }
      this.viewer.add(this.panorama)

      this.viewer.camera.near = 0.001
      this.viewer.camera.target = this.panorama.position

      this.viewer.panorama.rotation.set(0, Math.PI, 0)
      this.panorama.parent.rotation.set(0, Math.PI, 0)

      this.viewer.panorama.position.set(scene.x, scene.y, scene.z)

      console.log(THREE.Hotspot)

      // add hotspots

      var group = new THREE.Object3D()

      scene.connections.forEach(key => {
        console.log(key)
        var index = this.getSceneIndexByKey(key)
        console.log(index)
        if (index === -1) return

        var hotspot = addHotspot(scene, this.scenes[index])
        this.viewer.add(hotspot)

        this.hotspots.push(hotspot)

        var arrow = addArrow(scene, this.scenes[index])

        arrow.addEventListener('mouseover', () => {
          console.log('hoverred')
        })

        group.add(arrow)
      })

      var that = this

      var raycaster = new THREE.Raycaster()

      var INTERSECTED = null

      this.viewer.container.addEventListener('click', (event) => {
        if (INTERSECTED) {
          console.log(INTERSECTED.targetScene)
          that.scene_index = that.getSceneIndexByKey(INTERSECTED.targetScene.key)

          that.viewer.remove(that.panorama)
          that.loadScene()
          INTERSECTED = null
        }
      })

      this.viewer.container.addEventListener('mousemove', (event) => {
        // console.log(e)

        var mouse = new THREE.Vector2()
        var camera = that.viewer.camera
        mouse.x = ((event.clientX - that.$el.parentElement.offsetLeft) / that.viewer.container.offsetWidth) * 2 - 1
        mouse.y = -((event.clientY - that.$el.parentElement.offsetTop) / that.viewer.container.offsetHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)

        var	intersects = raycaster.intersectObjects(that.viewer.scene.children, true)

        var intersectedObject = null

        if (intersects.length >= 0) {
          intersects.forEach((intersect, index) => {
            if (intersect.object.type === 'hotspot' || intersect.object.type === 'arrow') {
              intersectedObject = intersect.object
            }
          })
        }

        if (intersectedObject) {
          if (INTERSECTED) {
            if (INTERSECTED.material.color) {
              INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
            }

            INTERSECTED.scale.set(1, 1, 1)
          }
          // store reference to closest object as current intersection object
          INTERSECTED = intersects[0].object
          // store color of closest object (for later restoration)
          if (INTERSECTED.material.color) {
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex()
          }
          // set a new color for closest object
          if (INTERSECTED.material.color) {
            INTERSECTED.material.color.setHex(0xffff00)
          }
          INTERSECTED.scale.set(1.2, 1.2, 1.2)
        } else {
          // restore previous intersection object (if it exists) to its original color
          if (INTERSECTED) {
            if (INTERSECTED.material.color) {
              INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
            }
            INTERSECTED.scale.set(1, 1, 1)
          }
          // remove previous intersection object reference
          //     by setting current intersection object to "nothing"
          INTERSECTED = null
        }
      })

      this.viewer.addUpdateCallback(function () {
        // if (objects.length > 0) {
        //   this.position.copy(objects[0].origin)
        // } else {

        // }

        this.position.copy(that.viewer.control.target)
        // this.rotation.y = that.viewer.camera.rotation.y
        this.rotation.z = that.viewer.camera.rotation.z
        // this.rotation.x = that.viewer.camera.rotation.x
        this.translateZ(0)
        this.translateX(0)
        this.translateY(-1)
        this.translateZ(0)

        // this.scale.set(that.viewer.zoom)
      }.bind(group))

      this.viewer.add(group)
      // If you want a visible bounding box

      // this.viewer.add(helper)

      this.panorama.addEventListener('load', () => {
        that.$emit('on-load')
      })
    }
  }
}

function addHotspot (scene, targetScene) {
  var pos = {
    x: targetScene.x,
    y: targetScene.y,
    z: targetScene.z
  }

  var geometry = new THREE.RingGeometry(8, 13, 100, 100)
  var material = new THREE.MeshPhongMaterial({
    color: 1668818,
    emissive: 0xffffff,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    polygonOffset: !0,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4
  })

  var geometryBorder = new THREE.CircleGeometry(9, 32, 32)
  var materialBorder = new THREE.MeshPhongMaterial()
  materialBorder.copy(material)

  materialBorder.opacity = 0.5

  var circle = new THREE.Mesh(geometryBorder)

  var hotspot = new THREE.Mesh(geometry)

  var merged = new THREE.Geometry()

  circle.updateMatrix()
  merged.merge(circle.geometry, circle.matrix, 0)
  hotspot.updateMatrix()

  merged.merge(hotspot.geometry, hotspot.matrix, 1)

  var group = new THREE.Mesh(merged, new THREE.MeshFaceMaterial([material, materialBorder]))

  group.rotation.set(toRadian(90), 0, 0)
  group.position.set(pos.x, pos.y - 100, pos.z)

  group.type = 'hotspot'

  group.targetScene = targetScene

  return group
}

function addArrow (scene, targetScene) {
  var arrowGeometry = makeArrowGeometry()
  var arrowMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.8,
    color: 1668818,
    emissive: 0xffffff,
    side: THREE.DoubleSide,
    polygonOffset: !0,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4
  })

  var arrow = new THREE.Mesh(arrowGeometry, arrowMaterial)

  var x1 = targetScene.x
  var z1 = targetScene.z
  var x2 = scene.x
  var z2 = scene.z

  var ath = toDegree(Math.atan2((z1 - z2), (x1 - x2)))

  arrow.rotation.set(toRadian(90), 0, toRadian(ath))

  var arrowPos = sphereToWorld(ath, 0)

  arrow.position.set(arrowPos.x, arrowPos.y, arrowPos.z)
  arrow.type = 'arrow'
  arrow.targetScene = targetScene
  return arrow
}

function makeArrowGeometry () {
  var t = 1 / 10.0
  var i = 2 * t / 3
  var n = t * Math.cos(60 * THREE.Math.DEG2RAD)
  var r = t * Math.sin(60 * THREE.Math.DEG2RAD)
  var o = new THREE.Shape()
  o.moveTo(i, 0)
  o.lineTo(i - n, r)
  o.lineTo(-n, r)
  o.lineTo(0, 0)
  o.lineTo(-n, -r)
  o.lineTo(i - n, -r)
  o.lineTo(i, 0)
  return new THREE.ShapeGeometry(o)
}

function sphereToWorld (ath, atv) {
  var d = 1 / 2.0
  ath += 90
  var mY = -d * Math.sin(toRadian(atv))
  var r = -d * Math.cos(toRadian(atv))
  var mX = r * Math.sin(toRadian(-ath))
  var mZ = r * Math.cos(toRadian(-ath))

  return new THREE.Vector3(mX, mY, mZ)
}
function toRadian (a) {
  return a * Math.PI / 180.0
}

function toDegree (a) {
  return a * 180.0 / Math.PI
}
</script>
