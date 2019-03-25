'use strict'
const CrawlerService = require("../../Services/CrawlerService")
const HeadphoneAnalyzeService = require("../../Services/HeadphoneAnalyzeService")
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
  async classify_and_appear_more ({ request, response, view }) {
    let raw_contents = await RawContent.query().fetch()
    raw_contents = raw_contents.toJSON()

    let result = HeadphoneAnalyzeService.get_result(raw_contents)
    let names = result.map((x) => x.name)
    let get_frequency = HeadphoneAnalyzeService.get_frequency(names)
    let appear_more = HeadphoneAnalyzeService.appear_more(get_frequency)

  
    return view.render('crawler.classify_and_appear_more', { result: appear_more })
  }
}

module.exports = CrawlerController
