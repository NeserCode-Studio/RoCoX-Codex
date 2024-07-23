<script lang="ts" setup>
import Dialog from './native/Dialog.vue'
import { useStorage } from '@vueuse/core'

const isOpen = defineModel<boolean>({
	default: false,
})

const salt = useStorage('rocox-dev-salt', '')
const password = useStorage('rocox-dev-password', '')
const useDev = useStorage('rocox-dev-tools-state', false)
const isRoundedAvatar = useStorage('rocox-avatar-rounded', false)

function closeModal() {
	if (!useDev.value) {
		isRoundedAvatar.value = false
	}
}
</script>

<template>
	<Dialog :close="closeModal" v-model:is-open="isOpen">
		<template #title>启用开发者模式？</template>
		<template #details>
			<div class="mt-2">
				<p class="text-sm text-gray-600 transition-all dark:text-gray-400">
					如果您不明白为何触发这部分内容，请无视内容直接点击确认。
				</p>
				<input
					class="will-input salt"
					type="text"
					placeholder="SHA SALT"
					name="salt"
					id="salt"
					v-model="salt"
				/>
				<input
					class="will-input pwd"
					type="password"
					name="password"
					placeholder="PASSWORD"
					id="password"
					v-model="password"
				/>
			</div>
		</template>
		<template #close>确认</template>
	</Dialog>
</template>

<style lang="postcss" scoped>
.will-input {
	@apply inline-flex items-center  px-2 py-1 mt-2
	border-2 rounded border-slate-300 dark:border-slate-600
	bg-sky-100 dark:bg-sky-800
	focus:ring-2 ring-green-400 dark:ring-green-600
	outline-none transition-all;
}
.salt {
	@apply w-32 mr-2;
}
.pwd {
	@apply w-60;
}
</style>
