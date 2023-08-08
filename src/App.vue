<script setup lang="ts">
import { ref, onMounted } from "vue"
import TitleBar from "./components/native/TitleBar.vue"
import Dialog from "./components/Dialog.vue"

import { useApi } from "./composables/useApi"

const isOpen = ref(true)
const { getSpiritList } = useApi()

onMounted(async () => {
	const list = await getSpiritList()

	console.log(list)
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
	border border-slate-500;
}
</style>
