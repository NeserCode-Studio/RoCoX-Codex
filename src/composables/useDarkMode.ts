import { useDark, useToggle } from "@vueuse/core"

export function useDarkMode() {
	const isDarkMode = useDark({
		storageKey: "roco-color-scheme",
	})
	const toggleDarkMode = useToggle(isDarkMode)

	return {
		isDarkMode,
		toggleDarkMode,
	}
}
