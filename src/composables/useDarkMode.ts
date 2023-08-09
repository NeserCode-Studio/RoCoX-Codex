import { useDark, useToggle } from "@vueuse/core"

export function useDarkMode() {
	const isDarkMode = useDark({
		storageKey: "roco-color-scheme",
		disableTransition: false,
	})
	const toggleDarkMode = useToggle(isDarkMode)

	return {
		isDarkMode,
		toggleDarkMode,
	}
}
