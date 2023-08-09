import { createRouter, createWebHashHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		component: () => import("./views/Home.vue"),
	},
	{
		path: "/about",
		component: () => import("./views/About.vue"),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
