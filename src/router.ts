import { createRouter, createWebHashHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: () => import("./views/Home.vue"),
	},
	{
		path: "/about",
		name: "About",
		component: () => import("./views/About.vue"),
	},
	{
		path: "/angel/:hash",
		name: "Angel",
		component: () => import("./views/Angel.vue"),
	},
	{
		path: "/skill/:hash",
		name: "Skill",
		component: () => import("./views/Skill.vue"),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
