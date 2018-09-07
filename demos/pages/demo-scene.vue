<template>
  <demo-block
    :vue-code="code"
    :html-code="htmlCode">
    <template slot="preview">
      <Scene
        @on-load-start="onLoadStart"
        @on-load="onLoad"
        :pano='scene.pano'
        :position='scene.position'
        :rotation='scene.rotation'
        :links='scene.links'>
      </Scene>
      <div
        class="demo-loading"
        v-show="loading">
      </div>
    </template>
  </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block'
import Scene from '../../src/Scene.vue'

/* eslint-disable no-useless-escape */
const code = `
<template>
    <Scene
        @on-load="onLoad"
        :scene='scene'>

    </Scene>
    <div
      class="demo-loading"
      v-show="loading"></div>
      
</template>

<script>
    import { Scene } from 'vue-vr'

    export default {
        components: {
            Scene
        },
        data(){
          return {
            scene: {
              key: 'M4wOy2s',
              panorama: {
                source: 'assets/equirectangular.jpg',
                type: 'image'
              },
              x: 0,
              y: 0,
              z: 0,
              rotation:90
            }
          }
        }
    }
<\/script>`

const htmlCode = `
<body>
    <div id="app">
        <Scene
          @on-load="onLoad"
          :scene='scene'>
      </Scene>
      <div
        class="demo-loading"
        v-show="loading"></div>
    </div>
    #scripts#
    <script>
        new Vue({
            el: '#app'
        })
    <\/script>
</body>`
/* eslint-enable no-useless-escape */

export default {
  name: 'DemoScene',
  data () {
    return {
      code,
      htmlCode,
      loading: true,
      scene: {
        pano: {
          source: 'assets/faces/pano_%s.jpg',
          type: 'cube'
        },
        position: {
          x: 0,
          y: 0,
          z: 0
        },
        rotation: {
          x: 0,
          y: 135.0 * Math.PI / 180.0,
          z: 0
        },
        links: [
          {
            sceneId: 'scene1',
            position: {
              x: 100,
              y: 0,
              z: -100
            }
          },
          {
            sceneId: 'scene2',
            position: {
              x: 200,
              y: 0,
              z: -20
            }
          }
        ]
      }
    }
  },
  methods: {
    onLoad () {
      console.log('onLoad')
      this.loading = false
    },
    onLoadStart () {
      console.log('onLoadStart')
      this.loading = true
    }
  },
  components: {
    Scene,
    DemoBlock
  }
}
</script>
