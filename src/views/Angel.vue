<script lang="ts" setup>
import { ref, watch } from "vue"
import { computedAsync } from "@vueuse/core"
import { useRoute } from "vue-router"
import { useApi } from "../composables/useApi"

const $route = useRoute()
const { getAngel } = useApi()

const angelData = computedAsync(async (onCancel) => {
	const abortController = new AbortController()

	onCancel(() => abortController.abort())

	return await getAngel(
		{ hash: $route.params.hash as string },
		abortController.signal
	)
})

const isLoadingData = ref(true)
watch(angelData, (val) => {
	isLoadingData.value = false
	console.log(val)
})

function log() {
	console.log(angelData.value)
}
</script>

<template>
	<div @click="log">
		<div class="details" v-if="!isLoadingData">
			<img
				class="angel-img"
				:src="angelData.angel.img"
				alt="Angel Image"
				loading="lazy"
			/>
			<span class="powers">
				<span class="id power-item">{{ angelData.angel.id }}</span>
				<span class="addtion power-item">{{ angelData.angel.add }}</span>
				<span class="health power-item">{{ angelData.angel.sm }}</span>
				<span class="physicalAttack power-item">{{ angelData.angel.wg }}</span>
				<span class="physicalDefend power-item">{{ angelData.angel.fy }}</span>
				<span class="magicAttack power-item">{{ angelData.angel.mg }}</span>
				<span class="magicDefend power-item">{{ angelData.angel.mk }}</span>
				<span class="speed power-item">{{ angelData.angel.sd }}</span>
			</span>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.details {
	@apply w-full inline-flex justify-center items-center mt-4;
}

.angel-img {
	@apply w-1/2 p-4;
}

.powers {
	@apply w-1/2 inline-flex items-center justify-between flex-wrap p-4;
}
.power-item {
	@apply w-1/3 mx-2;
}
</style>
