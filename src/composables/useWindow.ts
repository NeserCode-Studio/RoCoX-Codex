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
