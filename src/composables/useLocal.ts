import { nextTick } from "vue"
import { appWindow } from "@tauri-apps/api/window"

export function nextTickToShow() {
	nextTick(async () => {
		await appWindow.show()
		await appWindow.setFocus()
	})
}
