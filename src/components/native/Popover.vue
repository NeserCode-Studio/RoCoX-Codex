<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
</script>

<template>
	<div class="w-full max-w-sm">
		<Popover v-slot="{ open }" class="relative">
			<PopoverButton
				:class="open ? 'text-white' : 'text-white/90'"
				class="inline-flex items-center px-2 py-1 text-base font-medium rounded-md bg-slate-400 group hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
			>
				<span><slot name="btn"></slot></span>
				<ChevronDownIcon
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
					class="absolute z-10 w-screen max-w-sm mt-2 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl"
				>
					<slot name="content"></slot>
				</PopoverPanel>
			</transition>
		</Popover>
	</div>
</template>
