'use strict'
const RawContent = use('App/Models/RawContent')
const AnalyzeService = require("../../Services/AnalyzeService")
const Stock = use('App/Models/Stock')
const Record = use('App/Models/Record')
const TargetContent = use('App/Models/TargetContent')

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
    raw_contents = AnalyzeService.get_result(raw_contents)
    raw_contents = raw_contents.filter(function(x){return x.state !== 'buy'})

    raw_contents = raw_contents.map(async function(x){
      let target = await TargetContent.findBy('name', x.name)
      x.buy_it = ""
      if(target){
        x.buy_it = 'target'
        if(x.price < target.mean_price - target.stdev_price){
          x.buy_it = 'mustBuy'
        }
      }
      return x
    })

    let stocks = await Stock.query().orderBy('id', 'desc').fetch()

    let records = await Record.query().orderBy('id', 'desc').fetch()

    raw_contents = await Promise.all(raw_contents)

    return view.render('home.index',{raw_contents: raw_contents, stocks: stocks.toJSON(), records: records.toJSON()})

  }

}

module.exports = HomeController
