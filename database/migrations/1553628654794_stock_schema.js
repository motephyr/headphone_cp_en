'use strict'

const Schema = use('Schema')

class StockSchema extends Schema {
  up () {
    this.create('stocks', (table) => {
      table.increments()
      table.integer('raw_content_id').unsigned().references('id').inTable('raw_contents')
      table.timestamp('bought_at').index()
      table.string('name').index()
      table.integer('price')

      table.timestamps()
    })
  }

  down () {
    this.drop('stocks')
  }
}

module.exports = StockSchema
