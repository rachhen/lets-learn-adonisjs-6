import cache from '#services/cache_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class RedisController {
  async destroy({ params, response }: HttpContext) {
    await cache.delete(params.slug)
    return response.redirect().back()
  }

  async flash({ response }: HttpContext) {
    console.log('Flashing redis...')
    await cache.flashDb()
    return response.redirect().back()
  }
}
