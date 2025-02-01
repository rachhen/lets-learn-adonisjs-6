import { BaseModel, column, computed, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Movie from './movie.js'

export default class Cineast extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare headshotUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @hasMany(() => Movie, {
    foreignKey: 'directorId',
  })
  declare moviesDirected: HasMany<typeof Movie>

  @hasMany(() => Movie, {
    foreignKey: 'writerId',
  })
  declare moviesWritten: HasMany<typeof Movie>

  @manyToMany(() => Movie, {
    pivotTable: 'crew_movies',
    pivotTimestamps: true,
  })
  declare crewMovies: ManyToMany<typeof Movie>

  @manyToMany(() => Movie, {
    pivotTable: 'cast_movies',
    pivotColumns: ['character_name', 'sort_order'],
    pivotTimestamps: true,
  })
  declare castMovies: ManyToMany<typeof Movie>
}
