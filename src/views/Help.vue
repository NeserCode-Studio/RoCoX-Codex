<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue"
import { ChevronUpIcon } from "@heroicons/vue/20/solid"

import type { Help } from "../share"

const getComputedOpenClass = (state: any) => {
	return !!state ? "open" : null
}
const defaultOpenList: number[] = [1]
const getDefaultOpenState = (id: number) => {
	return defaultOpenList.includes(id)
}
const helpList: Help[] = [
	{
		id: 1,
		question: "快捷键 · 我能使用什么快捷键",
		answer:
			"1. 使用 Ctrl+Q 进行快速刷新；" +
			"\n2. 使用 Ctrl+P 进行切换软件置顶状态。" +
			"\n3. 使用 Ctrl+D 进行切换软件主题状态。",
	},
	{
		id: 2,
		question: "快捷键 · 为什么不推荐使用快捷键",
		answer:
			"1. 由于软件基层使用的快捷键拦截机制会导致用户对应的全局键盘事件劫持，从用户操作性上考虑软件本应当默认禁用快捷键；" +
			"\n2. 快捷键一般用于开发调试所用，且在多窗口快捷键的机制上是有一定的次序缺陷（同样由本解第一点中提出的问题引起），暂时软件默认禁用部分快捷键。",
	},
	{
		id: 3,
		question: "快捷键&开发模式 · 如何启用开发模式及刷新快捷键",
		answer: "暂不提供",
	},
	{
		id: 4,
		question: "数据 · 为什么部分数据不对/不公开/无法显示",
		answer:
			"1. 接口数据造成的错误不由本软件负责；" +
			"\n2. 异常数据大多是由于网络接口开发人员设计上的不合理或是缺陷造成，其中官方的静态资源例如宠物的小头像命名与存储比较杂乱" +
			"，本软件有使用记忆缓存的方法记忆正确资源，在第二次访问该异常头像资源会恢复正常，而其他问题资源则暂时无法解决；",
	},
]
</script>

<template>
	<div>
		<div class="disclosure-main custom-scrollbar">
			<Disclosure
				v-for="help in helpList"
				:key="help.id"
				as="div"
				class="disclosure"
				v-slot="{ open }"
				:defaultOpen="getDefaultOpenState(help.id)"
			>
				<DisclosureButton class="disclosure-btn">
					<span class="id">#{{ help.id }}</span>
					<span class="question">{{ help.question }}</span>
					<ChevronUpIcon :class="['icon', getComputedOpenClass(open)]" />
				</DisclosureButton>
				<transition
					enter-active-class="transition duration-100 ease-out"
					enter-from-class="transform scale-95 opacity-0"
					enter-to-class="transform scale-100 opacity-100"
					leave-active-class="transition duration-75 ease-out"
					leave-from-class="transform scale-100 opacity-100"
					leave-to-class="transform scale-95 opacity-0"
				>
					<DisclosurePanel class="disclosure-panel">
						<span class="answer">{{ help.answer }}</span>
					</DisclosurePanel>
				</transition>
			</Disclosure>
		</div>
	</div>
</template>

<style lang="postcss">
.disclosure-main {
	@apply flex flex-col w-full max-h-[30rem] p-2 gap-2 mx-auto
  bg-teal-100 dark:bg-teal-800
  rounded transition-all ease-in-out
  select-none overflow-y-auto;

	@apply sm:max-h-[42rem];
}
.disclosure-btn {
	@apply flex justify-between w-full px-4 py-2
  text-sm font-medium text-left
  bg-sky-200 dark:bg-sky-700
  focus:ring-2 ring-green-400 dark:ring-green-600
  rounded outline-none
  transition-all ease-in-out;
}
.disclosure-panel {
	@apply px-4 pt-4 pb-2
  opacity-80
  whitespace-pre-line
  transition-all ease-in-out;
}
</style>
<style lang="postcss" scoped>
.disclosure-btn .icon {
	@apply w-5 h-5
  transition-all ease-in-out;
}
.disclosure-btn .icon.open {
	@apply rotate-180;
}

.question {
	@apply font-black text-base;
}
.answer {
	@apply font-semibold text-sm;
}
</style>
