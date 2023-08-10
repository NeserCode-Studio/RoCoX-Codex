<script lang="ts" setup>
import {
	RadioGroup,
	RadioGroupOption,
	Popover,
	PopoverButton,
	PopoverPanel,
} from "@headlessui/vue"
import { NoSymbolIcon, ChevronDownIcon } from "@heroicons/vue/20/solid"
import { nextTick, onMounted, ref, watch, inject } from "vue"
import type { Ref } from "vue"
import { useApi } from "../composables/useApi"
import { UpdateFeatureFunctionalKey } from "../tokens"

const { featureStaticURL, getFeatures } = useApi()

let featureMap: Ref<Map<string, string>> = ref(new Map())
let checkedOption = ref("")
let matchText = ref("属性筛选")

onMounted(async () => {
	featureMap.value = await getFeatures()
})

function getFeatureIcon(featureIndex: string) {
	return `${featureStaticURL}${featureIndex}.png`
}

function getMatchText(featureIndex: string) {
	matchText.value =
		featureIndex === ""
			? "属性筛选"
			: `${featureMap.value.get(featureIndex)}属性`
}

function delayAccept(fn: () => void) {
	nextTick(() => {
		fn()
	})
}

const { featureUpdateFn } = inject<{
	featureUpdateFn: (index: string) => void
}>(UpdateFeatureFunctionalKey, { featureUpdateFn: () => {} })

watch(checkedOption, (value) => {
	console.log("Component: Feature Change to", value)
	getMatchText(value)
	featureUpdateFn(value)
})
</script>

<template>
	<Popover as="div" v-slot="{ open, close }">
		<PopoverButton class="transition-all shadow-lg outline-none">
			<div class="btn-context">
				<img
					v-if="checkedOption !== ''"
					draggable="false"
					class="icon"
					:src="getFeatureIcon(checkedOption)"
					loading="lazy"
				/>
				<span> {{ matchText }} </span>
				<ChevronDownIcon :class="['icon', open ? 'isOpen' : null]" />
			</div>
		</PopoverButton>
		<transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-y-1 opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0"
		>
			<PopoverPanel class="absolute z-10 max-w-sm transform right-8">
				<RadioGroup
					class="w-[340px] flex flex-row flex-wrap items-center transition-all border-2 select-none justify-end rounded-md translate-x-0.5 translate-y-3 bg-neutral-200 dark:bg-neutral-500 border-slate-200 dark:border-slate-500"
					v-model="checkedOption"
				>
					<RadioGroupOption
						class="feature-item"
						v-for="feature of featureMap"
						:key="feature[0]"
						:value="feature[0]"
						v-slot="{ checked }"
						@click="delayAccept(close)"
					>
						<img
							draggable="false"
							class="feature-icon"
							:src="getFeatureIcon(feature[0])"
							loading="lazy"
						/>
						<span
							draggable="false"
							:class="['feature-text', checked ? 'checked' : null]"
							>{{ feature[1] }}</span
						>
					</RadioGroupOption>
					<RadioGroupOption
						class="feature-item"
						value=""
						v-slot="{ checked }"
						@click="delayAccept(close)"
					>
						<NoSymbolIcon draggable="false" class="feature-icon" />
						<span
							draggable="false"
							:class="['feature-text', checked ? 'checked' : null]"
							>无</span
						>
					</RadioGroupOption>
				</RadioGroup>
			</PopoverPanel>
		</transition>
	</Popover>
</template>

<style lang="postcss" scoped>
.btn-context {
	@apply inline-flex justify-center items-center pl-2 pr-0.5 py-1
  border-2 rounded border-zinc-400
  bg-neutral-200 dark:bg-neutral-500
  select-none cursor-pointer;
}
.btn-context .icon {
	@apply w-4 h-4 mr-1
  text-gray-400;
}

.icon:last-child {
	@apply w-6 h-6 inline-block
  text-slate-600 dark:text-slate-200 rounded-full
  transition-all;
}
.icon.isOpen {
	@apply transform rotate-180;
}

.feature-list {
	@apply flex w-full flex-row flex-wrap py-2 px-4 items-center justify-center
	select-none transition-all;
}

.feature-item {
	@apply inline-flex flex-col items-center justify-center m-1
	border-slate-300 dark:border-slate-600 rounded
	shadow-xl overflow-hidden;
}
.feature-icon {
	@apply inline-block w-12 h-12 p-2
	border border-b-0 border-inherit rounded-t
	transition-all select-none;
}
.feature-text {
	@apply inline-flex w-full py-0.5 items-center justify-center
	border border-inherit rounded-b text-xs
	transition-all select-none;
}

.feature-item:has(.checked.feature-text) {
	@apply border-green-400 dark:border-green-500
  bg-green-200 dark:bg-green-700
  transform transition-all;
	animation: jump 0.2s ease-in-out forwards;
}
.feature-item:has(.checked.feature-text) .feature-icon,
.feature-item:has(.checked.feature-text) .feature-text {
	@apply bg-green-200 dark:bg-green-700;
}

@keyframes jump {
	0% {
		@apply -translate-y-px;
	}
	25% {
		@apply translate-y-px;
	}
	50% {
		@apply -translate-y-px;
	}
	75% {
		@apply -translate-y-0.5;
	}
	100% {
		@apply translate-y-0;
	}
}
</style>
