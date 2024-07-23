import {
	WebviewWindow,
	WindowOptions,
	LogicalSize,
	appWindow,
} from "@tauri-apps/api/window"
import { useStorage } from "@vueuse/core"

export class WindowCreator {
	private label: string = "DefaultLabel"
	private options: WindowOptions = {
		url: "/",
		decorations: false,
		height: 600,
		width: 500,
		fullscreen: false,
		title: this.label,
		resizable: false,
		visible: false,
		center: true,
	}
	private window: WebviewWindow | null = null
	public uri: string = ""

	constructor(label: string, options: WindowOptions) {
		this.label = label
		this.uri = options.url ?? ""
		this.options = Object.assign(this.options, options)
	}

	setup() {
		let label = this.label
		let options = this.options
		this.window = new WebviewWindow(label, options)
		this.window.once("tauri://created", function () {
			// webview window successfully created
			console.log("Window Creator Setup Success", label)
		})
		this.window.once("tauri://error", async function (e) {
			// an error happened creating the webview window
			console.log("Window Creator Setup Error", e)
			await WebviewWindow.getByLabel(e.windowLabel)!.setFocus()
		})
	}
}

export const toggleMiniWindow = async (symbol?: boolean) => {
	const boundings = [
		{
			width: 500,
			height: 600,
		},
		{
			width: 1024,
			height: 800,
		},
	]

	const isMini = useStorage("rocox-mini", true)
	let size =
		symbol !== undefined
			? boundings[symbol ? 0 : 1]
			: boundings[isMini.value ? 0 : 1]

	await appWindow.setSize(new LogicalSize(size.width, size.height))
	if (symbol !== undefined) isMini.value = symbol
	else isMini.value = !isMini.value
}
