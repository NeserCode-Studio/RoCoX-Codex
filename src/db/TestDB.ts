import Dexie, { type EntityTable } from 'dexie'

interface TodoData {
	id: number
	userId: number
	title: string
	computed: boolean
}

export class TestDatabase {
	private db: Dexie & { todos: EntityTable<TodoData, 'id'> }
	constructor() {
		this.db = new Dexie('TodoData') as Dexie & {
			todos: EntityTable<TodoData, 'id'>
		}
		this.db.version(1).stores({
			todos: '++id, userId, computed',
		})
	}

	get dbInstance() {
		return this.db
	}
}
