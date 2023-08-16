<script lang="ts" setup>
import { ref, computed, provide, onActivated } from "vue"
import { useStorage } from "@vueuse/core"
import SearchFilter from "../components/SearchFilter.vue"
import FeatureFilter from "../components/FeatureFilter.vue"
import SpiritList from "../components/SpiritList.vue"
import Pagination from "../components/native/Pagination.vue"

import {
	UpdateFeatureFunctionalKey,
	UpdateSearchFunctionalKey,
} from "../tokens"
const slideDirection = useStorage(
	"roco-navigation-transition-direction",
	"slideleft"
)

onActivated(() => {
	slideDirection.value = "slideright"
})

const selectedFeature = ref("")
const inputSearch = ref("")
const paginationProps = ref({
	listSize: 0,
	pageSize: 0,
	total: 0,
})
const paginationPage = ref(1)
const hasPrev = computed(() => !(paginationPage.value === 1))
const hasNext = computed(
	() => paginationProps.value.listSize === paginationProps.value.pageSize
)
const canJump = computed(
	() => selectedFeature.value === "" && inputSearch.value === ""
)

const featureUpdateFn = (featureIndex: string) => {
	if (selectedFeature.value === featureIndex) return false
	selectedFeature.value = featureIndex
	paginationPage.value = 1
	console.log("Home: Feature Change to", featureIndex)
}
const searchUpdateFn = (searchString: string) => {
	if (inputSearch.value === searchString) return false
	inputSearch.value = searchString
	paginationPage.value = 1
	console.log("Home: Search Change to", searchString)
}

provide(UpdateFeatureFunctionalKey, { featureUpdateFn })
provide(UpdateSearchFunctionalKey, { searchUpdateFn })

function updatePaginationSize(data: {
	listSize: number
	pageSize: number
	total: number
}) {
	paginationProps.value.listSize = data.listSize
	paginationProps.value.pageSize = data.pageSize
	paginationProps.value.total = data.total
}
function pageUpdateFn(page: number) {
	let totalPage = Math.round(
		paginationProps.value.total / paginationProps.value.pageSize
	)
	if (page <= totalPage && page > 0) paginationPage.value = page
}
</script>

<template>
	<div>
		<div class="filters">
			<SearchFilter />
			<FeatureFilter />
		</div>
		<SpiritList
			:search="inputSearch"
			:feature="selectedFeature"
			:page="paginationPage"
			@update:sizes="updatePaginationSize"
		/>
		<div class="footer-image">
			<img
				class="dimo"
				draggable="false"
				src="../assets/roco.dimo.png"
				alt="Roco Dimo"
			/>
		</div>
		<Pagination
			:can-jump="canJump"
			:has-prev="hasPrev"
			:has-next="hasNext"
			:total="paginationProps.total"
			:page-size="paginationProps.pageSize"
			:page="paginationPage"
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
	-translate-x-2 transform select-none;
}
.dimo {
	@apply w-24 absolute top-0 left-0;
	transform: matrix(-1, 0, 0, 1, 0, 0);
}
</style>
