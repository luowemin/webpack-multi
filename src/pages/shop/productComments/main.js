import '@/assets/css/normalize.css'
require('@/assets/js/flexible.js')
import Vue from 'vue'
import App from './App'

import { initPageBase } from '@/assets/js/initPageBase'

Vue.config.productionTip = false
/* eslint-disable no-new */

var {browser,info} = initPageBase(Vue);

new Vue({
	el: '#app',
	template: '<App/>',
	components: {
		App
	}
})