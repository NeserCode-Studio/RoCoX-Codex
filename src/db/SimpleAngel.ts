import type { AngelListItemObject } from '../share'
import Dexie, { type EntityTable } from 'dexie'

export class SimpleAngelDatabase {
	private db: Dexie & { angels: EntityTable<AngelListItemObject, 'id'> }
	constructor() {
		this.db = new Dexie('SimpleAngelData') as Dexie & {
			angels: EntityTable<AngelListItemObject, 'id'>
		}
		this.db.version(1).stores({
			angels: '++id, name, group, hash, features',
		})
	}

	get dbInstance() {
		return this.db
	}
}
