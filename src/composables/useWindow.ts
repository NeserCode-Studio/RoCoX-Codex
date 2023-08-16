import { WebviewWindow, WindowOptions } from "@tauri-apps/api/window"

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
	}
	private window: WebviewWindow | null = null

	constructor(label: string, options: WindowOptions) {
		this.label = label
		this.options = Object.assign(this.options, options)
	}

	setup() {
		let label = this.label
		let options = this.options
		this.window = new WebviewWindow(label, options)
		this.window.once("tauri://created", function () {
			// webview window successfully created
			console.log("Window Creator Setup Success", label, options)
		})
		this.window.once("tauri://error", function (e) {
			// an error happened creating the webview window
			console.log("Window Creator Setup Error", e)
		})
	}
}
