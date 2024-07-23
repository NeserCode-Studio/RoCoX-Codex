<script lang="ts" setup>
import Dialog from './native/Dialog.vue'
import Popover from './native/Popover.vue'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'

import { useStorage } from '@vueuse/core'

const isOpen = defineModel<boolean>('isOpen', {
	default: false,
})
const closeModel = () => {}

const angelListCached = useStorage('rocox-cached-list-angel', false)
const skillListCached = useStorage('rocox-cached-list-skill', false)
const itemListCached = useStorage('rocox-cached-list-item', false)
const angelCached = useStorage('rocox-cached-angel', false)
const skillCached = useStorage('rocox-cached-skill', false)
const itemCached = useStorage('rocox-cached-item', false)

const states = [
	{
		key: 'angelListCached',
		label: '精灵列表',
		value: angelListCached.value,
	},
	{
		key: 'skillListCached',
		label: '技能列表',
		value: skillListCached.value,
	},
	{
		key: 'itemListCached',
		label: '物品列表',
		value: itemListCached.value,
	},
	{
		key: 'angelCached',
		label: '精灵',
		value: angelCached.value,
	},
	{
		key: 'skillCached',
		label: '技能',
		value: skillCached.value,
	},
	{
		key: 'itemCached',
		label: '物品',
		value: itemCached.value,
	},
]
</script>

<template>
	<Dialog v-model:is-open="isOpen" :close="closeModel" class="dialog">
		<template #title>缓存管理</template>
		<template #details>
			<div class="cache-details">
				<div class="cache-states">
					<Popover>
						<template #btn>
							<span class="btn-text">查看当前缓存状态</span>
						</template>
						<template #content>
							<div class="pop-content">
								<div class="item" v-for="state in states" :key="state.key">
									<span class="label">{{ state.label }}</span>
									<CheckCircleIcon class="icon" v-if="state.value" />
									<XCircleIcon class="icon" v-else />
								</div>
							</div>
						</template>
					</Popover>
				</div>
			</div>
		</template>
		<template #close> 退出 </template>
	</Dialog>
</template>

<style lang="postcss" scoped>
.cache-details {
	@apply h-80 pt-2;
}

.cache-states {
	@apply w-full flex justify-center items-center;
}
.cache-states .btn-text {
	@apply text-sm;
}
.pop-content {
	@apply w-full inline-flex flex-wrap justify-center items-center gap-2 p-2
  rounded border-2 border-slate-300 bg-sky-100
  dark:border-slate-700 dark:bg-slate-600
  transition-colors ease-in-out duration-300;
}
.pop-content .item {
	@apply w-1/4 inline-flex justify-between items-center gap-1;
}
.pop-content .item .label {
	@apply text-sm;
}
.pop-content .item .icon {
	@apply w-4 h-4;
}
</style>
