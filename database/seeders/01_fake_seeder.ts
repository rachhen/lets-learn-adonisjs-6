import { movies } from '#database/data/movies'
import { CineastFactory } from '#database/factories/cineast_factory'
import { MovieFactory } from '#database/factories/movie_factory'
import { UserFactory } from '#database/factories/user_factory'
import MovieStatuses from '#enums/movie_statuses'
import Cineast from '#models/cineast'
import Movie from '#models/movie'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  static environment: string[] = ['development']
  titles: string[] = [
    'Camera Operator',
    'Art Director',
    'Hair & Makeup',
    'Production Manager',
    'Wardrobe',
    'Line Producer',
    'Sound Mixer',
    'Cinematographer',
    'Gaffer',
  ]

  async run() {
    // Write your database queries inside the run method
    const cineasts = await CineastFactory.createMany(10)
    await UserFactory.with('profile').createMany(5)
    await this.#createMovies(cineasts)
  }

  async #createMovies(cineasts: Cineast[]) {
    let index = 0
    let movieRecords = await MovieFactory.tap((row, { faker }) => {
      const movie = movies[index]
      const released = DateTime.now().set({ year: movie.releaseYear })

      row.directorId = cineasts.at(Math.floor(Math.random() * cineasts.length))!.id
      row.writerId = cineasts.at(Math.floor(Math.random() * cineasts.length))!.id
      row.statusId = MovieStatuses.RELEASED
      row.title = movie.title
      row.releasedAt = DateTime.fromJSDate(
        faker.date.between({
          from: released.startOf('year').toJSDate(),
          to: released.endOf('year').toJSDate(),
        })
      )

      index++
    }).createMany(movies.length)

    movieRecords = movieRecords.concat(
      await MovieFactory.with('director').with('writer').createMany(3)
    )

    movieRecords = movieRecords.concat(
      await MovieFactory.with('director').with('writer').apply('released').createMany(2)
    )
    movieRecords = movieRecords.concat(
      await MovieFactory.with('director').with('writer').apply('releasingSoon').createMany(2)
    )
    movieRecords = movieRecords.concat(
      await MovieFactory.with('director').with('writer').apply('postProduction').createMany(2)
    )

    const promises: Promise<any>[] = []
    for (const movie of movieRecords) {
      promises.push(this.#attachRandomCrewMembers(movie, cineasts, 4))
      promises.push(this.#attachRandomCastMembers(movie, cineasts, 3))
    }

    await Promise.all(promises)
  }

  async #attachRandomCrewMembers(movie: Movie, cineasts: Cineast[], num: number) {
    const ids = this.#getRandom(cineasts, num).map((c) => c.id)

    return movie.related('crewMembers').attach(
      ids.reduce<Record<string, ModelObject>>((obj, id, i) => {
        obj[id] = {
          title: this.#getRandom(this.titles, 1)[0],
          sort_order: i,
        }

        return obj
      }, {})
    )
  }

  async #attachRandomCastMembers(movie: Movie, cineasts: Cineast[], num: number) {
    const ids = this.#getRandom(cineasts, num).map((c) => c.id)
    const records = await CineastFactory.makeStubbedMany(num)

    return movie.related('castMembers').attach(
      ids.reduce<Record<string, ModelObject>>((obj, id, i) => {
        obj[id] = {
          character_name: records[i].fullName,
          sort_order: i,
        }

        return obj
      }, {})
    )
  }

  #getRandom<T>(array: T[], pluck: number) {
    const shuffle = array.sort(() => 0.5 - Math.random())
    return shuffle.slice(0, pluck)
  }
}
