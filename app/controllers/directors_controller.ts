import Cineast from '#models/cineast'
import type { HttpContext } from '@adonisjs/core/http'

export default class DirectorsController {
  public async index({ view }: HttpContext) {
    const directors = await Cineast.query()
      .whereHas('moviesDirected', (query) => query.apply((scope) => scope.released()))
      .orderBy([
        { column: 'firstName', order: 'asc' },
        { column: 'lastName', order: 'asc' },
      ])

    return view.render('pages/directors/index', { directors })
  }

  public async show({ params, view, auth }: HttpContext) {
    const director = await Cineast.findOrFail(params.id)
    const movies = await director
      .related('moviesDirected')
      .query()
      .if(auth.user, (query) =>
        query.preload('watchlist', (sq) => sq.where('userId', auth.user!.id))
      )

    return view.render('pages/directors/show', { director, movies })
  }
}
