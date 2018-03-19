<template>
    <demo-block :vue-code="code" :html-code="htmlCode">
        <template slot="preview">
            <Pano
                @on-load="onLoad"
                src="./../assets/equirectangular.jpg"></Pano>
            <div class="demo-loading" v-show="loading"></div>
        </template>
    </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block';
import Pano from '../../src/Pano.vue'

const code = `
<template>
    <Pano
        @on-load="onLoad"
        src="./../assets/equirectangular.jpg">
    </Pano>
</template>

<script>
    import { Pano } from 'vue-vr'

    export default {
        components: {
            Pano
        }
    }
<\/script>
`

const htmlCode = `
<body>
    <div id="app">
        <Pano
            @on-load="onLoad"
            type='cube'
            source="./../assets/equirectangular.jpg">
        </Pano>
    </div>
    #scripts#
    <script>
        new Vue({
            el: '#app'
        })
    <\/script>
</body>
`

export default {
    name: 'demo-video-pano',
    data () {
    	return {
            code,
            htmlCode,
            loading: true
    	}
    },
    methods: {
        onLoad () {
            this.loading = false;
        }
    },
    components: {
        Pano,
        DemoBlock
    }
}
</script>
