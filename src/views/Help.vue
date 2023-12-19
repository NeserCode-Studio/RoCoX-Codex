<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue"
import { ChevronUpIcon } from "@heroicons/vue/20/solid"
import type { Collections, Help } from "../share"
import { useStorage } from "@vueuse/core"

const getComputedOpenClass = (state: any) => {
	return !!state ? "open" : null
}
const defaultOpenList: number[] = [1, 2, 3, 4, 5, 6]
const getDefaultOpenState = (id: number) => {
	return defaultOpenList.includes(id)
}
const $UserCollections = useStorage<Collections>(
	"rocox-user-collections",
	new Map()
)

const helpList: Help[] = [
	{
		id: 1,
		question: "数据 · 为什么部分数据不对/不公开/无法显示",
		answer:
			"1. 接口数据造成的错误不由本软件负责，本软件没有设计任何网络接口，所使用的接口皆为网络资源；" +
			"\n2. 异常数据大多是由于网络接口开发人员设计上的不合理或是缺陷造成，其中官方的静态资源例如宠物的小头像命名与存储比较杂乱" +
			"，本软件有使用记忆缓存的方法记忆正确资源，在第二次访问该异常头像资源会恢复正常，而其他问题资源由于软件架构则暂时无法解决；" +
			"\n3. 目前存在的异常数据：宠物等分页数据（分页接口不规范）、技能属性筛选数据（技能接口未完善）、宠物头像数据（官方早期资源命名错乱）" +
			"、物品列表无法按序号索引（物品接口未完善）等，其中官方现在或是即将发布的宠物、技能信息错乱是由于官方未公开该部分信息，只需等待数据更新即可。",
	},
	{
		id: 2,
		question: "网络 · 为什么重新启动应用仍无法获取数据",
		answer:
			"大概率是系统代理差异带来的问题，如果用户正在使用代理，请开启PAC模式后重试。" +
			"若仍无法获取数据，用户想使用本软件则只能关闭代理。",
	},
	{
		id: 3,
		question: "“关怀”模式 · 如何切换到更大的显示模式 ",
		answer:
			"现在，可以点击右上角第二个图标切换迷你模式与“关怀”模式以获得更好的观感体验。" +
			"\n显然，两者在此之外没有明显区别。",
	},
	{
		id: 4,
		question: "快捷键 · 我能使用什么快捷键",
		answer:
			"0. 普通用户不推荐使用快捷键" +
			"\n<s>1. 使用 Ctrl+Q 进行快速刷新</s>（已与开发者模式绑定并默认禁用）；" +
			"\n2. 使用 Ctrl+P 进行切换软件置顶状态。" +
			"\n3. 使用 Ctrl+D 进行切换软件主题状态。",
	},
	{
		id: 5,
		question: "快捷键 · 为什么不推荐使用快捷键",
		answer:
			"1. 由于软件基层使用的快捷键拦截机制会导致用户对应的全局键盘事件劫持，从用户操作性上考虑软件本应当默认禁用快捷键。" +
			"而实际上，版本 1.1.0-beta.2 是最后软件功能中默认开启快捷键的版本。" +
			"\n2. 快捷键一般用于开发调试所用，且在多窗口快捷键的机制上是有一定的次序缺陷（同样由本解第一点中提出的问题引起）。",
	},
	{
		id: 6,
		question: "快捷键&开发模式 · 如何启用开发模式及刷新快捷键",
		answer: "开发模式开启后，除非用户清空数据否则无法关闭该模式，暂不提供。",
	},
	{
		id: 7,
		question: "统计",
		answer:
			"用户自数据记录起" +
			`\n1. 按下了 ${
				$UserCollections.value.get("KeyShortCut") ?? 0
			} 次快捷键；` +
			`\n2.获取了 ${
				$UserCollections.value.get("GetAngelList") ?? 0
			} 次精灵列表；` +
			`\n3.获取了 ${
				$UserCollections.value.get("GetSkillList") ?? 0
			} 次技能列表；` +
			`\n4.获取了 ${
				$UserCollections.value.get("GetItemList") ?? 0
			} 次物品列表；` +
			`\n5.查看了 ${
				$UserCollections.value.get("GetAngel") ?? 0
			} 次精灵详细信息；` +
			`\n6.查看了 ${
				$UserCollections.value.get("GetSkill") ?? 0
			} 次技能详细信息。`,
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
				class="disclosure item"
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
						<span class="answer" v-html="help.answer"></span>
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
  select-none overflow-y-auto snap-y snap-proximity;

	@apply sm:max-h-[48rem];
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
  whitespace-pre-line
  transition-all ease-in-out;
}
</style>
<style lang="postcss" scoped>
.disclosure-main .item {
	@apply snap-start scroll-mt-2;
}
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
	@apply font-bold text-sm;
}
</style>
