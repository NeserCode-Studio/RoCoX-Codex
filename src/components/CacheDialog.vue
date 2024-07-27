<script lang="ts" setup>
import Dialog from './native/Dialog.vue'
import Popover from './native/Popover.vue'

import {
	concurrencyRequest,
	attemptGenerateRequest,
} from '../composables/useHttp'
import { TestDatabase, TodoData } from '../db/TestDB'
import { ref } from 'vue'
import { AngelListItemObject, AngelListParma } from '../share'

const isOpen = defineModel<boolean>('isOpen', {
	default: false,
})
const closeModel = () => {}

const $db = ref<TestDatabase>(new TestDatabase())
const testFetchData = ref<any[]>([])
const getRandomTodoItems = (cases: number = 1) => {
	const reqUrl = `https://jsonplaceholder.typicode.com/todos/`
	const getUrl = (id: number) => `${reqUrl}${id}`

	return [
		...new Set(
			Array.from({ length: cases }, () => Math.floor(Math.random() * 100) + 1)
		),
	].map((random) => getUrl(random))
}

const getTestData = async () => {
	const urlLength = Math.floor(Math.random() * 10) + 1
	const urls = getRandomTodoItems(urlLength)

	const res = await concurrencyRequest<TodoData>(urls, {
		concurrent: 12,
		onProgress: (load, total) => {
			console.log(`${Math.floor(((load + 1) / total) * 100)}%`)
		},
	})

	testFetchData.value = res as unknown[]
	return res as TodoData[]
}

const testDataBase = async () => {
	const data = await getTestData()
	$db.value.addTodo(data)

	console.log(await $db.value.getTodos())
}

const clearTodos = async () =>
	$db.value.deleteTodo((await $db.value.getTodos()).map((item) => item.id))

const getTestDatabase = async () => {
	const data = await $db.value.getTodos()
	console.log(data)
}
const getUncompletedTodo = async () => {
	const data = await $db.value.getUncompletedTodos()
	console.log(data)
}

const getAllAngelAttempt = async () => {
	const data = await attemptGenerateRequest<
		AngelListItemObject,
		AngelListParma
	>(
		'https://api.rocotime.com/api/spiritList/',
		{
			attempt(params: AngelListParma) {
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
	console.log(data)
}

const getAllSkillAttempt = async () => {
	const data = await attemptGenerateRequest<
		AngelListItemObject,
		AngelListParma
	>(
		'https://api.rocotime.com/api/Skilllist/',
		{
			attempt(params: AngelListParma) {
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
	console.log(data)
}

const getAllItemAttempt = async () => {
	const data = await attemptGenerateRequest<
		AngelListItemObject,
		AngelListParma
	>(
		'https://api.rocotime.com/api/Itemlist/',
		{
			attempt(params: AngelListParma) {
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
	console.log(data)
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
					<Popover>
						<template #btn>
							<span class="btn-text">查看当前缓存状态</span>
						</template>
						<template #content>
							<div class="pop-content">
								{{ JSON.stringify(testFetchData, null, 2) }}
							</div>
						</template>
					</Popover>
				</div>

				<div class="test-btns">
					<button type="button" class="btn" title="test" @click="getTestData">
						获取数据
					</button>
					<button type="button" class="btn" title="test" @click="testDataBase">
						使用测试数据测试DB
					</button>
					<button type="button" class="btn" title="test">添加Case</button>
					<button type="button" class="btn" title="test">更新Case</button>
					<button type="button" class="btn" title="test" @click="clearTodos">
						清空Case
					</button>
					<button
						type="button"
						class="btn"
						title="test"
						@click="getTestDatabase"
					>
						获取Case
					</button>
					<button
						type="button"
						class="btn"
						title="test"
						@click="getUncompletedTodo"
					>
						获取未完成Case
					</button>
					<button
						type="button"
						class="btn"
						title="test"
						@click="getAllAngelAttempt"
					>
						获取所有 Angel
					</button>
					<button
						type="button"
						class="btn"
						title="test"
						@click="getAllSkillAttempt"
					>
						获取所有 Skill
					</button>
					<button
						type="button"
						class="btn"
						title="test"
						@click="getAllItemAttempt"
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
