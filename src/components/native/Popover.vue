<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

withDefaults(
	defineProps<{
		icon?: boolean
	}>(),
	{
		icon: true,
	}
)
</script>

<template>
	<div class="w-full max-w-sm">
		<Popover v-slot="{ open }" class="relative">
			<PopoverButton class="outline-none">
				<span><slot name="btn"></slot></span>
				<ChevronDownIcon
					v-if="icon"
					:class="open ? 'rotate-180' : ''"
					class="w-5 h-5 ml-2 transition duration-150 ease-in-out group-hover:text-orange-300/80"
					aria-hidden="true"
				/>
			</PopoverButton>

			<transition
				enter-active-class="transition duration-200 ease-out"
				enter-from-class="translate-y-1 opacity-0"
				enter-to-class="translate-y-0 opacity-100"
				leave-active-class="transition duration-150 ease-in"
				leave-from-class="translate-y-0 opacity-100"
				leave-to-class="translate-y-1 opacity-0"
			>
				<PopoverPanel
					class="absolute z-10 mt-2 transform -translate-x-1/2 left-1/2"
				>
					<slot name="content"></slot>
				</PopoverPanel>
			</transition>
		</Popover>
	</div>
</template>
