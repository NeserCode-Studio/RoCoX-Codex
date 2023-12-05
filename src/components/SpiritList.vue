<script lang="ts" setup>
import { Ref, ref, toRefs, watch } from "vue"
import { useRouter } from "vue-router"
import { useApi } from "../composables/useApi"
import { computedAsync, useStorage } from "@vueuse/core"

import { CubeTransparentIcon, BugAntIcon } from "@heroicons/vue/20/solid"
import { WindowCreator } from "../composables/useWindow"

const $props = withDefaults(
	defineProps<{
		id?: string
		search?: string
		feature?: string
		page?: number
	}>(),
	{
		id: "",
		search: "",
		feature: "",
		page: 1,
	}
)

const { id, search, feature, page } = toRefs($props)
const { getAngelList, iconStaticURL, featureStaticURL } = useApi()

const listData = computedAsync(async (onCancel) => {
	const abortController = new AbortController()

	onCancel(() => abortController.abort())

	return await getAngelList({
		id: id.value,
		search: search.value,
		feature: feature.value,
		page: page.value,
	})
})
const isEmpty = computedAsync(() => listData.value.length === 0)
const pageSize = useStorage("rocox-api-angel-list-size", 21)
const totalFromID = useStorage("rocox-api-angel-max-id", 0)

const $emits = defineEmits(["update:sizes"])

watch(listData, (val: any[]) => {
	if (search.value === "" && feature.value === "" && page.value === 1) {
		pageSize.value = val.length
		totalFromID.value = parseInt(val[0].id)
	}
	$emits("update:sizes", {
		listSize: val.length,
		pageSize: pageSize.value,
		total: totalFromID.value,
	})
	// console.log(listData.value)
})

function getFeatureIconSrc(featureIndex: string) {
	return `${featureStaticURL}${featureIndex}.png`
}
function getAngelIconSrc(iconSrc: string) {
	return `${iconStaticURL}${iconSrc}`
}

const $router = useRouter()
const alwaysTargetNewWindow = useStorage("rocox-new-window-target", false)
const angelPageTitle = useStorage("rocox-angel-page-title", "")
const AngelWindow: Ref<WindowCreator | null> = ref(null)

function setupWindowParams(id: string, name: string, hash: string) {
	angelPageTitle.value = `#${id} ${name}`
	AngelWindow.value = new WindowCreator(id, {
		url: `/#/angel/${hash}`,
		title: angelPageTitle.value,
	})

	goAngelView(hash)
}
function goAngelView(hash: string) {
	if (alwaysTargetNewWindow.value) AngelWindow.value!.setup()
	else
		$router.push({
			name: "Angel",
			params: { hash },
		})
}
</script>

<template>
	<div class="angel-list-main custom-scrollbar">
		<div
			class="angel-card"
			v-for="angel in listData"
			:key="angel.hash"
			@click="setupWindowParams(angel.id!, angel.name!, angel.hash!)"
		>
			<span class="details">
				<span class="name-text"
					><span class="id">#{{ angel.id }}</span> · {{ angel.name }}</span
				>
				<span class="features">
					<img
						draggable="false"
						class="feature-icon icon"
						referrerPolicy="no-referrer"
						v-for="key in angel.features"
						:key="key"
						:src="getFeatureIconSrc(key)"
						loading="lazy"
					/>
				</span>
				<img
					draggable="false"
					class="angel-icon icon"
					v-show="angel.img"
					:src="getAngelIconSrc(angel.iconSrc!)"
					alt="angel icon"
					referrerPolicy="no-referrer"
					loading="lazy"
				/>
				<CubeTransparentIcon
					v-show="!angel.img"
					draggable="false"
					class="icon-palceholder icon"
				/>
			</span>
		</div>
		<Transition name="slidein" mode="in-out" appear>
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
.slidein-enter-active,
.slidein-leave-active {
	@apply transition-all duration-500;
}

.slidein-enter-from,
.slidein-leave-to {
	@apply opacity-0 scale-50;
}
</style>
<style lang="postcss" scoped>
.angel-list-main {
	@apply relative w-full h-full min-h-[20rem] max-h-[22rem] mt-8 gap-2
	flex flex-wrap items-start justify-center content-start
  overflow-auto snap-y snap-mandatory;

	@apply sm:w-2/3 sm:min-h-[36rem] sm:max-h-[40rem] sm:px-4
	sm:flex-col sm:justify-start sm:items-center sm:flex-nowrap;
}
.angel-card {
	@apply w-[45%] h-8 flex flex-col
  border-2 border-slate-200 dark:border-slate-600
  hover:bg-slate-100 active:bg-slate-200 active:border-slate-300
  dark:hover:bg-slate-600 dark:active:bg-slate-800 dark:active:border-slate-600
  rounded select-none transition-all snap-start cursor-pointer;

	@apply sm:w-full sm:h-12 sm:pl-3 sm:py-3;
}

.details {
	@apply relative w-full h-full inline-flex items-center justify-start;
}

.name-text {
	@apply inline-block pr-2 mx-2
  text-sm font-black border-r
  border-gray-300 dark:border-gray-500
  truncate transition-all;

	@apply sm:text-base;
}
.name-text .id {
	@apply font-mono opacity-60;
}

.features {
	@apply inline-flex justify-center items-center mr-8;
}
.features .icon {
	@apply w-4 h-4 inline-block p-px mr-0.5;

	@apply sm:w-6 sm:h-6;
}

.details .angel-icon {
	@apply absolute right-0 w-7 h-7 inline-block
  rounded-r;

	@apply sm:w-11 sm:h-11;
}
.icon-palceholder {
	@apply absolute -right-1 w-11 h-11 inline-block p-3
  text-slate-600 dark:text-slate-300
  rounded-r transition-all;

	@apply sm:w-14 sm:h-14;
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
