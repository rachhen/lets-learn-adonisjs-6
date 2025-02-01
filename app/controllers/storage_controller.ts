import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { normalize, sep } from 'node:path'

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

export default class StorageController {
  async show({ params, response }: HttpContext) {
    const filePath = params['*'].join(sep)
    const normalizedPath = normalize(filePath)

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    return response.download(app.makePath('storage', normalizedPath))
  }
}
