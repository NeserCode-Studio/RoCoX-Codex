<script lang="ts" setup>
import { toRefs, watch } from "vue"
import { useApi } from "../composables/useApi"
import { computedAsync, useStorage } from "@vueuse/core"

import { CubeTransparentIcon } from "@heroicons/vue/20/solid"

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
	return await getAngelList(
		{
			id: id.value,
			search: search.value,
			feature: feature.value,
			page: page.value,
		},
		abortController.signal
	)
})
const pageSize = useStorage("roco-api-list-size", 21)
const totalFromID = useStorage("roco-api-max-id", 0)

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
})

function getFeatureIconSrc(featureIndex: string) {
	return `${featureStaticURL}${featureIndex}.png`
}
function getAngelIconSrc(iconSrc: string) {
	return `${iconStaticURL}${iconSrc}`
}
</script>

<template>
	<div class="angel-list-main" ref="main">
		<div class="angel-card" v-for="angel in listData" :key="angel.hash">
			<span class="details">
				<span class="name-text">#{{ angel.id }} · {{ angel.name }}</span>
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
					:src="getAngelIconSrc(angel.iconSrc)"
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
	</div>
</template>

<style lang="postcss" scoped>
.angel-list-main::-webkit-scrollbar {
	@apply w-2;
}
.angel-list-main::-webkit-scrollbar-track {
	@apply bg-slate-200 dark:bg-slate-600;
}
.angel-list-main::-webkit-scrollbar-thumb {
	@apply bg-slate-400 shadow;
}
.angel-list-main {
	@apply relative w-80 mt-8 h-80 flex flex-col items-center
  overflow-auto snap-y snap-mandatory;
}
.angel-card {
	@apply w-72 h-12 flex flex-col mb-1
  border-2 border-slate-200 dark:border-slate-600
  hover:bg-slate-100 active:bg-slate-200 active:border-slate-300
  dark:hover:bg-slate-600 dark:active:bg-slate-800 dark:active:border-slate-600
  rounded select-none transition-all snap-start cursor-pointer;
}

.details {
	@apply relative w-full h-12 inline-flex items-center justify-start;
}

.name-text {
	@apply inline-block w-36 mx-2
  text-sm font-black border-r
  border-gray-300 dark:border-gray-500
  truncate transition-all;
}

.features {
	@apply inline-flex justify-center items-center;
}
.features .icon {
	@apply w-8 h-8 inline-block p-1.5;
}

.details .angel-icon {
	@apply absolute right-0 w-11 h-11 inline-block
  rounded-r;
}
.icon-palceholder {
	@apply absolute right-0 w-11 h-11 inline-block p-2
  text-slate-600 dark:text-slate-300
  rounded-r transition-all;
}
</style>
