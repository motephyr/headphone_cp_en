'use strict'

const Schema = use('Schema')

class TargetContentSchema extends Schema {
  up () {
    this.create('target_contents', (table) => {
      table.increments()
      table.string('name').index()
      table.float('mean_price')
      table.float('stdev_price')

      table.timestamps()
    })
  }

  down () {
    this.drop('target_contents')
  }
}

module.exports = TargetContentSchema
