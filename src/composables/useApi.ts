import { RocoRequest } from "./useHttp"
import NProgress from "nprogress"

const baseURL = "https://api.rocotime.com/api"
const timeout = 5000
const headers = {
	authority: "api.rocotime.com",
	accept: "application/json, text/plain, */*",
	"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
	// "content-type": "application/json",
	"Access-Control-Allow-Credentials": "true",
	dnt: "1",
	origin: "https://rocotime.com",
	"sec-ch-ua":
		'"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
	"sec-ch-ua-mobile": "?0",
	"sec-ch-ua-platform": '"Windows"',
	"sec-fetch-dest": "empty",
	"sec-fetch-mode": "cors",
	"sec-fetch-site": "same-site",
	"sec-gpc": "1",
	"user-agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188",
}
const iconStaticURL = "https://res.17roco.qq.com/res/combat/icons/"
const itemStaticURL = "https://res.17roco.qq.com/res/item/"
const featureStaticURL = "https://res.17roco.qq.com/res/combat/property/"
const damageTypeStaticMap = new Map([
	[
		"1",
		"https://article.biliimg.com/bfs/article/b9b3acebd1c20ded6c492bffbcb2830d23f93354.png",
	],
	[
		"2",
		"https://article.biliimg.com/bfs/article/39592399aa510f3a3d94b9a5e683089b2f8f8528.png",
	],
])
const talentStaticURL = "https://res.17roco.qq.com/res/talent/"

const rocoApi = new RocoRequest({
	baseURL,
	timeout,
	headers,
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

interface SkillListParma {
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
rocoApi.setInterceptors("request")(() => {
	NProgress.start()
})

// Response Interceptions
rocoApi.setInterceptors("response")(() => {
	NProgress.done()
})

// Request AbortController Signal
// type Signal = AbortSignal

export const useApi = () => {
	// Angel Feature Map
	async function getFeatures() {
		const response = await rocoApi.get("/feature/")

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
		}
	) {
		const response = await rocoApi.post("/spiritList/", params)
		return response.data.data
	}

	// Angel Detail
	async function getAngel(params: { hash: string }) {
		const response = await rocoApi.post("/detail/angel/", params)
		return response.data.data
	}

	// Item List
	async function getItemList(
		params: ItemListParma = {
			search: "",
			id: "",
			page: 1,
		}
	) {
		const response = await rocoApi.post("/Itemlist/", params)
		return response.data.data
	}

	// Angel Skill List
	async function getSkillList(
		params: SkillListParma = {
			search: "",
			id: "",
			feature: "",
			page: 1,
		}
	) {
		const response = await rocoApi.post("/Skilllist/", params)
		return response.data.data
	}

	// Skill Detail
	async function getSkill(params: { hash: string }) {
		const response = await rocoApi.post("/detail/skill/", params)
		return response.data
	}

	return {
		getFeatures,
		getAngelList,
		getAngel,
		getSkillList,
		getSkill,
		getItemList,
		baseURL,
		headers,
		timeout,
		iconStaticURL,
		itemStaticURL,
		featureStaticURL,
		talentStaticURL,
		damageTypeStaticMap,
	}
}
