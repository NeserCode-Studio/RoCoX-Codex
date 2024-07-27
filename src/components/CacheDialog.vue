<script lang="ts" setup>
import Dialog from './native/Dialog.vue'
import Popover from './native/Popover.vue'

import { ref } from 'vue'
import { ListPagesDatabase } from '../db'
import { attemptGenerateRequest } from '../composables/useHttp'
import { StorageSerializers, useStorageAsync } from '@vueuse/core'

const isOpen = defineModel<boolean>('isOpen', {
	default: false,
})
const closeModel = () => {}

const $db = ref<ListPagesDatabase>(new ListPagesDatabase())

const urlList = {
	angel: 'https://api.rocotime.com/api/spiritList/',
	skill: 'https://api.rocotime.com/api/Skilllist/',
	item: 'https://api.rocotime.com/api/Itemlist/',
}
const getListPageAttempt = (type: 'angel' | 'skill' | 'item') => {
	return async () =>
		await attemptGenerateRequest(
			urlList[type],
			{
				attempt(params) {
					return {
						...params,
						page: params.page + 1,
					}
				},
				confirm: (data) => !data.length,
				onProgress: (load) => {
					console.log(`Loaded ${load} pages.`)
				},
			},
			{
				search: '',
				id: '',
				feature: '',
				page: 1,
			}
		)
}

const cacheList = async (type: 'angel' | 'skill' | 'item') => {
	const listPages = await getListPageAttempt(type)()

	switch (type) {
		case 'angel':
			await $db.value.deleteAngel()
			console.log('[Debug Database] Reset angels db')
			await $db.value.addAngel(listPages as any)
			break
		case 'skill':
			await $db.value.deleteSkill()
			console.log('[Debug Database] Reset skills db')
			await $db.value.addSkill(listPages as any)
			break
		case 'item':
			await $db.value.deleteItem()
			console.log('[Debug Database] Reset items db')
			await $db.value.addItem(listPages as any)
			break
	}
}

const isAngelListCached = useStorageAsync<boolean>(
	'rocox-cached-list-angel',
	false,
	undefined,
	{
		serializer: {
			read: async () => (await $db.value.sizes.angels()) !== 0,
			write: StorageSerializers.boolean.write,
		},
	}
)
const isSkillListCached = useStorageAsync<boolean>(
	'rocox-cached-list-skill',
	false,
	undefined,
	{
		serializer: {
			read: async () => (await $db.value.sizes.skills()) !== 0,
			write: StorageSerializers.boolean.write,
		},
	}
)
const isItemListCached = useStorageAsync<boolean>(
	'rocox-cached-list-item',
	false,
	undefined,
	{
		serializer: {
			read: async () => (await $db.value.sizes.items()) !== 0,
			write: StorageSerializers.boolean.write,
		},
	}
)
</script>

<template>
	<Dialog
		v-model:is-open="isOpen"
		:close="closeModel"
		:model-enabled="false"
		class="dialog"
	>
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
								Angel: {{ isAngelListCached ? '已缓存' : '未缓存' }}
								<br />
								Skill: {{ isSkillListCached ? '已缓存' : '未缓存' }}
								<br />
								Item: {{ isItemListCached ? '已缓存' : '未缓存' }}
							</div>
						</template>
					</Popover>
				</div>

				<div class="test-btns">
					<button
						type="button"
						class="btn"
						title="test"
						@click="cacheList('angel')"
					>
						获取所有 Angel
					</button>
					<button
						type="button"
						class="btn"
						title="test"
						@click="cacheList('skill')"
					>
						获取所有 Skill
					</button>
					<button
						type="button"
						class="btn"
						title="test"
						@click="cacheList('item')"
					>
						获取所有 Item
					</button>
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
	@apply relative w-full inline-flex flex-wrap justify-center items-center gap-2 p-2
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

.test-btns {
	@apply flex justify-center items-center gap-x-2 gap-y-1 flex-wrap mt-2;
}
.test-btns .btn {
	@apply inline-flex justify-center items-center px-2 py-0.5
  text-sm rounded bg-slate-200  dark:bg-slate-700
	transition-colors ease-in-out duration-300;
}
</style>
