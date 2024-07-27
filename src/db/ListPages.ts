import type {
	AngelListItemObject,
	DatabasePageParma,
	ItemListItemObject,
	SkillListItemObject,
} from '../share'
import Dexie, { type EntityTable } from 'dexie'

export class ListPagesDatabase {
	private db: Dexie & {
		angels: EntityTable<AngelListItemObject, 'id'>
		skills: EntityTable<SkillListItemObject, 'id'>
		items: EntityTable<ItemListItemObject, 'id'>
	}
	constructor() {
		this.db = new Dexie('ListPageData') as Dexie & {
			angels: EntityTable<AngelListItemObject, 'id'>
			skills: EntityTable<SkillListItemObject, 'id'>
			items: EntityTable<ItemListItemObject, 'id'>
		}
		this.db.version(1).stores({
			angels: '++id',
			skills: '++id',
			items: '++id',
		})
	}

	get dbInstance() {
		return this.db
	}

	get sizes() {
		return {
			angels: async () => await this.db.angels.count(),
			skills: async () => await this.db.skills.count(),
			items: async () => await this.db.items.count(),
		}
	}

	// Angels
	async addAngel(angel: AngelListItemObject | AngelListItemObject[]) {
		if (Array.isArray(angel)) return await this.db.angels.bulkPut(angel)
		return await this.db.angels.add(angel)
	}

	async getAngel({ offset, limit }: DatabasePageParma) {
		return await this.db.angels.offset(offset).limit(limit).sortBy('id')
	}

	async deleteAngel(id?: number | number[]) {
		if (id === undefined) return await this.db.angels.clear()
		if (Array.isArray(id))
			return await this.db.angels.bulkDelete(id.map((i) => i.toString()))
		return await this.db.angels.delete(id.toString())
	}

	async updateAngel(id: number, info: Partial<AngelListItemObject>) {
		return await this.db.angels.update(id.toString(), info)
	}

	// Skills
	async addSkill(skill: SkillListItemObject | SkillListItemObject[]) {
		if (Array.isArray(skill)) return await this.db.skills.bulkPut(skill)
		return await this.db.skills.add(skill)
	}

	async getSkill({ offset, limit }: DatabasePageParma) {
		return await this.db.skills.offset(offset).limit(limit).sortBy('id')
	}

	async deleteSkill(id?: number | number[]) {
		if (id === undefined) return await this.db.skills.clear()
		if (Array.isArray(id))
			return await this.db.skills.bulkDelete(id.map((i) => i.toString()))
		return await this.db.skills.delete(id.toString())
	}

	async updateSkill(id: number, info: Partial<SkillListItemObject>) {
		return await this.db.skills.update(id.toString(), info)
	}

	// Items
	async addItem(item: ItemListItemObject | ItemListItemObject[]) {
		if (Array.isArray(item)) return await this.db.items.bulkPut(item)
		return await this.db.items.add(item)
	}

	async getItem({ offset, limit }: DatabasePageParma) {
		return await this.db.items.offset(offset).limit(limit).sortBy('id')
	}

	async deleteItem(id?: number | number[]) {
		if (id === undefined) return await this.db.items.clear()
		if (Array.isArray(id))
			return await this.db.items.bulkDelete(id.map((i) => i.toString()))
		return await this.db.items.delete(id.toString())
	}

	async updateItem(id: number, info: Partial<ItemListItemObject>) {
		return await this.db.items.update(id.toString(), info)
	}
}
