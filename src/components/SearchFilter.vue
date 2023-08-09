<script lang="ts" setup>
import { ref } from "vue"
const innerValue = ref("")
</script>

<template>
	<div class="search-filter-main">
		<input
			class="filter-body"
			v-model="innerValue"
			type="text"
			placeholder="键入宠物编号、名称等"
		/>
	</div>
</template>

<style lang="postcss" scoped>
.search-filter-main {
	@apply w-72 h-full
  transition-all;
}

.filter-body {
	@apply w-full inline-flex items-center py-1 px-2
  text-base font-bold
  border-2 border-gray-300 dark:border-gray-500
  bg-slate-100 dark:bg-slate-600
  focus:ring-2 focus:border-green-300 dark:focus:border-green-500 ring-green-300 dark:ring-green-500
  outline-none shadow-lg transition-all rounded;
}
</style>
