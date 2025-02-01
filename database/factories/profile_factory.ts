import Profile from '#models/profile'
import factory from '@adonisjs/lucid/factories'
import { UserFactory } from './user_factory.js'

export const ProfileFactory = factory
  .define(Profile, async ({ faker }) => {
    return {
      userId: 1,
      description: faker.lorem.sentence(),
    }
  })
  .relation('user', () => UserFactory)
  .build()
