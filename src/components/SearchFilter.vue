<script lang="ts" setup>
import { ref, inject, watch } from "vue"
import { UpdateSearchFunctionalKey } from "../tokens"
import { useStorage } from "@vueuse/core"
const innerValue = ref("")

const { searchUpdateFn } = inject<{
	searchUpdateFn: (index: string) => void
}>(UpdateSearchFunctionalKey, { searchUpdateFn: () => {} })

watch(innerValue, (value) => {
	console.log("Component: Search Change to", value)
})

function submitChangetoTop() {
	searchUpdateFn(innerValue.value)
}

const category = useStorage("rocox-category", "angels")
const categoryNameMap = new Map([
	["angels", "精灵"],
	["skills", "技能"],
	["items", "物品"],
])

function getMatchPlaceHolder() {
	return `键入${categoryNameMap.get(category.value)}编号、名称等回车以查找`
}
</script>

<template>
	<div class="search-filter-main">
		<input
			class="filter-body"
			v-model="innerValue"
			@keyup.enter="submitChangetoTop"
			type="text"
			:placeholder="getMatchPlaceHolder()"
		/>
	</div>
</template>

<style lang="postcss" scoped>
.search-filter-main {
	@apply w-72 h-full
  transition-all;
}
.search-filter-main.extending {
	@apply w-96;
}

.filter-body {
	@apply w-full inline-flex items-center py-1 px-2
  text-base font-bold
  border-2 border-gray-300 dark:border-gray-500 caret-slate-400
  bg-slate-100 dark:bg-slate-600
  focus:ring-2 focus:border-green-300 dark:focus:border-green-500 ring-green-300 dark:ring-green-500
  outline-none shadow-lg transition-all rounded;
}
.filter-body::placeholder {
	@apply select-none transition-all;
}
</style>
