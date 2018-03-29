import Vue from 'vue';
import Login from '@/components/Login';
import Toast from '@/components/Toast';
import browser from '@/assets/js/browserUtil'
var T = Vue.extend(Toast);
var L = Vue.extend(Login);

var toast = new T({el: document.createElement('div')});
window.vueLogin = new L({el: document.createElement('div')});
document.body.appendChild(vueLogin.$el);
document.body.appendChild(toast.$el);
Vue.prototype.$toast = toast.show;
Vue.prototype.$browser = browser;