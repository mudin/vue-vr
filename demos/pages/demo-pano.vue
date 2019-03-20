<template>
  <demo-block
    :vue-code="code"
    :html-code="htmlCode">

    <template slot="preview">
      <div class="info">
        Pano index:{{ index }}
        <button @click="change">Toggle</button>
      </div>
      <Pano
        @on-load="onLoad"
        :source="urls[index]"></Pano>
      <div
        class="demo-loading"
        v-show="loading"/>
    </template>
  </demo-block>
</template>

<script>
import Pano from '../../src/Pano.vue'
import DemoBlock from '../components/demo-block.vue'

/* eslint-disable no-useless-escape */
const code = `
<template>
    <Pano
        @on-load="onLoad"
        :source="urls[index]">
    </Pano>
</template>

<script>
    import { Pano } from 'vue-vr'

    export default {
        components: {
            Pano
        },
        data () {
          return {
            urls: [
              '../assets/equirectangular.jpg',
              '../assets/pano.png'
            ],
            index: 0
          }
        },
    }
<\/script>
`

const htmlCode = `
<body>
    <div id="app">
        <Pano
            @on-load="onLoad"
            :source="urls[index]">
        </Pano>
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
  name: 'DemoPano',
  data () {
    return {
      code,
      htmlCode,
      loading: true,
      urls: [
        '/assets/equirectangular.jpg',
        '/assets/pano.png'
      ],
      index: 0
    }
  },
  methods: {
    onLoad () {
      this.loading = false
    },
    change () {
      this.index = 1 - this.index
    }
  },
  components: {
    Pano,
    DemoBlock
  }
}
</script>

<style lang="less" scoped>
  .info {
    position: absolute;
    top: 30px;
    left: 10%;

    button {
      padding: 10px;
      cursor: pointer;
    }
  }
</style>
