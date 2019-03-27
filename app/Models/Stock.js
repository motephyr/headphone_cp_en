'use strict'

const Model = use('Model')

class Stock extends Model {
  static get dates() {
    return super.dates.concat(['bought_at'])
  }
  static castDates(field, value) {
    return value.toISOString()
  }
}

module.exports = Stock
