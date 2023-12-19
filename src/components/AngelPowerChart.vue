<script lang="ts" setup>
import { useStorage } from "@vueuse/core"
import * as echarts from "echarts"
import {
	computed,
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	toRefs,
	watch,
} from "vue"

import { useDarkMode } from "../composables/useDarkMode"

import type { ECharts } from "echarts"
import type { AngelDataObject } from "../share"

const $props = defineProps<{
	angel: AngelDataObject
}>()
const { angel } = toRefs($props)

const chart = ref<ECharts | null>(null)
const chartBody = ref<HTMLDivElement>()
const isMini = useStorage("rocox-mini", true)
const { isDarkMode } = useDarkMode()

const init = () => {
	chart.value = echarts.init(chartBody.value, "", {
		renderer: "svg",
		...bounding.value,
	})
	chart.value.setOption(opt.value)
}

const bounding = computed(() => ({
	width: isMini.value ? 160 : 256,
	height: isMini.value ? 160 : 256,
}))
const chartValues = computed(() => [
	angel.value.wg,
	angel.value.mg,
	angel.value.fy,
	angel.value.mk,
	angel.value.sm,
	angel.value.sd,
])
const powerLimit = computed(() =>
	parseInt(angel.value.id ?? "99999") > 10000 ? 300 : 200
)
const optTitleColor = computed(() => (isDarkMode.value ? "#ccc" : "#333"))
const optTextColor = computed(() => (isDarkMode.value ? "#aaa" : "#555"))
const optBorderColor = computed(() => (isDarkMode.value ? "#666" : "#ccc"))
const optBlurBg = computed(() =>
	isDarkMode.value ? "rgba(32, 32, 32, 0.5)" : "rgba(255, 255, 255, 0.5)"
)
const opt = computed(() => ({
	title: {
		text: isMini.value ? angel.value.add : "种族值",
		subtext: isMini.value ? undefined : angel.value.add,
		textStyle: {
			color: optTitleColor.value,
		},
	},
	tooltip: {
		show: true,
		position: isMini.value ? ["-70%", "-5%"] : undefined,
		hideDelay: 500,
		confine: !isMini.value,
		className: "tooltip",
		backgroundColor: optBlurBg.value,
		textStyle: {
			color: optTextColor.value,
			fontSize: isMini.value ? 12 : 14,
		},
	},
	animationDuration: 300,
	radar: {
		center: ["50%", "50%"],
		nameGap: 5,
		slient: true,
		indicator: [
			{
				name: `物攻`,
				min: 0,
				max: powerLimit.value,
				color: optTextColor.value,
			},
			{
				name: `魔攻`,
				min: 0,
				max: powerLimit.value,
				color: optTextColor.value,
			},
			{
				name: `物抗`,
				min: 0,
				max: powerLimit.value,
				color: optTextColor.value,
			},
			{
				name: `魔抗`,
				min: 0,
				max: powerLimit.value,
				color: optTextColor.value,
			},
			{
				name: `精力`,
				min: 0,
				max: powerLimit.value,
				color: optTextColor.value,
			},
			{
				name: `速度`,
				min: 0,
				max: powerLimit.value,
				color: optTextColor.value,
			},
		],
		axisLine: {
			show: false,
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: optBorderColor.value,
				width: 2,
			},
		},
	},
	series: [
		{
			name: "种族值",
			type: "radar",
			select: {
				disabled: true,
				selectedMode: "single",
			},
			data: [
				{
					value: chartValues.value,
					tooltip: chartValues.value,
				},
			],
		},
	],
}))

onMounted(() => {
	watch(
		opt,
		() => {
			if (!chart.value) {
			} else chart.value?.dispose()

			nextTick(() => {
				init()
			})
		},
		{
			immediate: true,
			deep: true,
		}
	)
})
onUnmounted(() => {
	if (chart.value !== null) chart.value.dispose()
})
</script>

<template>
	<div class="chart-container">
		<div id="power-chart" ref="chartBody"></div>
	</div>
</template>

<style lang="postcss" scoped>
.chart-container {
	@apply flex items-center justify-center w-48 h-48
  rounded-md dark:bg-slate-800
  transition-all ease-in-out duration-300;

	@apply sm:w-72 sm:h-72;
}
#power-chart {
	@apply w-40 h-40;
	@apply sm:w-64 sm:h-64;
}
#power-chart div {
	@apply overflow-auto;
}
</style>
<style lang="postcss">
.tooltip {
	@apply backdrop-blur;
}
</style>
