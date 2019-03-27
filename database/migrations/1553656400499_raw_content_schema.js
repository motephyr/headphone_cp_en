'use strict'

const Schema = use('Schema')

class RawContentSchema extends Schema {
  up () {
    this.table('raw_contents', (table) => {
      // alter table
      table.timestamp('post_at').index()
    })
  }

  down () {
    this.table('raw_contents', (table) => {
      // reverse alternations
      table.dropColumn('post_at')

    })
  }
}

module.exports = RawContentSchema
