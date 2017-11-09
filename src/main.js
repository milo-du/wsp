// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import vueResource from "vue-resource";
import Toast from 'vue-easy-toast';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import vuescroll from 'vue-scroll';
import qiniuJS from 'qiniu-js';
import plupload from 'plupload';
import dateFormat from "dateformat";
import utils from "./utils.js";
import CONFIG from "./config.js";
import VueFinger from 'vue-finger';

utils.refreshRem();
window.moxie = plupload.moxie;
window.plupload = plupload;
Vue.use(qiniuJS);
Vue.use(vuescroll);
Vue.use(vueResource);
Vue.use(Toast);
Vue.use(VueFinger);
Vue.use(VueAwesomeSwiper);
Vue.filter('dateFormat', dateFormat);
Vue.config.productionTip = false;
Vue.http.options.emulateJSON = true;
Vue.http.options.root = '//wsp.mzlicai.cn';
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {
		App
	}
})