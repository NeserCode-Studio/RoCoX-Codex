<script setup lang="ts">
import { ref, provide } from "vue"
import TitleBar from "./components/native/TitleBar.vue"
import Dialog from "./components/Dialog.vue"
import TopLinks from "./components/TopLinks.vue"

import { UpdateFeatureFunctionalKey } from "./tokens"

const isOpenModelDialog = ref(false)
const selectedFeature = ref("")

const featureUpdateFn = (featureIndex: string) => {
	selectedFeature.value = featureIndex
	console.log("Top: feature change to", featureIndex)
}

provide(UpdateFeatureFunctionalKey, { featureUpdateFn })
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

<style scoped lang="postcss">
@font-face {
	src: url("./assets/SourceHanSerifCN-VF.ttf");
	font-family: "SourceHanSerifCN";
}

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
