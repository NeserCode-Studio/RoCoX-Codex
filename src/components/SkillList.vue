<script lang="ts" setup>
import { CubeTransparentIcon, BugAntIcon } from "@heroicons/vue/20/solid"
import { Ref, ref, toRefs, watch } from "vue"
import { useApi } from "../composables/useApi"
import { computedAsync, useStorage } from "@vueuse/core"
import { useRouter } from "vue-router"
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
const { getSkillList, damageTypeStaticMap, featureStaticURL } = useApi()

const listData = computedAsync(async (onCancel) => {
	const abortController = new AbortController()

	onCancel(() => abortController.abort())
	return await getSkillList({
		id: id.value,
		search: search.value,
		feature: feature.value,
		page: page.value,
	})
})

function getFeatureIconSrc(propertyIndex: string) {
	return `${featureStaticURL}${propertyIndex}.png`
}

const isEmpty = computedAsync(() => listData.value.length === 0)
const pageSize = useStorage("rocox-api-skill-list-size", 21)
const totalFromID = useStorage("rocox-api-skill-max-id", 0)

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

const $router = useRouter()
const alwaysTargetNewWindow = useStorage("rocox-new-window-target", false)
const skillPageTitle = useStorage("rocox-skill-page-title", "")
const SkillWindow: Ref<WindowCreator | null> = ref(null)

function setupWindowParams(id: string, name: string, hash: string) {
	skillPageTitle.value = `#${id} ${name}`
	SkillWindow.value = new WindowCreator(id, {
		url: `/#/skill/${hash}`,
		title: skillPageTitle.value,
	})

	goSkillView(hash)
}
function goSkillView(hash: string) {
	if (alwaysTargetNewWindow.value) SkillWindow.value!.setup()
	else
		$router.push({
			name: "Skill",
			params: { hash },
		})
}
</script>

<template>
	<div class="skill-list-main custom-scrollbar">
		<div
			class="skill-card"
			v-for="skill in listData"
			:key="skill.hash"
			@click="setupWindowParams(skill.id!, skill.name!, skill.hash!)"
		>
			<span class="name-text">
				<span class="id">#{{ skill.id }}</span>
				<span class="name">{{ skill.name }}</span>
			</span>
			<span class="details">
				<span class="icons">
					<img
						v-if="skill.property"
						class="icon property"
						:src="getFeatureIconSrc(skill.property)"
						alt="skill property"
						draggable="false"
					/>
					<img
						v-if="skill.power !== '--'"
						draggable="false"
						class="icon damage"
						:src="damageTypeStaticMap.get(skill.damageType!)"
						:alt="skill.damageType === '1' ? '物理伤害' : '魔法伤害'"
						:title="skill.damageType === '1' ? '物理伤害' : '魔法伤害'"
					/>
				</span>
				<span class="text">
					<span class="ppMax" title="pp总量">{{ skill.ppMax }}</span> ·
					<span class="power" title="威力值">{{ skill.power }}</span> ·
					<span class="speed" title="速度值">{{ skill.speed }}</span>
				</span>
			</span>
		</div>
		<Transition name="slidedown" mode="in-out" appear>
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
.skill-list-main {
	@apply flex flex-wrap w-full mt-8 h-[22rem] items-start justify-center content-start
  overflow-auto snap-y snap-mandatory;
}

.skill-card {
	@apply flex flex-col mb-1 mr-1
  border-2 border-slate-200 dark:border-slate-600
  hover:bg-slate-100 active:bg-slate-200 active:border-slate-300
  dark:hover:bg-slate-600 dark:active:bg-slate-800 dark:active:border-slate-600
  rounded select-none transition-all snap-start cursor-pointer;
}

.skill-card .name-text {
	@apply inline-flex items-center justify-between
  font-semibold text-sm;
}
.name-text .id {
	@apply inline-block ml-1 mr-2;
}
.name-text .name {
	@apply inline-block ml-2 mr-1;
}

.skill-card .details {
	@apply inline-flex items-center justify-between;
}
.details .icons {
	@apply inline-block ml-1 mr-2;
}
.details .text {
	@apply inline-block ml-2 mr-1
  font-semibold text-sm;
}

.icons .icon {
	@apply w-6 h-6 inline-block my-1 ml-1 p-1
  border rounded
  bg-slate-200 dark:bg-slate-600 border-slate-400 dark:border-slate-500
  overflow-hidden transition-all;
}
.icon.damage {
	@apply p-0;
}

.text .ppMax {
	@apply text-blue-700 dark:text-blue-400;
}
.text .power {
	@apply text-red-700 dark:text-red-400;
}
.text .speed {
	@apply text-sky-700 dark:text-sky-400;
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
