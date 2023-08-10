<script lang="ts" setup>
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/20/solid"
</script>

<template>
	<div class="paganation">
		<span class="prev operation">
			<ArrowLeftIcon class="icon" />
		</span>
		<span class="next operation">
			<ArrowRightIcon class="icon" />
		</span>
	</div>
</template>

<style lang="postcss" scoped>
.paganation {
	@apply inline-flex justify-center items-center flex-wrap;
}
.operation {
	@apply w-8 h-8 inline-flex justify-center items-center;
}
</style>
