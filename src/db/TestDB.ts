import Dexie, { type EntityTable } from 'dexie'

export interface TodoData {
	id: number
	userId: number
	title: string
	completed: boolean
}

export class TestDatabase {
	private db: Dexie & { todos: EntityTable<TodoData, 'id'> }
	constructor(todos?: TodoData[]) {
		this.db = new Dexie('TodoData') as Dexie & {
			todos: EntityTable<TodoData, 'id'>
		}
		this.db.version(1).stores({
			todos: '++id, userId',
		})

		if (todos?.length) this.db.todos.bulkPut(todos)
	}

	get dbInstance() {
		return this.db
	}

	async addTodo(todo: TodoData | TodoData[]) {
		if (Array.isArray(todo)) return await this.db.todos.bulkPut(todo)
		return await this.db.todos.add(todo)
	}

	async getTodos() {
		return await this.db.todos.toCollection().sortBy('userId')
	}

	async deleteTodo(id: number | number[]) {
		if (Array.isArray(id)) return await this.db.todos.bulkDelete(id)
		return await this.db.todos.delete(id)
	}

	async updateTodo(id: number, todo: Partial<TodoData>) {
		return await this.db.todos.update(id, todo)
	}

	async getUncompletedTodos() {
		return await this.db.todos.filter((todo) => !todo.completed).toArray()
	}
}
