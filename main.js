import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false


import {Base} from './common/js/base.js';
Vue.prototype.$base =  new Base();


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
