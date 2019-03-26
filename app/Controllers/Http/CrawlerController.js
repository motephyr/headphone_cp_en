'use strict'
const CrawlerService = require("../../Services/CrawlerService")
const HeadphoneAnalyzeService = require("../../Services/HeadphoneAnalyzeService")
const StatHelpers = require("../../Helpers/StatHelpers")

const RawContent = use('App/Models/RawContent')
const dl = require('datalib')
class CrawlerController {
  async get_data ({ request, response }) {

    // return await CrawlerService.get_data()
  }

  
  async analyze_data({request, response, view}) {
    /* From row data to get
      situation: buy or sell
      title: origin title
      name: get headphone name
      price: get price
      time: post time
    */

    let raw_contents = await RawContent.query().fetch()
    raw_contents = raw_contents.toJSON()
    let result = HeadphoneAnalyzeService.get_result(raw_contents)

    return view.render('crawler.analyze_data', { raw_contents: result })
    
  }
  async classify_and_appear_more ({ request, response, view }) {
    let raw_contents = await RawContent.query().fetch()
    raw_contents = raw_contents.toJSON()

    let result = HeadphoneAnalyzeService.get_result(raw_contents)

    let names = result.map((x) => x.name)
    let get_frequency = HeadphoneAnalyzeService.get_frequency(names)
    let appear_more = HeadphoneAnalyzeService.appear_more(get_frequency)

    let merge_array = appear_more.map(function(x) {
      x.data = result.filter(function(element) {
        return element.name == x.name;
      });
      return x
    })

    let result2 = merge_array.map(function(x){
      let filterOutliers = StatHelpers.filterOutliers(x.data)
      let rollup = dl.groupby('name', 'situation')
      .summarize({'price': ['mean', 'stdev', 'count']})
      .execute(filterOutliers);

      x.rollup = dl.format.table(rollup).trim()
      let sell = rollup.find((x) => x.situation == 'sell')
      let buy = rollup.find((x) => x.situation == 'buy')

      x.buy_it = (buy && sell && buy.mean_price > sell.mean_price) ? 'true' : ""

      return x
    })

    
    return view.render('crawler.classify_and_appear_more', { result: result2 })
  }
  async product_trend ({ request, response, view }) {
    const query = request.get()

    let raw_contents = await RawContent.query().fetch()
    raw_contents = raw_contents.toJSON()
    
    let result = HeadphoneAnalyzeService.get_result(raw_contents)
    let result2 = result.filter((x) => x.name === query.name).sort(function(a,b){

      return a.time - b.time;
    })
    
    var minustime = result2[0].time

    result2 = result2.map(function(x){
      x.time = x.time - minustime
      return x
    });

    let filterOutliers = StatHelpers.filterOutliers(result2)


    var rollup = dl.groupby('situation')
    .summarize({'price': ['mean', 'stdev', 'count']})
    .execute(filterOutliers);


    return view.render('crawler.product_trend', { html_result: filterOutliers, result: JSON.stringify(filterOutliers), stat: dl.format.table(rollup) })
  }
}

module.exports = CrawlerController
