import { fetch, Body, ResponseType } from '@tauri-apps/api/http'

import { apiOption } from './useApi'

import type { FetchOptions } from '@tauri-apps/api/http'
import type { RequestHeaders } from '../share'
import type { ConcurrencyRequestOption, UrlLike } from '../share'
// type Signal = AbortSignal

export class RocoRequest {
	private $headers: RequestHeaders = {
		authority: 'api.rocotime.com',
		accept: 'application/json, text/plain, */*',
		'Access-Control-Allow-Credentials': 'true',
	}
	private $uri: string = ''
	private $Option: FetchOptions = {
		method: 'OPTIONS',
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
		console.log('HTTP ST GET - ', reqUrl)
		console.time(reqUrl)
		// Request
		const response = await fetch<T>(reqUrl, {
			...this.$Option,
			method: 'GET',
			headers: this.$headers,
			query: { ...params },
			responseType: ResponseType.JSON,
		})
		console.timeEnd(reqUrl)
		console.log('HTTP RC GET - ', response.status)

		// Response Interception
		this.$interceptors.response()

		return response
	}

	async post<T>(path: string, params = {}) {
		let reqUrl = this.$uri + path
		// Request Interception
		this.$interceptors.request()
		console.log('HTTP ST POST - ', reqUrl)
		console.time(reqUrl)
		// Request
		const response = await fetch<T>(reqUrl, {
			...this.$Option,
			method: 'POST',
			headers: this.$headers,
			body: Body.json({ ...params }),
			responseType: ResponseType.JSON,
		})
		console.timeEnd(reqUrl)
		console.log('HTTP RC POST - ', response.status)

		// Response Interception
		this.$interceptors.response()

		return response
	}

	setInterceptors(type: 'response' | 'request') {
		return (fn: () => void) => {
			this.$interceptors[type] = fn
		}
	}
}

export const concurrencyRequest = <T>(
	urls: UrlLike[],
	option: ConcurrencyRequestOption
) => {
	const { concurrent = 5, onProgress = () => {} } = option
	return new Promise((resolve) => {
		if (urls.length === 0) {
			resolve([])
			return
		}
		const results: (T | unknown)[] = []
		let index = 0
		let count = 0

		async function request() {
			if (index === urls.length) return
			const i = index
			const url = urls[index]
			index++

			onProgress(i, urls.length)

			try {
				results[i] = (
					await fetch<T>(url, {
						headers: apiOption.headers,
						timeout: apiOption.timeout,
						responseType: ResponseType.JSON,
						method: 'GET',
					})
				).data
			} catch (err) {
				results[i] = err
			} finally {
				count++
				if (count === urls.length) resolve(results)
				request()
			}
		}

		const times = Math.min(concurrent, urls.length)
		for (let i = 0; i < times; i++) request()
	})
}
