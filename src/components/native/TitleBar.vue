<script lang="ts" setup>
import {
	MinusIcon,
	XMarkIcon,
	SunIcon,
	MoonIcon,
	PaperClipIcon,
	Square2StackIcon,
} from "@heroicons/vue/20/solid"
import { ref, onMounted, toRefs, watch, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStorage, useThrottleFn } from "@vueuse/core"

import { appWindow } from "@tauri-apps/api/window"

import { useDarkMode } from "../../composables/useDarkMode"
import { toggleMiniWindow } from "../../composables/useWindow"
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut"
import { Collections } from "../../share"

const $props = withDefaults(
	defineProps<{
		titleText?: string
	}>(),
	{
		titleText: "Rocox Codex",
	}
)
const { titleText } = toRefs($props)
const $route = useRoute()
const $router = useRouter()

const title = ref("Rocox")
const isAlwaysonTop = useStorage("rocox-always-on-top", false)
const isMini = useStorage("rocox-mini", true)
const category = useStorage("rocox-category", "angels")
const categoryNameMap = new Map([
	["angels", "精灵"],
	["skills", "技能"],
	["items", "物品"],
])
const routeNameMap = new Map([
	["Angel", "精灵"],
	["Skill", "技能"],
])

function updateTitle() {
	if (!!$route.meta.titleStorageKey)
		title.value =
			routeNameMap.get($route.name as string)! +
			" · " +
			localStorage.getItem($route.meta.titleStorageKey as string)!
	else {
		switch ($route.name) {
			case "Home":
				title.value = categoryNameMap.get(category.value)!
				break
			case "About":
				title.value = "关于"
				break
			case "Help":
				title.value = "帮助"
				break
			default:
				title.value = $route.name as string
				break
		}
	}
}

watch(
	titleText,
	(value) => {
		title.value = value
	},
	{
		immediate: true,
	}
)

watch($route, (_route) => {
	updateTitle()
})
watch(category, (_route) => {
	updateTitle()
})

const ispinnedClass = computed(() => {
	return isAlwaysonTop.value ? "pinned" : null
})
const miniClass = computed(() => {
	return isMini.value ? "mini" : null
})

// Initial top
onMounted(async () => {
	await appWindow.setAlwaysOnTop(isAlwaysonTop.value)
	await toggleMiniWindow(isMini.value)
})

async function toggleIspinned() {
	isAlwaysonTop.value = !isAlwaysonTop.value
	await appWindow.setAlwaysOnTop(isAlwaysonTop.value)
}
const throttleToggleIspinned = useThrottleFn(() => {
	toggleIspinned()
}, 800)
const throttleToggleMini = useThrottleFn(async () => {
	await toggleMiniWindow(!isMini.value)
}, 800)

function minimize() {
	let element = document.querySelector(".minimize.btn") as HTMLElement
	element.classList.remove("moving")
	appWindow.minimize()
}

async function close() {
	await appWindow.close()
}

function addMoveClass(event: MouseEvent) {
	let element = event.target as HTMLElement
	element.classList.add("moving")
}
function removeMoveClass(event: MouseEvent) {
	let element = event.target as HTMLElement
	element.classList.remove("moving")
}

const { isDarkMode, toggleDarkMode } = useDarkMode()
const isRoundedAvatar = useStorage("rocox-avatar-rounded", false)
const alwaysUseFocusShortcut = useStorage("rocox-shortcut-use-focus", true)
const $UserCollections = useStorage<Collections>(
	"rocox-user-collections",
	new Map()
)

onMounted(async () => {
	await unregisterAll()
	await register("CommandOrControl+D", async () => {
		if (alwaysUseFocusShortcut.value) {
			if (await appWindow.isFocused()) toggleDarkMode()
		} else toggleDarkMode()

		$UserCollections.value.set(
			"KeyShortCut",
			($UserCollections.value.get("KeyShortCut") ?? 0) + 1
		)
	})
	await register("CommandOrControl+P", async () => {
		if (alwaysUseFocusShortcut.value) {
			if (await appWindow.isFocused()) throttleToggleIspinned()
		} else throttleToggleIspinned()

		$UserCollections.value.set(
			"KeyShortCut",
			($UserCollections.value.get("KeyShortCut") ?? 0) + 1
		)
	})
	await register("CommandOrControl+Q", async () => {
		if (isRoundedAvatar.value) {
			if (alwaysUseFocusShortcut.value) {
				if (await appWindow.isFocused()) $router.go(0)
			} else $router.go(0)

			$UserCollections.value.set(
				"KeyShortCut",
				($UserCollections.value.get("KeyShortCut") ?? 0) + 1
			)
		}
	})
})
</script>

<template>
	<div id="app-title-bar" data-tauri-drag-region>
		<span class="title" data-tauri-drag-region>
			<span data-tauri-drag-region>{{ title }} · RoCoX</span>
		</span>
		<div class="buttons" data-tauri-drag-region>
			<span
				:class="['btn', 'pin', ispinnedClass]"
				@mouseenter="addMoveClass"
				@mouseleave="removeMoveClass"
				@click="throttleToggleIspinned"
			>
				<PaperClipIcon class="icon" />
			</span>
			<span
				:class="['btn', 'screen', miniClass]"
				@mouseenter="addMoveClass"
				@mouseleave="removeMoveClass"
				@click="throttleToggleMini"
			>
				<Square2StackIcon class="icon" />
			</span>
			<span
				class="btn darkmode"
				@mouseenter="addMoveClass"
				@mouseleave="removeMoveClass"
				@click="toggleDarkMode()"
			>
				<SunIcon v-show="!isDarkMode" />
				<MoonIcon v-show="isDarkMode" />
			</span>
			<span
				class="btn minimize"
				@mouseenter="addMoveClass"
				@mouseleave="removeMoveClass"
				@click="minimize"
			>
				<MinusIcon />
			</span>
			<span
				class="btn close danger"
				@mouseenter="addMoveClass"
				@mouseleave="removeMoveClass"
				@click="close"
			>
				<XMarkIcon />
			</span>
		</div>
	</div>
</template>

<style scoped lang="postcss">
#app-title-bar {
	@apply relative inline-flex items-center justify-end w-full h-8
	border-b border-slate-300 dark:border-slate-600
	bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-200
	transition-all
  select-none;

	z-index: 99999999;
}

.title {
	@apply absolute inline-flex items-center top-1/2 left-2
	text-sm font-black
	-translate-y-1/2;
}

.buttons {
	@apply inline-flex flex-row items-center justify-end w-full h-full;
}

.btn {
	@apply inline-flex items-center justify-center w-12 h-full py-2 px-3
	cursor-pointer rounded-none
	text-slate-600 dark:text-slate-100 
	transition ease-in-out duration-300;
}
.moving {
	@apply bg-slate-600 text-slate-100;
}
.moving.danger {
	@apply bg-red-400;
}

.darkmode {
	@apply w-10 py-1.5 px-3;
}

.pin {
	@apply w-10 p-0;
}
.pin .icon {
	@apply w-5 p-1 transition-all
	rounded scale-125;
}
.pin.moving .icon {
	@apply rotate-[135deg];
}

.pin.pinned .icon {
	@apply bg-slate-600 text-slate-100 rotate-[135deg] scale-100;
}

.screen {
	@apply w-10 p-0;
}
.screen .icon {
	@apply w-5 p-1 transition-all
	rounded scale-125;
}
</style>
