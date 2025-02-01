import db from '@adonisjs/lucid/services/db'
import vine, { VineNumber } from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

declare module '@vinejs/vine' {
  interface VineNumber {
    isExists(options: Options): this
  }
}

type Options = {
  table: string
  column: string
}
async function isExists(value: unknown, options: Options, field: FieldContext) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }

  const result = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (!result) {
    field.report('Value for {{field}} doest not exists', 'isExists', field)
  }
}

const isExistsRule = vine.createRule(isExists)

VineNumber.macro('isExists', function (this: VineNumber, options: Options) {
  return this.use(isExistsRule(options))
})
