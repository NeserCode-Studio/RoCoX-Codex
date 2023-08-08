<script lang="ts" setup>
import {
	MinusIcon,
	XMarkIcon,
	SunIcon,
	MoonIcon,
} from "@heroicons/vue/20/solid"
import { ref } from "vue"
import { appWindow } from "@tauri-apps/api/window"
import { useDarkMode } from "../../composables/useDarkMode"

const title = ref("Roco Codex")

function minimize() {
	let element = document.querySelector(".minimize.btn") as HTMLElement
	element.classList.remove("moving")
	appWindow.minimize()
}

function close() {
	appWindow.close()
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
</script>

<template>
	<div id="app-title-bar" data-tauri-drag-region>
		<span class="title" data-tauri-drag-region>
			<!-- <span class="icon" data-tauri-drag-region>
				<img src="../../assets/hf.jpg" alt="!@" />
			</span> -->
			<span data-tauri-drag-region>{{ title }}</span>
		</span>
		<div class="buttons" data-tauri-drag-region>
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
	border-b border-slate-500
	bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200
	transition-all
  select-none;
}

.title {
	@apply absolute inline-flex items-center top-1/2 left-2 text-sm
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
</style>
