# Vue VR
A framework for building VR applications with Vue
based on [threejs](https://threejs.org/) and [Panolens](https://pchen66.github.io/Panolens/), inspired by [react-vr](https://github.com/facebook/react-vr)

## Demos
[PANORAMA DEMO](https://imudin.github.io/vue-vr/#/demo-pano)

[CUBE DEMO](https://imudin.github.io/vue-vr/#/demo-cube-pano)

## Getting started
using npm
```
npm install vuejs-vr --save
```
Or using script tag for global use
```html
<script src="https://unpkg.com/vuejs-vr@1.0.3/dist/vue-vr.min.js"></script>
```

Or Download <a href="https://unpkg.com/vuejs-vr@1.0.3/dist/vue-vr.min.js">vue-vr.min.js</a> and include it in your html

## Usage

####For simple panorama:
Panorama by equirectangular image
```vue
<template>
    <Pano source="pano.jpg"></Pano>
</template>
<script>
    import { Pano } from 'vuejs-vr'

    export default {
        components: { Pano }
    }
</script>
```
Or
```vue
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div id="app">
        <Pano src="pano.jpg"></Pano>
    </div>
    <script src="vue.js"></script>
    <script src="vuejs-vr.js"></script>
    <script>
        new Vue({
            el: '#app'
        })
    </script>
</body>
```


####For cube faces:
Panorama with a six-face cubemap
```vue
<template>
    <Pano type='cube 'source="pano_%s.jpg"></Pano>
</template>
<script>
    import { Pano } from 'vuejs-vr'

    export default {
        components: { Pano }
    }
</script>
```
Note: `%s` replaced by `'l'|'f'|'r'|'b'|'u'|'d'`
Or
```vue
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div id="app">
        <Pano type='cube 'source="pano_%s.jpg"></Pano>
    </div>
    <script src="vue.js"></script>
    <script src="vuejs-vr.js"></script>
    <script>
        new Vue({
            el: '#app'
        })
    </script>
</body>
```

## TODO List
* 360 Video
* Hotspots

## Contributing
If you would like to contribute code you can do so through GitHub by forking the repository and sending a pull request.

## LICENSE
MIT