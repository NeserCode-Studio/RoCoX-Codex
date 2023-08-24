<script lang="ts" setup>
import { ArrowLeftIcon } from "@heroicons/vue/20/solid"
import { useStorage, useThrottleFn } from "@vueuse/core"
import { useRouter } from "vue-router"

const alwaysTargetNewWindow = useStorage("rocox-new-window-target", false)

const $router = useRouter()
const goPrevHistory = useThrottleFn(() => {
	$router.back()
}, 300)
</script>

<template>
	<Transition name="slideright" mode="out-in" appear :duration="2000">
		<button
			v-if="!alwaysTargetNewWindow"
			class="navigation-return"
			@click="goPrevHistory"
		>
			<ArrowLeftIcon class="icon" />
		</button>
	</Transition>
</template>

<style lang="postcss" scoped>
.navigation-return {
	@apply fixed left-16 inline-flex justify-center items-center py-1.5 px-2
	bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300
	focus:ring-2 ring-green-400 dark:ring-green-500
	rounded transition-all outline-none shadow-md
	z-10;
}
.navigation-return .icon {
	@apply w-4 h-4;
}
</style>
