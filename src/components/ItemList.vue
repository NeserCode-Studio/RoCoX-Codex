<script lang="ts" setup>
import Popover from './native/Popover.vue'

import { CubeTransparentIcon, BugAntIcon } from '@heroicons/vue/20/solid'
import { ref, toRefs, watch } from 'vue'
import { useApi } from '../composables/useApi'
import { computedAsync, useStorage } from '@vueuse/core'

const $props = withDefaults(
	defineProps<{
		id?: string
		search?: string
		page?: number
	}>(),
	{
		id: '',
		search: '',
		page: 1,
	}
)

const { id, search, page } = toRefs($props)
const { getItemList, itemStaticURL } = useApi()

const listData = computedAsync(async (onCancel) => {
	const abortController = new AbortController()

	onCancel(() => abortController.abort())
	return await getItemList({
		id: id.value,
		search: search.value,
		page: page.value,
	})
})

const loadErrorList = ref<string[]>([])
function getItemSrc(itemId: string) {
	return `${itemStaticURL}${itemId}.png`
}
function onerrorList(_e: Event, id: string) {
	loadErrorList.value.push(id)
}

const isEmpty = computedAsync(() => listData.value.length === 0)
const pageSize = useStorage('rocox-api-item-list-size', 21)
const totalFromID = useStorage('rocox-api-item-max-id', 0)

const $emits = defineEmits(['update:sizes'])

watch(listData, (val: any[]) => {
	if (search.value === '' && page.value === 1) {
		pageSize.value = val.length
		totalFromID.value = parseInt(val[0].id)
	}
	$emits('update:sizes', {
		listSize: val.length,
		pageSize: pageSize.value,
		total: totalFromID.value,
		canJump: false,
	})
	// console.log(listData.value)
})

// Auto-scroll to the top of the page when the page is loaded.
const container = ref<HTMLElement | null>(null)
watch(page, () => {
	if (container.value) container.value.scrollTop = 0
})

const copyId = async (id: string) => {
	if (!navigator.clipboard) return
	return await navigator.clipboard.writeText(id)
}
</script>

<template>
	<div class="item-list-main custom-scrollbar" ref="container">
		<div class="item-card" v-for="item in listData" :key="item.id!">
			<img
				v-if="item.id && !loadErrorList.includes(item.id)"
				class="icon"
				@error="(e) => onerrorList(e, item.id!)"
				:src="getItemSrc(item.id)"
				alt="item image"
				draggable="false"
			/>
			<CubeTransparentIcon v-else class="icon placeholder" />
			<span class="details">
				<span class="name-text">
					<Popover :icon="false">
						<template #btn>
							<span class="name">{{ item.name }}</span>
						</template>
						<template #content>
							<div class="item-info-content">
								<span class="id-content">
									<span class="id">#{{ item.id }}</span>
									<span class="tip" @dblclick="copyId(item.id ?? 'error')"
										>双击复制</span
									>
								</span>
								<span
									class="desc"
									v-html="item.Desc ?? '这是一段空白的描述'"
								></span>
							</div>
						</template>
					</Popover>
				</span>
				<span class="text">
					<span class="unique"
						>持有 · {{ parseInt(item.Unique!) ? '' : '不' }}唯一</span
					>
					<span class="price">售价 · {{ item.Price }}</span>
				</span>
			</span>
		</div>
		<Transition name="slideup" mode="in-out" appear>
			<div class="empty-palceholder" v-if="isEmpty">
				<span class="empty-icons">
					<CubeTransparentIcon class="icon" /> ·
					<BugAntIcon class="icon" />
				</span>
				<span class="empty-text"
					>筛选结果为空，但不排除小概率因接口、网络等引起的故障。</span
				>
			</div>
		</Transition>
	</div>
</template>

<style lang="postcss" scoped>
.item-list-main {
	@apply flex flex-wrap w-full h-full mt-8 min-h-[20rem] max-h-[22rem] px-2 gap-2
	justify-center items-center content-start
  overflow-auto select-none snap-y snap-mandatory;

	@apply sm:min-h-[36rem] sm:max-h-[40rem];
}

.item-card {
	@apply inline-flex w-[45%] items-center justify-start gap-2
	border-2 rounded border-slate-300 dark:border-slate-600
	snap-start transition-all ease-in-out duration-300;

	@apply sm:w-1/4;
}
.item-card .icon {
	@apply inline-flex justify-center items-center w-14 h-fit box-content m-1
  border-2 rounded border-slate-300 dark:border-slate-600
	transition-colors ease-in-out duration-300;
}

.name-text {
	@apply inline-flex w-full items-center justify-start
  font-bold text-sm;
}
.name-text .name {
	@apply inline-block w-fit max-w-28 truncate
	text-green-500;
}
.name-text .id {
	@apply font-mono opacity-60;
}

.details {
	@apply w-fit inline-flex flex-col items-start justify-start;
}
.placeholder {
	@apply w-16 p-0.5 px-1;
}
.details .text {
	@apply w-fit inline-flex flex-col justify-start items-start;
}

.text .unique,
.text .price {
	@apply inline-flex items-center h-fit
	text-sm font-bold opacity-75
	transition-all whitespace-pre-line;
}

.empty-palceholder {
	@apply w-full h-full flex flex-col items-center justify-center
	select-none;
}
.empty-text {
	@apply inline-block
	text-sm font-bold text-center;
}
.empty-icons {
	@apply inline-flex justify-center items-center pb-4;
}
.empty-icons .icon {
	@apply w-12 h-12 inline-block m-2
	animate-pulse;
}

.item-info-content {
	@apply relative w-36 inline-flex flex-wrap justify-center items-center p-1
  rounded border-2 border-slate-300 bg-sky-100
  dark:border-slate-700 dark:bg-slate-600
  transition-colors ease-in-out duration-300;
}
.item-info-content .id-content {
	@apply inline-flex justify-center items-baseline gap-1;
}
.id-content .tip {
	@apply text-xs cursor-pointer;
}

.item-info-content .desc {
	@apply w-full inline-flex justify-center items-center mb-0
	text-xs;
}
</style>
