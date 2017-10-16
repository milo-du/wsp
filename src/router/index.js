import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Share from '@/components/Share'
import Interface from '@/components/Interface'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [{
		path: '/',
		name: 'Home',
		component: Home
	}, {
		path: '/share',
		name: 'Share',
		component: Share
	}, {
		path: '/interface',
		name: 'Interface',
		component: Interface
	}]
})