import { MovieService } from '#services/movie_service'
import vine from '@vinejs/vine'

const movieFilterSchema = vine.object({
  search: vine.string().optional(),
  status: vine
    .number()
    .exists(async (db, value) => {
      if (!value) return true
      const exists = await db.from('movie_statuses').select('id').where('id', value).first()
      return !!exists
    })
    .optional(),
  sort: vine
    .string()
    .exists(async (_db, value) => {
      if (!value) return true
      return MovieService.sortOptions.some((option) => option.id === value)
    })
    .optional(),
})

export const movieFilterValidator = vine.compile(movieFilterSchema)
export const watchlistFilterValidator = vine.compile(
  vine.object({
    ...movieFilterSchema.getProperties(),
    watched: vine.enum(['watched', 'unwatched', 'all']).optional(),
  })
)
