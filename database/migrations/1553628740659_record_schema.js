'use strict'

const Schema = use('Schema')

class RecordSchema extends Schema {
  up () {
    this.create('records', (table) => {
      table.increments()
      table.integer('raw_content_id').unsigned().references('id').inTable('raw_contents')
      table.string('situation')
      table.integer('name')
      table.integer('difference')
      table.integer('now_value')
      table.timestamp('happened_at').index()

      table.timestamps()
    })
  }

  down () {
    this.drop('records')
  }
}

module.exports = RecordSchema
