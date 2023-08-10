import axios from "axios"
import NProgress from "nprogress"

const baseURL = "https://api.rocotime.com/api"
const timeout = 3000
const headers = {
	authority: "api.rocotime.com",
	accept: "application/json, text/plain, */*",
	"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
	"content-type": "application/json",
	"Access-Control-Allow-Credentials": "true",
	// dnt: "1",
	// origin: "https://rocotime.com",
	// "sec-ch-ua":
	// 	'"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
	// "sec-ch-ua-mobile": "?0",
	// "sec-ch-ua-platform": '"Windows"',
	// "sec-fetch-dest": "empty",
	// "sec-fetch-mode": "cors",
	// "sec-fetch-site": "same-site",
	// "sec-gpc": "1",
	// "user-agent":
	// 	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188",
}
const iconStaticURL = "https://res.17roco.qq.com/res/combat/icons/"
const featureStaticURL = "https://res.17roco.qq.com/res/combat/property/"
const rocoApi = axios.create({
	baseURL,
	headers,
	timeout,
})

interface FeatureObject {
	id: string
	name: string
}

interface AngelListParma {
	search: string
	id: string
	feature: string
	page: number
}

interface ItemListParma {
	search: string
	id: string
	page: number
}

// Request Interceptions
rocoApi.interceptors.request.use(
	(config) => {
		NProgress.start()
		return config
	},
	(error) => {
		NProgress.done()
		return Promise.reject(error)
	}
)

// Response Interceptions
rocoApi.interceptors.response.use(
	(config) => {
		NProgress.done()
		return config
	},
	(error) => {
		NProgress.done()
		return Promise.reject(error)
	}
)

// Request AbortController Signal
type Signal = AbortSignal

export const useApi = () => {
	// Angel Feature Map
	async function getFeatures(signal?: Signal) {
		const response = await rocoApi.get("/feature/", { signal })
		const obj: FeatureObject[] = response.data.list
		const map = new Map()
		obj.forEach((pair) => {
			map.set(pair.id, pair.name)
		})
		return map
	}

	// Angel List
	async function getAngelList(
		params: AngelListParma = {
			search: "",
			id: "",
			feature: "",
			page: 1,
		},
		signal?: Signal
	) {
		const response = await rocoApi.post("/spiritList/", params, { signal })
		return response.data.data
	}

	// Angel Detail
	async function getAngel(params: { hash: string }, signal?: Signal) {
		const response = await rocoApi.post("/detail/angel/", params, { signal })
		return response.data.data
	}

	// Item List
	async function getItemList(
		params: ItemListParma = {
			search: "",
			id: "",
			page: 1,
		},
		signal?: Signal
	) {
		const response = await rocoApi.post("/Itemlist/", params, { signal })
		return response.data.data
	}

	// Angel Skill List
	async function getSkillList(
		params: AngelListParma = {
			search: "",
			id: "",
			feature: "",
			page: 1,
		},
		signal?: Signal
	) {
		const response = await rocoApi.post("/Skilllist/", params, { signal })
		return response.data.data
	}

	return {
		getFeatures,
		getAngelList,
		getAngel,
		getItemList,
		getSkillList,
		baseURL,
		headers,
		timeout,
		iconStaticURL,
		featureStaticURL,
	}
}
