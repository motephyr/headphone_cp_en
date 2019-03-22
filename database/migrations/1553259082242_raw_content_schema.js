'use strict'

const Schema = use('Schema')

class RawContentSchema extends Schema {
  up () {
    this.create('raw_contents', (table) => {
      table.increments()

      table.string('post_id').index()
      table.string('post_title')
      table.string('post_link')
      table.string('post_description')
      table.string('time')

      table.timestamps()
    })
  }

  down () {
    this.drop('raw_contents')
  }
}

module.exports = RawContentSchema
