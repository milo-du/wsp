// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import vueResource from "vue-resource";
import Toast from 'vue-easy-toast';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import dateFormat from "dateformat";
import utils from "./utils.js";
require('swiper/dist/css/swiper.css');

utils.refreshRem();
Vue.use(vueResource);
Vue.use(Toast);
Vue.use(VueAwesomeSwiper);
Vue.filter('dateFormat', dateFormat);
Vue.config.productionTip = false;
Vue.http.options.root = process.env.NODE_ENV == 'development' ? '//127.0.0.1:8083' : 'https://api.runningdreamer.com';
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {
		App
	}
})