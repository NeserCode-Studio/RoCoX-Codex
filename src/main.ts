import { createApp } from "vue"
import "./styles.css"
import router from "./router"
import App from "./App.vue"

import NProgress from "nprogress"
import "nprogress/nprogress.css" // nprogress样式文件

NProgress.configure({
	easing: "ease-in-out",
	speed: 100,
	showSpinner: true,
	parent: "#top-links",
	trickleSpeed: 200,
	minimum: 0.1,
})

router.beforeEach((_to, _from, next) => {
	NProgress.start()
	next()
})

router.afterEach(() => {
	NProgress.done()
})

createApp(App).use(router).mount("#app")
