<script lang="ts" setup>
import { CubeTransparentIcon, BugAntIcon } from "@heroicons/vue/20/solid"
import { ref, toRefs, watch } from "vue"
import { useApi } from "../composables/useApi"
import { computedAsync, useStorage } from "@vueuse/core"

const $props = withDefaults(
	defineProps<{
		id?: string
		search?: string
		page?: number
	}>(),
	{
		id: "",
		search: "",
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
const pageSize = useStorage("rocox-api-item-list-size", 21)
const totalFromID = useStorage("rocox-api-item-max-id", 0)

const $emits = defineEmits(["update:sizes"])

watch(listData, (val: any[]) => {
	if (search.value === "" && page.value === 1) {
		pageSize.value = val.length
		totalFromID.value = parseInt(val[0].id)
	}
	$emits("update:sizes", {
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
</script>

<template>
	<div class="item-list-main custom-scrollbar" ref="container">
		<div class="item-card" v-for="item in listData" :key="item.id!">
			<span class="name-text">
				<span class="id">#{{ item.id }}</span>
				<span class="inline-block mx-1 font-bold"> </span>
				<span class="name">{{ item.name }}</span>
			</span>
			<span class="details">
				<img
					v-if="item.id && !loadErrorList.includes(item.id)"
					class="icon"
					@error="(e) => onerrorList(e, item.id!)"
					:src="getItemSrc(item.id)"
					alt="item image"
					draggable="false"
				/>
				<CubeTransparentIcon v-else class="icon placeholder" />
				<span class="text">
					<span class="unique"
						>持有 · {{ parseInt(item.Unique!) ? "" : "不" }}唯一</span
					>
					<span class="price">售价 · {{ item.Price }}</span>
					<span class="desc"
						>描述 · <span v-html="item.Desc ?? '这是一段空白的描述'"></span
					></span>
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
	@apply flex flex-col w-96 h-full mt-8 min-h-[20rem] max-h-[22rem] px-2 gap-2
	items-center content-start
  overflow-auto select-none snap-y snap-mandatory;

	@apply sm:min-h-[36rem] sm:max-h-[40rem];
}

.item-card {
	@apply inline-flex flex-col w-full items-center justify-center p-2 pt-0
	border-2 rounded border-slate-300 dark:border-slate-600
	snap-start transition-all ease-in-out duration-300;
}

.name-text {
	@apply inline-flex w-full items-center justify-start my-1
  font-bold text-sm;
}
.name-text .id {
	@apply font-mono opacity-60;
}

.details {
	@apply inline-flex w-full items-center justify-start;
}
.details .icon {
	@apply inline-flex justify-center items-center w-16 h-fit box-content mr-1
  border-2 rounded transition-all
	border-slate-300 dark:border-slate-600;
}
.placeholder {
	@apply w-16 p-0.5 px-1;
}
.details .text {
	@apply inline-flex flex-wrap justify-between items-center;
}

.text .unique,
.text .price,
.text .desc {
	@apply inline-flex items-center h-fit px-1 py-0.5 mr-1 mb-1
	text-sm font-bold opacity-75
	transition-all whitespace-pre-line;
}
.text .desc {
	@apply w-full mb-0;
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
</style>
