<script lang="ts" setup>
import { ref, provide } from "vue"
import SearchFilter from "../components/SearchFilter.vue"
import FeatureFilter from "../components/FeatureFilter.vue"
import SpiritList from "../components/SpiritList.vue"
import Paganation from "../components/native/Paganation.vue"

import {
	UpdateFeatureFunctionalKey,
	UpdateSearchFunctionalKey,
} from "../tokens"

const selectedFeature = ref("")
const inputSearch = ref("")

const featureUpdateFn = (featureIndex: string) => {
	if (selectedFeature.value === featureIndex) return false
	selectedFeature.value = featureIndex
	console.log("Home: Feature Change to", featureIndex)
}
const searchUpdateFn = (searchString: string) => {
	if (inputSearch.value === searchString) return false
	inputSearch.value = searchString
	console.log("Home: Search Change to", searchString)
}

provide(UpdateFeatureFunctionalKey, { featureUpdateFn })
provide(UpdateSearchFunctionalKey, { searchUpdateFn })
</script>

<template>
	<div id="home">
		<div class="filters">
			<SearchFilter />
			<FeatureFilter />
		</div>
		<SpiritList :search="inputSearch" :feature="selectedFeature" />
		<div class="footer-image">
			<img
				class="dimo"
				draggable="false"
				src="../assets/roco.dimo.png"
				alt="Roco Dimo"
			/>
		</div>
		<Paganation />
	</div>
</template>

<style lang="postcss" scoped>
.filters {
	@apply w-full inline-flex justify-evenly;
}

.footer-image {
	@apply w-full h-px relative
	-translate-x-4 transform select-none;
}
.dimo {
	@apply w-24 absolute top-0 left-0;
	transform: matrix(-1, 0, 0, 1, 0, 0);
}
</style>
