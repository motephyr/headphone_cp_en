'use strict'
const RawContent = use('App/Models/RawContent')
const Stock = use('App/Models/Stock')
const Record = use('App/Models/Record')
const HeadphoneAnalyzeService = require("../../Services/HeadphoneAnalyzeService")

class StockController {
  /**
   * buy or sell headphone
   * 
   * set raw_contest state (buy/sell)
   * set stock data
   * set record data
   */
  async buy({ request, response, view }) {
    let body = request.body

    let raw_content = await RawContent.findBy('post_id', body.post_id)
    if (raw_content) {
        raw_content.state = body.situation
        await raw_content.save()

        if (body.situation === 'buy') {
          let obj = HeadphoneAnalyzeService.get_name_price(raw_content)

          let stock = new Stock()
          stock.raw_content_id = raw_content.id
          stock.bought_at = new Date()
          stock.name = obj.name
          stock.price = parseInt(body.price)
          await stock.save()

          let price = -stock.price

          const last_record = await Record.query()
            .orderBy('id', 'desc')
            .limit(1)
            .fetch()
          const result = last_record.toJSON()[0]

          const now_price = result ? result.price : 10000
          const future_price = now_price + price

          let record = new Record()
          record.raw_content_id = raw_content.id
          record.situation = body.situation
          record.name = obj.name
          record.now_value = future_price
          record.difference = price
          record.happened_at = new Date()

          await record.save()
        }
    }
    response.redirect('/home')
  }


  async recover_data({response}){
    await Record.query().delete()
    await Stock.query().delete()
    await RawContent.query().where({state: 'buy'}).update({state: null})
    response.redirect('/home')

  }
}
module.exports = StockController
