<template>
  <div style="width: 100%; height: 100%; margin: 0; border: 0; padding: 0;">
  </div>
</template>

<script>
import PanoLens from './lib/panolens'

export default {
  props: {
    source: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'image'
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      size: {
        width: this.width,
        height: this.height
      },
      viewer: null,
      panorama: null
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

    this.loadPano()
  },
  watch: {
    source () {
      if (!this.viewer) return
      if (!this.panorama) return
      this.loadPano()
    }
  },
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
    loadPano () {
      console.log('this.source = ' + this.source)
      if (!this.source) return

      switch (this.type) {
        case 'cube':
          var l = this.source.replace('%s', 'l')
          var f = this.source.replace('%s', 'f')
          var r = this.source.replace('%s', 'r')
          var b = this.source.replace('%s', 'b')
          var u = this.source.replace('%s', 'u')
          var d = this.source.replace('%s', 'd')
          this.panorama = new PanoLens.CubePanorama([r, l, u, d, f, b])
          break
        case 'video':
          this.panorama = new PanoLens.VideoPanorama(this.source, { autoplay: true })
          console.log('this is video')
          break
        default:
          this.panorama = new PanoLens.ImagePanorama(this.source)
          break
      }

      this.viewer.add(this.panorama)

      const that = this
      this.panorama.addEventListener('load', () => {
        that.$emit('on-load')
      })
    }
  }
}
</script>
