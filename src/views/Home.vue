<script lang="ts" setup>
import { ref, computed, provide, onActivated, watch } from "vue"
import { useStorage } from "@vueuse/core"
import SearchFilter from "../components/SearchFilter.vue"
import FeatureFilter from "../components/FeatureFilter.vue"
import SpiritList from "../components/SpiritList.vue"
import SkillList from "../components/SkillList.vue"
import Pagination from "../components/native/Pagination.vue"

import {
	UpdateFeatureFunctionalKey,
	UpdateSearchFunctionalKey,
} from "../tokens"
const slideDirection = useStorage(
	"rocox-navigation-transition-direction",
	"slideleft"
)
const category = useStorage("rocox-categroy", "angels")
const computedExtendingClass = computed(() => {
	return ["angels", "skills"].includes(category.value) ? null : "extending"
})
const shouldShowFeatures = computed(() =>
	["angels", "skills"].includes(category.value)
)
function shouldShowList(key: string): boolean {
	return category.value === key
}
watch(category, () => {
	paginationPage.value = 1
	selectedFeature.value = ""
	inputSearch.value = ""
})

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
			<SearchFilter :class="computedExtendingClass" />
			<FeatureFilter v-if="shouldShowFeatures" />
		</div>
		<SpiritList
			v-if="shouldShowList('angels')"
			:search="inputSearch"
			:feature="selectedFeature"
			:page="paginationPage"
			@update:sizes="updatePaginationSize"
		/>
		<SkillList
			v-if="shouldShowList('skills')"
			:search="inputSearch"
			:feature="selectedFeature"
			:page="paginationPage"
			@update:sizes="updatePaginationSize"
		/>
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
</style>
