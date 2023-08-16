<script lang="ts" setup>
import { onActivated, ref } from "vue"
import { RouterLink } from "vue-router"
import { HomeIcon, QuestionMarkCircleIcon } from "@heroicons/vue/20/solid"

const hasActivedLink = ref(true)
onActivated(() => {
	hasActivedLink.value = !!document.querySelector(
		".link.router-link-exact-active"
	)
})
</script>

<template>
	<div id="top-links" v-show="hasActivedLink">
		<RouterLink draggable="false" class="link" to="/">
			<HomeIcon class="icon" />
			<span>图鉴</span>
		</RouterLink>
		<RouterLink draggable="false" class="link" to="/about">
			<QuestionMarkCircleIcon class="icon" />
			<span>关于</span>
		</RouterLink>
		<RouterLink draggable="false" class="link" to="/angel/04bca0fe">
			<span>Testing</span>
		</RouterLink>
	</div>
</template>

<style lang="postcss" scoped>
#top-links {
	@apply w-full h-full flex items-center justify-center py-4;
}

.link {
	@apply inline-flex justify-center items-center mx-1 px-2.5 py-1
  bg-slate-200 dark:bg-slate-800
  font-semibold shadow
  rounded transition-all select-none;
}
.link.router-link-exact-active {
	@apply bg-green-400 text-sky-50 dark:bg-green-500
  shadow-lg;
}

.link .icon {
	@apply w-4 h-4 mr-1;
}
</style>
