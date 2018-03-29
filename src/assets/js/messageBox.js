import Vue from 'vue'
import MessageBox from '@/components/MessageBox'

var M = Vue.extend(MessageBox);
var message = new M({el:document.createElement('div')});
document.body.appendChild(message.$el);

export default message;