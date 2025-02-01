import Profile from '#models/profile'
import User from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_missing_user_profiles'

  async up() {
    // Create a profile for each user that doesn't have one
    this.defer(async (_db) => {
      const users = await User.query()
        .whereDoesntHave('profile', (query) => query)
        .select('id')

      const profiles = users.map((user) => ({ userId: user.id }))

      await Profile.createMany(profiles)
    })
  }

  async down() {}
}
