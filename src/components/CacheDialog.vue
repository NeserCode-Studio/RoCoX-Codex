<script lang="ts" setup>
import Dialog from './native/Dialog.vue'
import Popover from './native/Popover.vue'
import { XCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'

import { reactive, ref } from 'vue'
import { ListPagesDatabase } from '../db'
import { attemptGenerateRequest } from '../composables/useHttp'
import { StorageSerializers, useStorageAsync } from '@vueuse/core'

const isOpen = defineModel<boolean>('isOpen', {
	default: false,
})
const closeModel = () => {}

const $db = ref<ListPagesDatabase>(new ListPagesDatabase())
const counters = reactive({
	angel: 0,
	skill: 0,
	item: 0,
})

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
					counters[type] = load
					switch (type) {
						case 'angel':
							isAngelListCached.value = false
							break
						case 'skill':
							isSkillListCached.value = false
							break
						case 'item':
							isItemListCached.value = false
							break
					}
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

const isAngelListCached = useStorageAsync<boolean>(
	'rocox-cached-list-angel',
	false,
	undefined,
	{
		serializer: {
			read: async () => {
				const counter = await $db.value.sizes.angels()
				counters.angel = counter
				return counter !== 0
			},
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
			read: async () => {
				const counter = await $db.value.sizes.skills()
				counters.skill = counter
				return counter !== 0
			},
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
			read: async () => {
				const counter = await $db.value.sizes.items()
				counters.item = counter
				return counter !== 0
			},
			write: StorageSerializers.boolean.write,
		},
	}
)

const cacheList = async (type: 'angel' | 'skill' | 'item') => {
	counters[type] = 0
	const listPages = await getListPageAttempt(type)()
	switch (type) {
		case 'angel':
			isAngelListCached.value = false
			break
		case 'skill':
			isSkillListCached.value = false
			break
		case 'item':
			isItemListCached.value = false
			break
	}
	switch (type) {
		case 'angel':
			await $db.value.deleteAngel()
			console.log('[Debug Database] Reset angels db')
			await $db.value.addAngel(listPages as any)
			counters.angel = await $db.value.sizes.angels()
			isAngelListCached.value = true
			break
		case 'skill':
			await $db.value.deleteSkill()
			console.log('[Debug Database] Reset skills db')
			await $db.value.addSkill(listPages as any)
			counters.skill = await $db.value.sizes.skills()
			isSkillListCached.value = true
			break
		case 'item':
			await $db.value.deleteItem()
			console.log('[Debug Database] Reset items db')
			await $db.value.addItem(listPages as any)
			counters.item = await $db.value.sizes.items()
			isItemListCached.value = true
			break
	}
}

const clearList = async (type: 'angel' | 'skill' | 'item') => {
	switch (type) {
		case 'angel':
			await $db.value.deleteAngel()
			isAngelListCached.value = false
			counters.angel = 0
			break
		case 'skill':
			await $db.value.deleteSkill()
			isSkillListCached.value = false
			counters.skill = 0
			break
		case 'item':
			await $db.value.deleteItem()
			isItemListCached.value = false
			counters.item = 0
			break
	}

	console.log('[Debug Database] Clear table:', type)
}
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
					<span class="state">
						<span class="label-text">Angel List Pages</span>
						<span class="status">
							<CheckCircleIcon class="icon" v-if="isAngelListCached" />
							<XCircleIcon class="icon" v-else />
							<span class="text">{{
								(isAngelListCached ? '已缓存' : '未缓存') +
								`(${counters.angel})`
							}}</span>
						</span>
					</span>
					<span class="state">
						<span class="label-text">Skill List Pages</span>
						<span class="status">
							<CheckCircleIcon class="icon" v-if="isSkillListCached" />
							<XCircleIcon class="icon" v-else />
							<span class="text">{{
								(isSkillListCached ? '已缓存' : '未缓存') +
								`(${counters.skill})`
							}}</span>
						</span>
					</span>
					<span class="state">
						<span class="label-text">Item List Pages</span>
						<span class="status">
							<CheckCircleIcon class="icon" v-if="isItemListCached" />
							<XCircleIcon class="icon" v-else />
							<span class="text">{{
								(isItemListCached ? '已缓存' : '未缓存') + `(${counters.item})`
							}}</span>
						</span>
					</span>
				</div>
				<div class="cache-actions">
					<Popover>
						<template #btn>
							<span class="btn-text">缓存或全量更新</span>
						</template>
						<template #content>
							<div class="pop-content">
								<div class="test-btns">
									<button
										type="button"
										class="btn"
										title="test"
										@click="cacheList('angel')"
									>
										缓存精灵列表
									</button>
									<button
										type="button"
										class="btn"
										title="test"
										@click="cacheList('skill')"
									>
										缓存技能列表
									</button>
									<button
										type="button"
										class="btn"
										title="test"
										@click="cacheList('item')"
									>
										缓存物品列表
									</button>
								</div>
							</div>
						</template>
					</Popover>
					<Popover>
						<template #btn>
							<span class="btn-text">清除</span>
						</template>
						<template #content>
							<div class="pop-content">
								<div class="test-btns">
									<button
										type="button"
										class="btn"
										title="test"
										@click="clearList('angel')"
									>
										清除精灵列表
									</button>
									<button
										type="button"
										class="btn"
										title="test"
										@click="clearList('skill')"
									>
										清除技能列表
									</button>
									<button
										type="button"
										class="btn"
										title="test"
										@click="clearList('item')"
									>
										清除物品列表
									</button>
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
	@apply flex flex-col items-center h-80 pt-2 gap-2;
}
.cache-states {
	@apply w-2/3 flex flex-col justify-center items-center gap-y-2;
}
.cache-states .label-text {
	@apply w-fit inline-flex justify-center items-baseline
	text-sm font-mono;
}
.cache-states .state {
	@apply w-full inline-flex justify-between items-center py-1 px-2
	rounded bg-slate-200 dark:bg-slate-800
	transition-colors ease-in-out duration-300;
}

.state .status {
	@apply w-fit inline-flex justify-center items-center gap-1
	whitespace-nowrap;
}
.state .status .icon {
	@apply w-[18px] h-fit;
}

.cache-actions {
	@apply w-2/3 inline-flex;
}

.pop-content {
	@apply relative w-full inline-flex flex-wrap justify-center items-center gap-2 p-2
  rounded border-2 border-slate-300 bg-sky-50
  dark:border-slate-700 dark:bg-slate-600
  transition-colors ease-in-out duration-300;
}

.test-btns {
	@apply flex justify-center items-center gap-x-2 gap-y-1 flex-wrap;
}
.test-btns .btn {
	@apply inline-flex justify-center items-center px-2 py-0.5
  text-sm rounded bg-slate-200  dark:bg-slate-700
	transition-colors ease-in-out duration-300;
}
</style>
