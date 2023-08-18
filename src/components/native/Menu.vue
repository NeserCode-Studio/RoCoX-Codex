<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
</script>

<template>
	<div class="navigation-menu">
		<Menu as="div">
			<MenuButton>bbut</MenuButton>
			<transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<MenuItems>
					<MenuItem>1</MenuItem>
					<MenuItem>2</MenuItem>
				</MenuItems>
			</transition>
		</Menu>
	</div>
</template>

<style lang="postcss" scoped></style>
