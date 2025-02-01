import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'watchlists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('movie_id').unsigned().notNullable().references('movies.id').onDelete('CASCADE')
      table.timestamp('watched_at')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['user_id', 'movie_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
