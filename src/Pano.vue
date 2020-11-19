<template>
  <div class="v-pano"></div>
</template>

<script>
import * as PanoLens from './lib/panolens';
const _log = console.log.bind(console);

export default {
  name: 'Pano',

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

  data() {
    return {
      size: {
        width: this.width,
        height: this.height
      },
      viewer: null,
      panorama: null
    };
  },

  created() {
    window.addEventListener('resize', this.onResize, false);
  },

  destroyed() {
    if (this.panorama && this.panorama.dispose) {
      this.panorama.dispose();
    }
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

    this.loadPano();
  },
  watch: {
    source() {
      if (!this.viewer) return;
      if (!this.panorama) return;
      this.loadPano();
    }
  },

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
    loadPano() {
      _log('this.source = ' + this.source);
      if (!this.source) return;

      let pano;
      switch (this.type) {
        case 'cube':
          var l = this.source.replace('%s', 'l');
          var f = this.source.replace('%s', 'f');
          var r = this.source.replace('%s', 'r');
          var b = this.source.replace('%s', 'b');
          var u = this.source.replace('%s', 'u');
          var d = this.source.replace('%s', 'd');
          pano = new PanoLens.CubePanorama([r, l, u, d, f, b]);
          break;
        case 'video':
          pano = new PanoLens.VideoPanorama(this.source, {
            autoplay: true
          });
          break;
        default:
          pano = new PanoLens.ImagePanorama(this.source);
          break;
      }
      this.setPano(pano);
    },
    setPano(pano) {
      if (!pano) return;
      if (this.panorama) {
        this.viewer.remove(this.panorama);
      }
      this.panorama = pano;
      this.viewer.add(this.panorama);
      this.viewer.setPanorama(this.panorama);

      const that = this;
      this.panorama.addEventListener('load', () => {
        that.$emit('on-load');
      });
    }
  }
};
</script>

<style lang="less">
.v-pano {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
