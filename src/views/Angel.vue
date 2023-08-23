<script lang="ts" setup>
import GoBack from "../components/native/GoBack.vue"
import { CubeTransparentIcon } from "@heroicons/vue/20/solid"
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue"

import { Ref, ref, watch } from "vue"
import { computedAsync, useStorage } from "@vueuse/core"
import { useRoute, useRouter } from "vue-router"
import { useApi } from "../composables/useApi"
import { WindowCreator } from "../composables/useWindow"

const $route = useRoute()
const { getAngel, iconStaticURL, featureStaticURL, talentStaticURL } = useApi()

const angelData = computedAsync(async (onCancel) => {
	const abortController = new AbortController()

	onCancel(() => abortController.abort())

	return await getAngel(
		{ hash: $route.params.hash as string },
		abortController.signal
	)
})

function getIconSrc() {
	return `${iconStaticURL}${angelData.value.angel.iconSrc}`
}
function getFeatureIconSrc(featureIndex: string) {
	return `${featureStaticURL}${featureIndex}.png`
}
function getTalentIconSrc(talentId: string) {
	return `${talentStaticURL}${talentId}_big.png`
}

function getSelectedTabClass(selectedIndex: number, index: number) {
	return selectedIndex === index ? "selected" : null
}

const isLoadingData = ref(true)
watch(angelData, (val) => {
	isLoadingData.value = false
	// console.log(val)
})

const isShowTalentFix = ref(false)
function toggleTalentFix() {
	isShowTalentFix.value = !isShowTalentFix.value
}

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
	<div v-if="!isLoadingData">
		<span class="names">
			<GoBack class="go-back" />
			<span class="features">
				<img
					class="icon"
					draggable="false"
					v-for="feature in angelData.angel.features"
					:src="getFeatureIconSrc(feature)"
					alt="feature icon"
				/>
			</span>
			<span class="name">{{ angelData.angel.name }}</span>
		</span>
		<div class="details">
			<img
				class="angel-img"
				v-if="angelData.angel.img"
				:src="angelData.angel.img"
				alt="Angel Image"
				draggable="false"
				loading="lazy"
			/>
			<CubeTransparentIcon v-else class="icon angel-img" />
			<span class="powers">
				<span class="id power-item" title="编号">
					<span class="icon">
						<img draggable="false" :src="getIconSrc()" alt="angel icon" />
					</span>
					<span class="value">#{{ angelData.angel.id }}</span></span
				>
				<span class="addtion power-item" title="种族总值">
					<span class="icon">
						<img
							draggable="false"
							src="https://res.17roco.qq.com/res/item/67371874.png"
							alt="addtion"
						/>
					</span>
					<span class="value">{{ angelData.angel.add }}</span></span
				>
				<span class="health power-item" title="精力">
					<span class="icon">
						<img
							draggable="false"
							src="https://res.17roco.qq.com/plugins/WorldMap/icons/00039.png"
							alt="health"
					/></span>
					<span class="value">{{ angelData.angel.sm }}</span></span
				>
				<span class="physicalAttack power-item" title="物攻">
					<span class="icon">
						<img
							draggable="false"
							src="https://res.17roco.qq.com/plugins/WorldMap/icons/00032.png"
							alt="physicalAttack"
						/>
					</span>
					<span class="value">{{ angelData.angel.wg }}</span></span
				>
				<span class="physicalDefend power-item" title="物抗">
					<span class="icon">
						<img
							draggable="false"
							src="https://res.17roco.qq.com/plugins/WorldMap/icons/00033.png"
							alt="physicalDefend"
						/>
					</span>
					<span class="value">{{ angelData.angel.fy }}</span></span
				>
				<span class="magicAttack power-item" title="魔攻">
					<span class="icon">
						<img
							draggable="false"
							src="https://res.17roco.qq.com/plugins/WorldMap/icons/00034.png"
							alt="magicAttack"
					/></span>
					<span class="value">{{ angelData.angel.mg }}</span></span
				>
				<span class="magicDefend power-item" title="魔抗">
					<span class="icon">
						<img
							draggable="false"
							src="https://res.17roco.qq.com/plugins/WorldMap/icons/00035.png"
							alt="magicDefend"
						/>
					</span>
					<span class="value">{{ angelData.angel.mk }}</span></span
				>
				<span class="speed power-item" title="速度">
					<span class="icon">
						<img
							draggable="false"
							src="https://res.17roco.qq.com/plugins/WorldMap/icons/00036.png"
							alt="speed"
						/>
					</span>
					<span class="value">{{ angelData.angel.sd }}</span></span
				>
			</span>
		</div>
		<div class="info-tab">
			<TabGroup class="flex tab-group" as="div">
				<TabList class="tab-list" v-slot="{ selectedIndex }">
					<Tab :class="['tab', getSelectedTabClass(selectedIndex, 0)]"
						>资料</Tab
					>
					<Tab
						:class="['tab', getSelectedTabClass(selectedIndex, 1)]"
						v-if="angelData.skills"
						>技能 {{ Object.keys(angelData.skills).length }}</Tab
					>
					<Tab
						:class="['tab', getSelectedTabClass(selectedIndex, 2)]"
						v-if="angelData.xm.length"
						>血脉 {{ Object.keys(angelData.xm).length }}</Tab
					>
				</TabList>
				<TabPanels class="tab-panels">
					<TabPanel class="tab-panel info">
						<div class="info-main custom-scrollbar">
							<span class="info-item hight"
								>身高 · {{ angelData.angel.height }}</span
							>
							<span class="info-item weight"
								>体重 · {{ angelData.angel.weight }}</span
							>
							<span class="info-item color"
								>颜色 · {{ angelData.angel.color }}</span
							>
							<span class="info-item exp-type"
								>经验类型 · {{ angelData.angel.expType }}</span
							>
							<span class="info-item group"
								>组别 · {{ angelData.angel.group }} ·
								{{ angelData.angel.groupName }}</span
							>
							<span class="info-item catch-rate"
								>捕捉系数 · {{ angelData.angel.catchrate }}</span
							>
							<span class="info-item habit"
								>爱好 · {{ angelData.angel.interest }}</span
							>
							<span class="info-item description"
								>简介 · {{ angelData.angel.description }}</span
							>
						</div>
					</TabPanel>
					<TabPanel class="tab-panel skill">
						<div class="skill-main custom-scrollbar">
							<span
								v-for="skill of angelData.skills"
								class="skill-item"
								:key="skill.id"
								@click="setupWindowParams(skill.id, skill.name, skill.hash)"
							>
								<span class="id">#{{ skill.id }}</span>
								<span class="name">{{ skill.name }}</span>
								<span class="skill-details">
									<img
										class="feature icon"
										:src="getFeatureIconSrc(skill.property)"
										alt="skill property"
									/>
									<span class="pp">{{ skill.ppMax }}</span> ·
									<span class="power">{{ skill.power }}</span>
								</span>
							</span>
						</div>
					</TabPanel>
					<TabPanel class="tab-panel talent">
						<div class="talent-main custom-scrollbar">
							<span
								v-for="talent in angelData.xm"
								class="talent-item"
								:key="talent.id"
								@dblclick="toggleTalentFix"
							>
								<span class="talent-details">
									<img
										class="talent icon"
										:src="getTalentIconSrc(talent.id)"
										alt="talent icon"
									/>
									<span class="id">#{{ talent.id }}</span>
									<span class="inline-block mx-1">·</span>
									<span class="name">{{ talent.config.name }}</span>
								</span>
								<span class="description">{{
									isShowTalentFix ? talent.xmjx : talent.config.des
								}}</span>
							</span>
						</div>
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</div>
	</div>
</template>

<style lang="postcss">
.tab-group {
	@apply w-full flex-col select-none;
}
.tab-list {
	@apply inline-flex items-center justify-center p-0.5 mx-auto
	bg-slate-200 dark:bg-slate-800
	rounded overflow-hidden transition-all;
}
.tab {
	@apply w-24 inline-flex items-center justify-center
	focus:ring-2 ring-green-400 dark:ring-green-600
	rounded outline-none overflow-hidden transition-all font-black;
}
.tab.selected {
	@apply bg-slate-50 dark:bg-slate-600;
}

.tab-panels {
	@apply w-full p-0.5 mt-1
	rounded overflow-hidden transition-all;
}
.tab-panel {
	@apply w-96 inline-flex
	rounded overflow-hidden transition-all;
}
</style>
<style lang="postcss" scoped>
.names {
	@apply inline-flex w-2/3 py-2 items-center justify-center mt-4
	border-2 border-slate-400 bg-green-200 dark:border-slate-300 dark:bg-green-600
	truncate transition-all rounded-full font-black select-none;
}
.names .features {
	@apply inline-flex mx-2 items-center;
}
.features .icon {
	@apply w-6 h-6 inline-block mx-1;
}
.go-back {
	@apply left-8;
}

.details {
	@apply w-full inline-flex justify-center items-center px-4
	select-none;
}

.angel-img {
	@apply w-48 my-4;
}
.angel-img.icon {
	@apply p-8;
}

.powers {
	@apply w-1/2 inline-flex items-center justify-evenly flex-wrap p-4
	select-none;
}
.power-item {
	@apply relative w-[45%] my-0.5 px-2 py-1 inline-flex justify-between items-center
	border-2 rounded-full overflow-hidden
	border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-500
	transition-all text-sm font-semibold;
}
.power-item .icon {
	@apply inline-block w-5 h-5;
}

.power-item.id .icon {
	@apply absolute w-7 h-7 right-0;
}

.info-main,
.skill-main,
.talent-main {
	@apply max-h-48 w-full flex flex-wrap justify-center
	transition-all overflow-auto;
}
.info-item,
.skill-item,
.talent-item {
	@apply w-fit inline-flex items-center justify-center my-0.5 px-1 py-0.5 mx-0.5
	border border-slate-400 dark:border-slate-300
	bg-slate-100 dark:bg-slate-600
	transition-all rounded text-sm font-semibold;
}

.skill-item {
	@apply hover:bg-slate-200 dark:hover:bg-slate-500
	active:bg-slate-300 dark:active:bg-slate-400
	cursor-pointer;
}

.skill-item .icon {
	@apply inline-block w-3 h-3 mr-0.5;
}
.skill-item .id {
	@apply inline-block mr-0.5
	text-xs;
}
.skill-details {
	@apply inline-flex items-center ml-0.5 px-1 py-px
	border border-green-500 bg-green-200 dark:bg-green-700
	rounded-sm box-content
	text-xs font-black transition-all;
}
.skill-details .pp {
	@apply text-blue-600 dark:text-blue-200
	transition-all;
}
.skill-details .power {
	@apply text-red-500 dark:text-red-300
	transition-all;
}

.talent-item {
	@apply flex-col items-start;
}
.talent-details {
	@apply inline-flex items-center
	text-base;
}
.talent-details .icon {
	@apply inline-block w-8 h-8 m-1;
}
.talent-item .description {
	@apply text-gray-500 dark:text-gray-300
	transition-all whitespace-pre-wrap;
}
</style>
