<template>
  <demo-block
    :vue-code="code"
    :html-code="htmlCode">
    <template slot="preview">
      <Tour
        @on-load-start="onLoadStart"
        @on-load="onLoad"
        :scenes='scenes'>
      </Tour>
      <div
        class="demo-loading"
        v-show="loading"></div>
    </template>
  </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block'
import Tour from '../../src/Tour.vue'

/* eslint-disable no-useless-escape */
const code = `
<template>
    <Tour
        @on-load="onLoad"
        :scenes='scenes'>

    </Tour>
    <div
      class="demo-loading"
      v-show="loading"></div>
      
</template>

<script>
    import { Tour } from 'vue-vr'

    export default {
        components: {
            Tour
        },
        data(){
          return {
            scenes: [{
              key: 'M4wOy2s',
              panorama: {
                source: 'assets/equirectangular.jpg',
                type: 'image'
              },
              x: 0,
              y: 0,
              z: 0,
              rx: 0,
              rz: 0,
              ry: 90,
              connections: [
                'eIm7la',
                'eId9l0',
                'fK2dL7l'
              ]
            },
            {
              key: 'eIm7la',
              panorama: {
                source: 'assets/faces/pano_%s.jpg',
                type: 'cube'
              },
              x: 100,
              y: 0,
              z: 200,
              rx: 0,
              rz: 0,
              ry: 0,
              connections: [
                'M4wOy2s'
              ]
            },
            {
              key: 'eId9l0',
              panorama: {
                source: 'assets/faces/pano_%s.jpg',
                type: 'cube'
              },
              x: 150,
              y: 0,
              z: -300,
              rx: 0,
              rz: 0,
              ry: 0,
              connections: [
                'M4wOy2s'
              ]
            },
            {
              key: 'fK2dL7l',
              panorama: {
                source: 'assets/faces/pano_%s.jpg',
                type: 'cube'
              },
              x: -150,
              y: 0,
              z: -300,
              rx: 0,
              rz: 0,
              ry: 0,
              connections: [
                'M4wOy2s'
              ]
            }]
          }
        }
    }
<\/script>`

const htmlCode = `
<body>
    <div id="app">
        <Tour
          @on-load="onLoad"
          :scenes='scenes'>
      </Tour>
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
  name: 'DemoTour',
  data () {
    return {
      code,
      htmlCode,
      loading: true,
      scenes: [{
        key: 'M4wOy2s',
        panorama: {
          source: 'assets/equirectangular.jpg',
          type: 'image'
        },
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        rz: 0,
        ry: 90,
        connections: [
          'eIm7la',
          'eId9l0',
          'fK2dL7l'
        ]
      },
      {
        key: 'eIm7la',
        panorama: {
          source: 'assets/faces/pano_%s.jpg',
          type: 'cube'
        },
        x: 100,
        y: 0,
        z: 200,
        rx: 0,
        rz: 0,
        ry: 0,
        connections: [
          'M4wOy2s'
        ]
      },
      {
        key: 'eId9l0',
        panorama: {
          source: 'assets/faces/pano_%s.jpg',
          type: 'cube'
        },
        x: 150,
        y: 0,
        z: -300,
        rx: 0,
        rz: 0,
        ry: 0,
        connections: [
          'M4wOy2s'
        ]
      },
      {
        key: 'fK2dL7l',
        panorama: {
          source: 'assets/faces/pano_%s.jpg',
          type: 'cube'
        },
        x: -150,
        y: 0,
        z: -300,
        rx: 0,
        rz: 0,
        ry: 0,
        connections: [
          'M4wOy2s'
        ]
      }
      ]
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
    Tour,
    DemoBlock
  },
  mounted () {
    this.initialScene = this.scenes[0].key
  }
}
</script>
