<script setup lang="ts">
import TitleBar from "./components/native/TitleBar.vue"
import Dialog from "./components/Dialog.vue"
import TopLinks from "./components/TopLinks.vue"

import { ref, provide, onMounted, nextTick } from "vue"
import { useStorage } from "@vueuse/core"
import { UpdateTitleFunctionalKey } from "./tokens"
import { useDeCryptKey } from "./composables/useLocal"

import { listen } from "@tauri-apps/api/event"

const salt = useStorage("rocox-dev-salt", "")
const password = useStorage("rocox-dev-password", "")
const useDev = useStorage("rocox-dev-tools-state", false)
const isRoundedAvatar = useStorage("rocox-avatar-rounded", false)

const isOpenModelDialog = ref(isRoundedAvatar.value)
const slideDirection = useStorage(
	"rocox-navigation-transition-direction",
	"slideleft"
)

const title = ref("RocoKingdom Codex")
function titleUpdateFn(change: string) {
	title.value = change
}
provide(UpdateTitleFunctionalKey, { titleUpdateFn })

interface Payload {
	key: string
	action: string
}

onMounted(async () => {
	useDev.value = useDeCryptKey(salt.value, password.value)
	if (useDev.value)
		nextTick(() => {
			isOpenModelDialog.value = false
		})

	// await invoke("use_keytools")
	const unlisten = async () => {
		return await listen<Payload>("key", (event) => {
			console.log(
				`Event: ${event.event} #${event.payload!.key}/${event.payload.action}`
			)
		})
	}

	unlisten()
	const injectPreventKey = ["u", "r", "f", "g"]
	document.addEventListener("keydown", function (e) {
		if (injectPreventKey.includes(e.key) && (e.ctrlKey || e.metaKey)) {
			console.log(`[Inject Prevent Key]`, e.key)

			e.preventDefault()
		}
	})
	// Ctrl/Meta + Mouse
	document.addEventListener("click", function (e) {
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault()
		}
	})
})
</script>

<template>
	<div id="app-main" @contextmenu.prevent>
		<TitleBar :titleText="title" />
		<Dialog v-model:isOpen="isOpenModelDialog" />
		<TopLinks />

		<router-view id="context" v-slot="{ Component }">
			<Transition :name="slideDirection" mode="out-in" :appear="true">
				<keep-alive :include="['Home', 'About', 'Help']">
					<component :is="Component" :key="$route.fullPath" />
				</keep-alive>
			</Transition>
		</router-view>
	</div>
</template>

<style lang="postcss">
html.dark {
	color-scheme: dark;
}

@font-face {
	src: url("./assets/SourceHanSerifCN-VF.ttf");
	font-family: "SourceHanSerifCN";
}

.custom-scrollbar::-webkit-scrollbar {
	@apply w-2;
}
.custom-scrollbar::-webkit-scrollbar-track {
	@apply rounded-full bg-slate-200 dark:bg-slate-600;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	@apply rounded-full bg-slate-400;
}
</style>

<style lang="postcss">
.slideleft-enter-active,
.slideleft-leave-active,
.slideup-enter-active,
.slideup-leave-active,
.slidedown-enter-active,
.slidedown-leave-active,
.slideright-enter-active,
.slideright-leave-active {
	@apply transition-all;
}

.slideleft-enter-from,
.slideleft-leave-to {
	@apply translate-x-4 opacity-0;
}
.slideright-enter-from,
.slideright-leave-to {
	@apply -translate-x-4 opacity-0;
}
.slideup-enter-from {
	@apply translate-y-0 opacity-0;
}
.slideup-leave-to {
	@apply translate-y-2 opacity-0;
}
.slidedown-enter-from {
	@apply translate-y-0 opacity-0;
}
.slidedown-leave-to {
	@apply -translate-y-2 opacity-0;
}
</style>

<style scoped lang="postcss">
#app-main {
	@apply relative w-full min-h-screen
	border border-slate-400
	bg-slate-50 dark:bg-slate-700
	text-slate-700 dark:text-slate-100
	transition-all duration-200 ease-in-out
	overflow-hidden;

	font-family: "SourceHanSerifCN";
}

#context {
	@apply relative flex w-full h-full max-h-[34rem] flex-col justify-start items-center px-4;

	@apply sm:px-12 sm:max-h-[50rem];
}
</style>
