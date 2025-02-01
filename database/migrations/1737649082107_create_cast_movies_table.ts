import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cast_movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('cineast_id')
        .unsigned()
        .references('id')
        .inTable('cineasts')
        .notNullable()
        .onDelete('CASCADE')
      table
        .integer('movie_id')
        .unsigned()
        .references('id')
        .inTable('movies')
        .notNullable()
        .onDelete('CASCADE')
      table.string('character_name', 100).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
