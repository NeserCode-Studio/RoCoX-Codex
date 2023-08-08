import axios from "axios"

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
const rocoApi = axios.create({
	baseURL,
	headers,
	timeout,
})

interface SpiritListParma {
	search: string
	id: string
	feature: string
	page: number
}

export const useApi = () => {
	async function getSpiritList(
		params: SpiritListParma = {
			search: "",
			id: "",
			feature: "",
			page: 1,
		}
	) {
		const response = await rocoApi.post("/spiritList/", params)
		return response.data.data
	}
	return {
		getSpiritList,
	}
}
