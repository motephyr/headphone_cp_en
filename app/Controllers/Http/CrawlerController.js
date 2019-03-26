'use strict'
const CrawlerService = require("../../Services/CrawlerService")
const HeadphoneAnalyzeService = require("../../Services/HeadphoneAnalyzeService")
const StatHelpers = require("../../Helpers/StatHelpers")

const RawContent = use('App/Models/RawContent')
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
  async classify_and_choose_target_and_save ({ request, response, view }) {
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

    // get multi brand Statistics 
    result = merge_array.map(function(x){
      let filterOutliers = StatHelpers.filterOutliers(x.data)
      return HeadphoneAnalyzeService.get_statistic_data(filterOutliers, x)
    })

    
    return view.render('crawler.classify_and_choose_target_and_save', { result: result })
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

    // get single brand Statistics 
    let filterOutliers = StatHelpers.filterOutliers(result2)
    filterOutliers = HeadphoneAnalyzeService.get_statistic_data(filterOutliers, filterOutliers)

    return view.render('crawler.product_trend', { html_result: filterOutliers, result: JSON.stringify(filterOutliers)})
  }
}

module.exports = CrawlerController
