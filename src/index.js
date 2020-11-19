import Vue from 'vue';
import Pano from './Pano.vue';
import Scene from './Scene.vue';
import Tour from './Tour.vue';

const components = [Pano, Tour, Scene];

const install = Vue => {
  components.map(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export { install, Pano, Scene, Tour };
