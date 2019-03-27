'use strict'

const Schema = use('Schema')

class RawContentSchema extends Schema {
  up () {
    this.table('raw_contents', (table) => {
      // alter table
      table.string('state').index()
    })
  }

  down () {
    this.table('raw_contents', (table) => {
      // reverse alternations
      table.dropColumn('state')

    })
  }
}

module.exports = RawContentSchema
