require('@/assets/js/flexible.js')
import '@/assets/css/normalize.css'
import Vue from 'vue'
import App from './App'

let lazy = require('@/assets/js/vue.lazy.js');
console.log(lazy)
//import lazy from '@/assets/js/vue.lazy.js'
//import { Lazyload } from 'mint-ui';
import Toast from '@/components/Toast';
import browser from '@/assets/js/browserUtil'


var T = Vue.extend(Toast);
var instance = new T({el:document.createElement('div')});
Vue.prototype.$toast = instance.show;
document.body.appendChild(instance.$el);

Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.prototype.$browser = browser;
browser.appendMtaH5();
browser.initPage((info) => {
	Vue.prototype.$info = info;
	init();
});
function init(){
	Vue.config.productionTip = false
	Vue.use(lazy)
	/* eslint-disable no-new */
	new Vue({
	  el: '#app',
	  template: '<App/>',
	  components: { App }
	})
}