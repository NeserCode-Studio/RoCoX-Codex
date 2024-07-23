<script lang="ts" setup>
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogPanel,
	DialogTitle,
} from "@headlessui/vue"
import { useStorage } from "@vueuse/core"

const isOpen = defineModel<boolean>("isOpen", {
	required: true,
	default: false,
})

const salt = useStorage("rocox-dev-salt", "")
const password = useStorage("rocox-dev-password", "")
const useDev = useStorage("rocox-dev-tools-state", false)
const isRoundedAvatar = useStorage("rocox-avatar-rounded", false)

function closeModal() {
	if (!useDev.value) {
		isRoundedAvatar.value = false
	}
	isOpen.value = false
}
</script>

<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal" class="relative z-10">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-25" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto cursor-not-allowed">
				<div
					class="flex items-center justify-center min-h-full p-4 text-center"
				>
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-gray-100 shadow-xl cursor-default dark:bg-gray-600 rounded-2xl"
						>
							<DialogTitle
								as="h3"
								class="text-lg font-medium leading-6 text-gray-900 transition-all dark:text-gray-100"
							>
								启用开发者模式？
							</DialogTitle>
							<div class="mt-2">
								<p
									class="text-sm text-gray-600 transition-all dark:text-gray-400"
								>
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

							<div class="mt-4">
								<button
									type="button"
									class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 transition-all bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-400"
									@click="closeModal"
								>
									确认
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
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
