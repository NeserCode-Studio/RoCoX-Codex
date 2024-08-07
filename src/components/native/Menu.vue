<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
	EllipsisHorizontalIcon,
	ArrowsRightLeftIcon,
	ArrowTopRightOnSquareIcon,
	HomeModernIcon,
	LockClosedIcon,
	LockOpenIcon,
	RectangleGroupIcon,
	RectangleStackIcon,
	CloudArrowDownIcon,
} from '@heroicons/vue/20/solid'
import { useStorage } from '@vueuse/core'

const category = useStorage('rocox-category', 'angels')
function isMatchCategoryOption(key: string): boolean {
	return category.value === key
}
function turnToCategory(key: 'angels' | 'skills' | 'items') {
	category.value = key
}

const alwaysTargetNewWindow = useStorage('rocox-new-window-target', false)
function toggleTargetMode() {
	alwaysTargetNewWindow.value = !alwaysTargetNewWindow.value
}

const alwaysUseFocusShortcut = useStorage('rocox-shortcut-use-focus', true)
function toggleUseFocusShortcut() {
	alwaysUseFocusShortcut.value = !alwaysUseFocusShortcut.value
}

const appRounded = useStorage('rocox-rounded', false)
function toggleRounded() {
	appRounded.value = !appRounded.value
}

const isCacheWindowOpen = useStorage('rocox-cache-window-open', false)
function toggleCacheWindow() {
	isCacheWindowOpen.value = !isCacheWindowOpen.value
}
</script>

<template>
	<div class="navigation-menu">
		<Menu as="div" class="menu-main">
			<MenuButton class="menu-button">
				<EllipsisHorizontalIcon class="icon" />
			</MenuButton>
			<transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<MenuItems class="menu-items">
					<div class="group-options">
						<MenuItem
							as="div"
							class="menu-item"
							v-slot="{ disabled, active }"
							:disabled="isMatchCategoryOption('angels')"
							@click="turnToCategory('angels')"
						>
							<ArrowsRightLeftIcon class="icon" />
							<span
								:class="[
									'text',
									disabled ? 'disabled' : null,
									active ? 'active' : null,
								]"
								title="切换至精灵图鉴"
								>切换至精灵图鉴</span
							>
						</MenuItem>
						<MenuItem
							as="div"
							class="menu-item"
							v-slot="{ disabled, active }"
							:disabled="isMatchCategoryOption('skills')"
							@click="turnToCategory('skills')"
						>
							<ArrowsRightLeftIcon class="icon" />
							<span
								:class="[
									'text',
									disabled ? 'disabled' : null,
									active ? 'active' : null,
								]"
								title="切换至技能图鉴"
								>切换至技能图鉴</span
							>
						</MenuItem>
						<MenuItem
							as="div"
							class="menu-item"
							v-slot="{ disabled, active }"
							:disabled="isMatchCategoryOption('items')"
							@click="turnToCategory('items')"
						>
							<ArrowsRightLeftIcon class="icon" />
							<span
								:class="[
									'text',
									disabled ? 'disabled' : null,
									active ? 'active' : null,
								]"
								title="切换至物品图鉴"
								>切换至物品图鉴</span
							>
						</MenuItem>
					</div>
					<div class="group-options">
						<MenuItem
							as="div"
							class="menu-item"
							v-slot="{ disabled, active }"
							@click="toggleTargetMode()"
						>
							<ArrowTopRightOnSquareIcon
								v-show="!alwaysTargetNewWindow"
								class="icon"
							/>
							<HomeModernIcon v-show="alwaysTargetNewWindow" class="icon" />
							<span
								:class="[
									'text',
									disabled ? 'disabled' : null,
									active ? 'active' : null,
								]"
								title="切换浏览模式"
								>{{
									alwaysTargetNewWindow ? '总在当前页面' : '总是打开新页面'
								}}</span
							>
						</MenuItem>
						<MenuItem
							as="div"
							class="menu-item"
							v-slot="{ disabled, active }"
							@click="toggleUseFocusShortcut()"
						>
							<LockOpenIcon v-show="alwaysUseFocusShortcut" class="icon" />
							<LockClosedIcon v-show="!alwaysUseFocusShortcut" class="icon" />
							<span
								:class="[
									'text',
									disabled ? 'disabled' : null,
									active ? 'active' : null,
								]"
								title="切换快捷键模式"
								>{{
									alwaysUseFocusShortcut
										? '全局启用使用快捷键'
										: '总在应用内使用快捷键'
								}}</span
							>
						</MenuItem>
					</div>
					<MenuItem
						as="div"
						class="menu-item"
						v-slot="{ disabled, active }"
						@click="toggleRounded()"
					>
						<RectangleGroupIcon v-show="appRounded" class="icon" />
						<RectangleStackIcon v-show="!appRounded" class="icon" />
						<span
							:class="[
								'text',
								disabled ? 'disabled' : null,
								active ? 'active' : null,
							]"
							title="切换应用圆角"
							>{{ appRounded ? '应用框架直角' : '应用框架圆角' }}</span
						>
					</MenuItem>
					<MenuItem
						as="div"
						class="menu-item"
						v-slot="{ disabled, active }"
						@click="toggleCacheWindow()"
					>
						<CloudArrowDownIcon class="icon" />
						<span
							:class="[
								'text',
								disabled ? 'disabled' : null,
								active ? 'active' : null,
							]"
							title="管理缓存"
							>{{ isCacheWindowOpen ? '退出缓存管理' : '应用缓存管理' }}</span
						>
					</MenuItem>
				</MenuItems>
			</transition>
		</Menu>
	</div>
</template>

<style lang="postcss" scoped>
.menu-main {
	@apply relative;
}

.menu-button {
	@apply py-1 px-1.5
	bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300
	focus:ring-2 ring-green-400 dark:ring-green-500
	rounded transition-all outline-none shadow-md;
}
.menu-button .icon {
	@apply w-6 h-6;
}

.menu-items {
	@apply absolute left-0 top-full flex flex-col w-fit max-w-xs mt-2 p-1
	border-2 rounded border-slate-300 dark:border-slate-500
	focus:ring-2 ring-green-300 dark:ring-green-500
	bg-sky-50 dark:bg-sky-900
	select-none transition-all outline-none;
}
.menu-item {
	@apply w-full inline-flex items-center p-1
	rounded
	cursor-pointer;
}
.menu-item .icon {
	@apply w-4 h-4 mr-1;
}
.menu-item .text {
	@apply inline-block w-full text-sm
	truncate font-bold;
}

.menu-item:has(.text.disabled) {
	@apply cursor-not-allowed;
}
.menu-item:has(.text.disabled) .icon,
.menu-item:has(.text.disabled) .text {
	@apply opacity-40;
}
.menu-item:has(.text.active) {
	@apply text-green-600 dark:text-green-300;
}

.menu-item:not(:has(.text.disabled)) {
	@apply hover:bg-green-300 dark:hover:bg-green-600
	transition-all;
}

.group-options {
	@apply mb-1 pb-1 border-b-2
	border-slate-200 dark:border-slate-600
	transition-all;
}
</style>
