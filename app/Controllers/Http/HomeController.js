'use strict'
const RawContent = use('App/Models/RawContent')
const HeadphoneAnalyzeService = require("../../Services/HeadphoneAnalyzeService")
const Stock = use('App/Models/Stock')
const Record = use('App/Models/Record')
/**
 * Resourceful controller for interacting with homes
 */
class HomeController {
  /**
   * Show a list of all homes.
   * GET homes
   */
  async index ({ request, response, view }) {
    let date = new Date()
    date.setDate(date.getDate() - 3)

    let raw_contents = await RawContent.query().where(function() {
      this.where('post_at', '>=', date.getTime())

    }).orderBy('post_id','desc').fetch()
    raw_contents = raw_contents.toJSON()
    raw_contents = HeadphoneAnalyzeService.get_result(raw_contents)
    raw_contents = raw_contents.filter(function(x){return x.state !== 'buy'})

    let stocks = await Stock.query().orderBy('id', 'desc').fetch()

    let records = await Record.query().orderBy('id', 'desc').fetch()

    return view.render('home.index',{raw_contents: raw_contents, stocks: stocks.toJSON(), records: records.toJSON()})

  }

}

module.exports = HomeController
