# Vue VR
A framework for building VR applications with Vue
based on Threejs and Panolensjs, inspired by [react-vr](https://github.com/facebook/react-vr)

## Example
[BASIC PANORAMA DEMO](https://imudin.github.io/vuejs-vr/#/demo-pano)
[CUBE DEMO](https://imudin.github.io/vuejs-vr/#/demo-cube-pano)

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