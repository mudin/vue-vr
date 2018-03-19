import Vue from 'vue'
import Router from 'vue-router'

import { pages } from '../pages'

Vue.use( Router )

const routes = pages.map( page => {
    
    const name = page.name;

    return {
        path: `/${ name }`,
        name,
        component: page
    }
} )

console.log(routes);

routes.push( {
    path: '*',
    redirect: '/demo-pano'
} )

export default new Router( { routes } )