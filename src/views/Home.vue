<script lang="ts" setup>
import SearchFilter from "../components/SearchFilter.vue"
import FeatureFilter from "../components/FeatureFilter.vue"
</script>

<template>
	<div id="home">
		<div class="filters">
			<SearchFilter />
			<FeatureFilter />
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.filters {
	@apply w-full inline-flex justify-evenly;
}
</style>
