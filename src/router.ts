import { createRouter, createWebHashHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		meta: {},
		component: () => import("./views/Home.vue"),
	},
	{
		path: "/about",
		name: "About",
		meta: {},
		component: () => import("./views/About.vue"),
	},
	{
		path: "/angel/:hash",
		name: "Angel",
		meta: {
			titleStorageKey: "rocox-angel-page-title",
		},
		component: () => import("./views/Angel.vue"),
	},
	{
		path: "/skill/:hash",
		name: "Skill",
		meta: {
			titleStorageKey: "rocox-skill-page-title",
		},
		component: () => import("./views/Skill.vue"),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
