<template>
  <div class="demos">
    <div class="demos-content">
      <ul class="demos-menu">
        <li class="demos-menu-title">demos</li>
        <li class="demos-menu-item">
          <router-link to="demo-pano">basic panorama</router-link>
        </li>
        <li class="demos-menu-item">
          <router-link to="demo-cube-pano">Cube Faces</router-link>
        </li>
        <li class="demos-menu-item">
          <router-link to="demo-video-pano">Video Pano</router-link>
        </li>
        <li class="demos-menu-item">
          <router-link to="demo-tour">VR Tour</router-link>
        </li>
      </ul>

      <div class="demos-pages">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}

</script>

<style>
* {
    margin: 0;
    border: 0;
    padding: 0;
    box-sizing: border-box;
}

ul,
ol,
li {
    list-style: none;
}

a {
    color: #657180;
    text-decoration: none;
}

html,
body,
.demos {
    width: 100%;
    height: 100%;
    color: #657180;
}

body {
    background: #eee;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
    background: #fff;
}

.demos-header {
    position: absolute;
    top: 0;
    width: 100%;
    background: #f3f6fb;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    border-bottom: solid 1px #dfe2e7;
    padding: 15px 15px 15px 30px;
    line-height: 20px;
}

.demos-header .title {
    font-weight: bold;
    font-size: 18px;
    display: inline-block;
}

.demos-header .github {
    color: #39f;
    display: inline-block;
    font-size: 12px;
    float: right;
}

.demos-content {
    width: 100%;
    height: 100%;
    padding-top: 52px;
    overflow: hidden;
}

.demos-menu {
    float: left;
    width: 230px;
    height: 100%;
    border-right: solid 1px #dfe2e7;
    padding: 10px 30px;
}

.demos-menu .demos-menu-item {
    display: block;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    cursor: pointer;
}

.demos-menu .demos-menu-item>a {
    display: block;
    width: 100%;
    height: 100%;
}

.demos-menu .demos-menu-title {
    display: block;
    width: 100%;
    padding: 6px 0;
    margin-top: 10px;
    font-size: 14px;
    font-weight: bold;
}

.demos-menu .demos-menu-item:hover>a {
    color: #39f;
}

.demos-pages {
    height: 100%;
    overflow: hidden;
}

.demo-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
}

.demo-loading::before {
    content: '';
    border-radius: 100%;
    margin: 2px;
    border: 3px solid #20a0ff;
    border-bottom-color: transparent;
    height: 36px;
    width: 36px;
    display: inline-block;
    animation: loading-rotate .75s 0s linear infinite;
    vertical-align: middle;
}

.demo-loading::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
}

@keyframes loading-rotate {
    0% {
        transform: rotate(0) scale(1);
    }
    50% {
        transform: rotate(180deg) scale(.6);
    }
    100% {
        transform: rotate(360deg) scale(1);
    }
}
</style>
