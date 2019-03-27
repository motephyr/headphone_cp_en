'use strict'

const Model = use('Model')

class Record extends Model {
  static get dates() {
    return super.dates.concat(['happened_at'])
  }
  static castDates(field, value) {
    return value.toISOString()
  }
}

module.exports = Record
