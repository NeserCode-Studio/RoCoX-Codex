<script lang="ts" setup>
import { ref, computed, provide } from "vue"
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
const paganationProps = ref({
	listSize: 0,
	pageSize: 0,
	total: 0,
})
const paganationPage = ref(1)
const hasPrev = computed(() => !(paganationPage.value === 1))
const hasNext = computed(
	() => paganationProps.value.listSize === paganationProps.value.pageSize
)
const canJump = computed(
	() => selectedFeature.value === "" && inputSearch.value === ""
)

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

function updatePaganationSize(data: {
	listSize: number
	pageSize: number
	total: number
}) {
	paganationProps.value.listSize = data.listSize
	paganationProps.value.pageSize = data.pageSize
	paganationProps.value.total = data.total
}
function pageUpdateFn(page: number) {
	let totalPage = Math.round(
		paganationProps.value.total / paganationProps.value.pageSize
	)
	if (page <= totalPage && page > 0) paganationPage.value = page

	console.log(page)
}
</script>

<template>
	<div id="home">
		<div class="filters">
			<SearchFilter />
			<FeatureFilter />
		</div>
		<SpiritList
			:search="inputSearch"
			:feature="selectedFeature"
			:page="paganationPage"
			@update:sizes="updatePaganationSize"
		/>
		<div class="footer-image">
			<img
				class="dimo"
				draggable="false"
				src="../assets/roco.dimo.png"
				alt="Roco Dimo"
			/>
		</div>
		<Paganation
			:can-jump="canJump"
			:has-prev="hasPrev"
			:has-next="hasNext"
			:total="paganationProps.total"
			:page-size="paganationProps.pageSize"
			:page="paganationPage"
			:page-update-fn="pageUpdateFn"
		/>
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
