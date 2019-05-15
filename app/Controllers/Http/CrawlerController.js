'use strict'
const CrawlerService = require("../../Services/CrawlerService")
const AnalyzeService = require("../../Services/AnalyzeService")
const StatService = require("../../Services/StatService")

const StatHelpers = require("../../Helpers/StatHelpers")

const RawContent = use('App/Models/RawContent')

class CrawlerController {
  async get_data ({ request, response }) {

    // return await CrawlerService.get_data()
    await CrawlerService.get_data_page(1, 1, [], false)
    response.redirect('/home')


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
    let result = AnalyzeService.getResult(raw_contents)

    return view.render('crawler.analyze_data', { raw_contents: result })
    
  }
  async classify_and_choose_target_and_save ({ request, response, view }) {
    let result = await StatService.calculate()
    
    
    return view.render('crawler.classify_and_choose_target_and_save', { result: result })
  }
  async product_trend ({ request, response, view }) {
    const query = request.get()

    let raw_contents = await RawContent.query().fetch()
    raw_contents = raw_contents.toJSON()
    
    let result = AnalyzeService.getResult(raw_contents)
    let result2 = result.filter((x) => x.name === query.name).sort(function(a,b){

      return a.time - b.time;
    })
    
    var minustime = result2[0].time

    result2 = result2.map(function(x){
      x.time = x.time - minustime
      return x
    });

    // get single brand Statistics 
    let filterOutliers = StatHelpers.filterOutliers(result2)
    filterOutliers = StatService.getStatisticData(filterOutliers, filterOutliers)

    return view.render('crawler.product_trend', { html_result: filterOutliers, result: JSON.stringify(filterOutliers)})
  }
}

module.exports = CrawlerController
