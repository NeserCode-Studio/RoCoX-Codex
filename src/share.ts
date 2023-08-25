export interface RequestHeaders {
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

export interface FeatureObject {
	id?: string
	name?: string
}

export interface FeatureListData {
	list: FeatureObject[]
}

export interface AngelListItemObject {
	id?: string
	name?: string
	group?: string
	hash?: string
	img?: string
	iconSrc?: string
	features?: string[]
}

export interface AngelListData {
	data: AngelListItemObject[]
}

export interface ChainItemProp {
	hash?: string
	id?: string
	img?: string
	name?: string
	start?: boolean
	lv?: string
	to?: ChainItemProp[] | "0"
}

export interface AngelDataObject extends AngelListItemObject {
	add?: number
	catchrate?: string
	chain?: ChainItemProp | false
	color?: string
	description?: string
	expType?: string
	fy?: string
	getForm?: string
	group?: string
	groupName?: string
	height?: string
	highUrl?: string
	interest?: string
	mg?: string
	mk?: string
	sd?: string
	sm?: string
	weight?: string
	wg?: string
}

export interface AngelDetailObject {
	data: {
		angel: AngelDataObject
		skills: SkillDataObject[]
		xm: TalentDetailObject[]
	}
}

export interface SkillListItemObject {
	id?: string
	hash?: string
	name?: string
	damageType?: string
	attackType?: string
	property?: string
	ppMax?: string
	power?: string
	speed?: string
}

export interface SkillListData {
	data: SkillListItemObject[]
}

export interface SkillAnalysisObject {
	analysis?: string
	author?: string
	debuff?: any[]
	hit?: string
	id?: string
	tag?: any[]
	time?: string
	url?: string
	weather?: any[]
}

export interface SkillDataObject extends SkillListItemObject {
	analysis: SkillAnalysisObject
	canInherit?: boolean
	description?: string
	isAnalysis?: boolean
	isObsolete?: boolean
	isStone?: boolean
	level?: number
}

export interface SkillDetailObject {
	data: SkillDataObject
	angel?: {
		id: string
		name: string
		iconSrc: string
		hash: string
	}[]
	AngelLength?: number
}

export interface TalentDetailObject {
	id?: string
	items?: string
	xmjx?: string
	config?: {
		id?: string
		name?: string
		des?: string
	}
}

export interface ItemListItemObject {
	Desc?: string
	ExpireTime?: string
	Price?: string
	Unique?: "0" | "1"
	id?: string
	name?: string
}

export interface ItemListData {
	data: ItemListItemObject[]
}

export interface AngelListParma {
	search: string
	id: string
	feature: string
	page: number
}

export interface SkillListParma {
	search: string
	id: string
	feature: string
	page: number
}

export interface ItemListParma {
	search: string
	id: string
	page: number
}
