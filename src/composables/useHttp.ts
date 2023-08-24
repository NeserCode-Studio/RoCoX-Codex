import { fetch, Body, ResponseType } from "@tauri-apps/api/http"
import type { FetchOptions } from "@tauri-apps/api/http"

interface RequestHeaders {
	authority: string
	accept: string
	"accept-language"?: string
	"content-type"?: string
	"Access-Control-Allow-Origin"?: string
	"Access-Control-Allow-Credentials"?: string
	dnt?: string
	origin?: string
	referrer?: string
	"sec-ch-ua"?: string
	"sec-ch-ua-mobile"?: string
	"sec-ch-ua-platform"?: string
	"sec-fetch-dest"?: string
	"sec-fetch-mode"?: string
	"sec-fetch-site"?: string
	"sec-gpc"?: string
	"user-agent"?: string
}

// type Signal = AbortSignal

export class RocoRequest {
	private $headers: RequestHeaders = {
		authority: "api.rocotime.com",
		accept: "application/json, text/plain, */*",
		"Access-Control-Allow-Credentials": "true",
	}
	private $uri: string = ""
	private $Option: FetchOptions = {
		method: "OPTIONS",
	}
	private $interceptors: {
		request: () => void
		response: () => void
	} = {
		request: () => {},
		response: () => {},
	}

	constructor(option: {
		baseURL: string
		headers: RequestHeaders
		timeout: number
	}) {
		const { baseURL, headers, timeout } = option

		this.$uri = baseURL
		this.$headers = Object.assign(headers, this.$headers)
		this.$Option = { ...this.$Option, timeout }
	}

	async get<T>(path: string, params?: any) {
		let reqUrl = this.$uri + path
		// Request Interception
		this.$interceptors.request()
		console.log("HTTP ST GET - ", reqUrl)
		// Request
		const response = await fetch<T>(reqUrl, {
			...this.$Option,
			method: "GET",
			headers: this.$headers,
			query: { ...params },
			responseType: ResponseType.JSON,
		})
		console.log("HTTP RC GET - ", response)

		// Response Interception
		this.$interceptors.response()

		return response
	}

	async post<T>(path: string, params = {}) {
		let reqUrl = this.$uri + path
		// Request Interception
		this.$interceptors.request()
		console.log("HTTP ST POST - ", reqUrl)
		// Request
		const response = await fetch<T>(reqUrl, {
			...this.$Option,
			method: "POST",
			headers: this.$headers,
			body: Body.json({ ...params }),
			responseType: ResponseType.JSON,
		})
		console.log("HTTP RC POST - ", response)

		// Response Interception
		this.$interceptors.response()

		return response
	}

	setInterceptors(type: "response" | "request") {
		return (fn: () => void) => {
			this.$interceptors[type] = fn
		}
	}
}
