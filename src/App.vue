<script setup lang="ts">
import TitleBar from "./components/native/TitleBar.vue"
import Dialog from "./components/Dialog.vue"
import TopLinks from "./components/TopLinks.vue"

import { ref } from "vue"
import { useStorage } from "@vueuse/core"

const isOpenModelDialog = ref(false)
const slideDirection = useStorage(
	"roco-navigation-transition-direction",
	"slideleft"
)
</script>

<template>
	<div id="app-main">
		<TitleBar />
		<Dialog v-model:isOpen="isOpenModelDialog" />
		<TopLinks />

		<router-view id="context" v-slot="{ Component }">
			<Transition :name="slideDirection" mode="out-in" :appear="true">
				<keep-alive :include="['Home', 'About']">
					<component :is="Component" :key="$route.fullPath" />
				</keep-alive>
			</Transition>
		</router-view>
	</div>
</template>

<style>
html.dark {
	color-scheme: dark;
}

@font-face {
	src: url("./assets/SourceHanSerifCN-VF.ttf");
	font-family: "SourceHanSerifCN";
}
</style>

<style lang="postcss" scoped>
.slideleft-enter-active,
.slideleft-leave-active,
.slideright-enter-active,
.slideright-leave-active {
	@apply transition-all;
}

.slideleft-enter-from,
.slideleft-leave-to {
	@apply translate-x-4 opacity-0;
}
.slideright-enter-from,
.slideright-leave-to {
	@apply -translate-x-4 opacity-0;
}
</style>

<style scoped lang="postcss">
#app-main {
	@apply relative w-[500px] min-h-[600px]
	border border-slate-400
	bg-slate-50 dark:bg-slate-700
	text-slate-700 dark:text-slate-100
	transition-all duration-200 ease-in-out
	overflow-hidden;

	font-family: "SourceHanSerifCN";
}

#context {
	@apply relative flex w-full min-h-[502px] flex-col justify-start items-center px-4;
}
</style>
