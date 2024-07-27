<script lang="ts" setup>
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogPanel,
	DialogTitle,
} from '@headlessui/vue'

const $props = withDefaults(
	defineProps<{
		close: () => void
		modelEnabled?: boolean
	}>(),
	{
		close: () => {},
		modelEnabled: true,
	}
)
const isOpen = defineModel<boolean>('isOpen', {
	required: true,
	default: false,
})
const closeModal = () => {
	$props.close()
	isOpen.value = false
}
</script>

<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog
			as="div"
			@close="modelEnabled ? closeModal : null"
			class="relative z-10 dialog"
		>
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-25 dialog-backdrop" />
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
							class="w-full max-w-md p-4 overflow-hidden text-left align-middle transition-all transform bg-gray-100 shadow-xl cursor-default dark:bg-gray-600 rounded-2xl"
						>
							<DialogTitle
								as="h2"
								class="text-lg font-black text-gray-900 transition-colors dark:text-gray-100"
							>
								<slot name="title"></slot>
							</DialogTitle>
							<div class="mt-2">
								<p
									class="text-sm text-gray-600 transition-all dark:text-gray-400"
								>
									<slot name="details"></slot>
								</p>
							</div>

							<div class="mt-4">
								<button
									type="button"
									class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 transition-all bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-400"
									@click="closeModal"
								>
									<slot name="close"></slot>
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<style lang="postcss">
html:has(#app-main.app-rounded) .dialog-backdrop {
	@apply rounded-lg;
}
.dialog {
	font-family: 'SourceHanSerifCN';
}
</style>
