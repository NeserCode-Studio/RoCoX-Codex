<script lang="ts" setup>
// import { ref } from "vue"
import { useStorage } from "@vueuse/core"

const isFullRound = useStorage("roco-avatar-rounded", false)

function toggleAvatarRounded() {
	isFullRound.value = !isFullRound.value
}
</script>

<template>
	<div id="about">
		<div class="avatar-container">
			<img
				src="https://avatars.githubusercontent.com/u/73767966?v=4"
				alt="Author Avatar"
				draggable="false"
				@dblclick="toggleAvatarRounded"
				:class="['avatar', isFullRound ? 'isFullRound' : null]"
				loading="lazy"
			/>
			<span class="author"
				>Code by
				<a draggable="false" target="_blank" href="https://github.com/NeserCode"
					>NeserCode</a
				>
			</span>
		</div>
		<span class="mt-8 font-black">致谢</span>
		<span class="font-black">·</span>
		<span class="api-provide">
			API -
			<a draggable="false" target="_blank" href="https://rocotime.com/"
				>洛克时光团队-RocoTime</a
			>
		</span>
		<span class="res-provide">
			部分游戏静态资源 -
			<a draggable="false" target="_blank" href="https://17roco.qq.com/"
				>洛克王国官方</a
			>
		</span>
		<span class="images">
			<img
				draggable="false"
				class="icon"
				src="../assets/tauri.png"
				alt="Tauri Famework"
			/>
			<img
				draggable="false"
				class="icon"
				src="../assets/vue.svg"
				alt="Vue Famework"
			/>
			<img
				draggable="false"
				class="icon"
				src="../assets/vscode.png"
				alt="VSCode Editor"
			/>
			<img
				draggable="false"
				class="icon"
				src="../assets/tailwindcss.png"
				alt="Tailwind Css Famework"
			/>
			<img
				draggable="false"
				class="icon"
				src="../assets/typescript.png"
				alt="TypeScript Language"
			/>
		</span>
		<span class="warn-massage">
			应用中部分资源来源自网络 <br />
			若这部分资源的使用侵犯了您的权力，请告知 <br />
			·
		</span>
		<span class="right">
			All right reserved by
			<a draggable="false" target="_blank" href="https://github.com/NeserCode"
				>NeserCode</a
			>
		</span>
	</div>
</template>

<style lang="postcss" scoped>
a {
	@apply underline font-black text-green-500;
}
span,
a,
img {
	@apply select-none;
}

.avatar-container {
	@apply w-full flex flex-col justify-center items-center mt-8;
}

.avatar {
	@apply w-32 h-32 inline-flex justify-center items-center
	rounded-lg shadow-xl transition-all;
}
.avatar.isFullRound {
	@apply rounded-full;
}

.author {
	@apply inline-block py-0.5 mt-4
	text-xs select-none;
}

.api-provide,
.res-provide {
	@apply text-sm;
}

.separate {
	@apply block w-12 h-px my-4
	border-t;
}

.images {
	@apply inline-flex justify-center items-center py-2;
}
.images .icon {
	@apply inline-block w-8 h-8 mx-1;
}

.warn-massage,
.right {
	@apply fixed inline-block text-center
	text-xs font-black;
}
.warn-massage {
	@apply bottom-8;
}
.right {
	@apply bottom-4;
}
</style>