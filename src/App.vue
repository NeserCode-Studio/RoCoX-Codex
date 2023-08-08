<script setup lang="ts">
import { ref, onMounted } from "vue"
import TitleBar from "./components/native/TitleBar.vue"
import Dialog from "./components/Dialog.vue"

import { useApi } from "./composables/useApi"

const isOpen = ref(true)
const { getSpirit } = useApi()

onMounted(async () => {
	const data = await getSpirit({ hash: "79bdd5fd" })

	console.log(data)
})
</script>

<template>
	<div id="app-main">
		<Dialog v-model:isOpen="isOpen" />
		<TitleBar />
	</div>
</template>

<style scoped lang="postcss">
#app-main {
	@apply w-[500px] h-[600px]
	border border-slate-500
	bg-slate-50 dark:bg-slate-800
	text-slate-700 dark:text-slate-100
	transition-all duration-200 ease-in-out;
}
</style>
