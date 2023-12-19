<script lang="ts">
export default {
	name: "chainItem",
}
</script>
<script lang="ts" setup>
import { BoltIcon } from "@heroicons/vue/20/solid"
import { Ref, ref, toRefs } from "vue"

import { useApi } from "../composables/useApi"
import { useRouter } from "vue-router"
import { useStorage } from "@vueuse/core"
import { WindowCreator } from "../composables/useWindow"

import type { ChainItemProp } from "../share"

const $props = defineProps<{
	chainTo: ChainItemProp | ChainItemProp[]
}>()
const { chainTo } = toRefs($props)
const { iconStaticURL } = useApi()
const angelIconHashMap = useStorage("rocox-angel-icon-hash-map", new Map())

const iconSrc = (hash: string, angelId: string) => {
	let hashedSrc = angelIconHashMap.value.get(hash)
	if (hashedSrc) return hashedSrc

	let id = parseInt(angelId)
	return `${iconStaticURL}${id < 100 ? "0" : ""}${id}-.png`
}

const $router = useRouter()
const alwaysTargetNewWindow = useStorage("rocox-new-window-target", false)
const angelPageTitle = useStorage("rocox-angel-page-title", "")
const AngelWindow: Ref<WindowCreator | null> = ref(null)

function setupWindowParams(id: string, name: string, hash: string) {
	angelPageTitle.value = `#${id} ${name}`
	AngelWindow.value = new WindowCreator(id, {
		url: `/#/angel/${hash}`,
		title: angelPageTitle.value,
	})

	goAngelView(hash)
}
function goAngelView(hash: string) {
	if (!hash) return false
	if (alwaysTargetNewWindow.value) AngelWindow.value!.setup()
	else
		$router.push({
			name: "Angel",
			params: { hash },
		})
}
</script>

<template>
	<div class="chain-item">
		<template
			v-if="!Array.isArray(chainTo) && chainTo.start"
			class="chain-children"
		>
			<span
				class="angel-item"
				@click="setupWindowParams(chainTo.id!, chainTo.name!, chainTo.hash!)"
			>
				<img
					class="angel-img"
					v-if="chainTo.id"
					:src="iconSrc(chainTo.hash!, chainTo.id!)"
					alt="Angel icon"
					draggable="false"
					loading="lazy"
				/>
				<span class="name"
					><span class="id">#{{ chainTo.id }}</span> · {{ chainTo.name }}</span
				>
			</span>
			<span class="option">
				<BoltIcon class="icon" />
				<span class="lv" v-if="chainTo.lv">Level {{ chainTo.lv }}</span>
				<span class="lv" v-else>Super</span>
			</span>
			<chainItem
				v-if="!(typeof chainTo.to === 'string')"
				:chainTo="chainTo.to!"
			/>
		</template>
		<template v-if="Array.isArray(chainTo)">
			<span v-for="item of chainTo" class="chain-children">
				<span
					class="angel-item"
					@click="setupWindowParams(item.id!, item.name!, item.hash!)"
				>
					<img
						class="angel-img"
						v-if="item.id"
						:src="iconSrc(item.hash!, item.id!)"
						alt="Angel icon"
						draggable="false"
						loading="lazy"
					/>
					<span class="name"
						><span class="id">#{{ item.id }}</span> · {{ item.name }}</span
					>
				</span>
				<span class="option" v-if="!(typeof item.to === 'string')">
					<span class="lv" v-if="item.lv">Level {{ item.lv }}</span>
					<span class="lv" v-else>Super</span>
					<BoltIcon class="icon" />
				</span>
				<chainItem v-if="!(typeof item.to === 'string')" :chainTo="item.to!" />
			</span>
		</template>
	</div>
</template>

<style lang="postcss" scoped>
.chain-item {
	@apply w-full inline-flex flex-col justify-center items-center flex-wrap;
}

.chain-item:not(:has(> .chain-item)) {
	@apply inline-flex flex-row items-start justify-evenly;
}
.chain-item:has(> .chain-item) {
	@apply inline-flex w-full items-center justify-between;
}
.chain-item:has(> .chain-children) {
	@apply gap-2;
}

.chain-children {
	@apply inline-flex flex-col justify-center items-center;
}

.angel-item {
	@apply relative inline-flex items-center justify-center h-8 pr-8 pl-1 py-0.5 my-2
  border-2 rounded hover:bg-slate-200 dark:hover:bg-slate-500
  bg-slate-100 dark:bg-slate-600
	active:bg-slate-300 dark:active:bg-slate-400
	border-green-400 dark:border-green-500
  cursor-pointer overflow-hidden transition-all;

	@apply sm:h-10 sm:pl-2 sm:pr-12;
}
.option {
	@apply relative inline-flex justify-center items-center;
}
.option .lv {
	@apply absolute left-full inline-flex w-fit py-px px-1
  border border-slate-400
  bg-slate-200 dark:bg-slate-600
  translate-x-2 transition-all ease-in-out duration-300
  whitespace-nowrap rounded font-semibold font-mono text-xs;

	@apply sm:translate-x-4 sm:text-sm;
}
.option .icon {
	@apply w-4 h-4 my-0.5;

	@apply sm:w-5 sm:h-5 sm:my-2;
}
.angel-img {
	@apply absolute right-0 inline-block w-7 h-7;

	@apply sm:w-9 sm:h-9;
}
.name {
	@apply inline-block w-fit
  font-semibold text-xs;

	@apply sm:text-sm;
}
.name .id {
	@apply font-mono opacity-60;
}
</style>
