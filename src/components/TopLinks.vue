<script lang="ts" setup>
import {
	BookOpenIcon,
	QuestionMarkCircleIcon,
	LightBulbIcon,
} from "@heroicons/vue/20/solid"
import Menu from "./native/Menu.vue"
import GoBack from "./native/GoBack.vue"
import { computed, onMounted } from "vue"
import { RouterLink, useRoute } from "vue-router"
import { useStorage } from "@vueuse/core"
import { nextTickToShow } from "../composables/useLocal"

const $route = useRoute()
const shouldShowLinksPath = ["home", "about", "help"]
const hasActivedLink = computed(() => {
	return shouldShowLinksPath.includes(
		(($route.name as string) ?? "").toLowerCase()
	)
})

const category = useStorage("rocox-category", "angels")
const categoryNameMap = new Map([
	["angels", "精灵"],
	["skills", "技能"],
	["items", "物品"],
])
function getMatchCategoryName() {
	return categoryNameMap.get(category.value)
}

onMounted(() => {
	setTimeout(() => {
		nextTickToShow()
	}, 0)
})
</script>

<template>
	<Transition name="slideleft" mode="out-in" appear>
		<div id="top-links" v-show="hasActivedLink">
			<Menu class="links-menu" />
			<GoBack />
			<RouterLink draggable="false" class="link" to="/">
				<BookOpenIcon class="icon" />
				<span class="text">{{ getMatchCategoryName() }}</span>
			</RouterLink>
			<RouterLink draggable="false" class="link" to="/help">
				<LightBulbIcon class="icon" />
				<span class="text">帮助</span>
			</RouterLink>
			<RouterLink draggable="false" class="link" to="/about">
				<QuestionMarkCircleIcon class="icon" />
				<span class="text">关于</span>
			</RouterLink>
		</div>
	</Transition>
</template>

<style lang="postcss" scoped>
#top-links {
	@apply w-full h-full flex items-center justify-center py-4;
}

.link {
	@apply inline-flex justify-center items-center mx-1 px-2.5 py-1
  bg-slate-200 dark:bg-slate-800
  text-base font-black shadow
  rounded transition-all select-none;
}
.link.router-link-exact-active {
	@apply bg-green-400 text-sky-50 dark:bg-green-500
  shadow-lg;
}

.link .icon {
	@apply w-4 h-4 mr-1;
}

.links-menu {
	@apply fixed left-4 z-10;
}
</style>
