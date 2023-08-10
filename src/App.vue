<script setup lang="ts">
import { ref } from "vue"
import TitleBar from "./components/native/TitleBar.vue"
import Dialog from "./components/Dialog.vue"
import TopLinks from "./components/TopLinks.vue"

const isOpenModelDialog = ref(false)
</script>

<template>
	<div id="app-main">
		<TitleBar />
		<Dialog v-model:isOpen="isOpenModelDialog" />
		<TopLinks />

		<router-view id="context" v-slot="{ Component }">
			<keep-alive>
				<component :is="Component" :key="$route.fullPath" />
			</keep-alive>
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

<style scoped lang="postcss">
#app-main {
	@apply relative w-[500px] min-h-[600px]
	border border-slate-400
	bg-slate-50 dark:bg-slate-700
	text-slate-700 dark:text-slate-100
	transition-all duration-200 ease-in-out;

	font-family: "SourceHanSerifCN";
}

#context {
	@apply relative flex w-full h-full flex-col justify-center items-center px-4;
}
</style>
