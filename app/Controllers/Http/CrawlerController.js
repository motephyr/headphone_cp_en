'use strict'
const CrawlerService = require("../../Services/CrawlerService")
const HeadphoneAnalyzeService = require("../../Services/HeadphoneAnalyzeService")
const RawContent = use('App/Models/RawContent')

class CrawlerController {
  async get_data ({ request, response }) {

    return await CrawlerService.get_data()
  }

  async analyze_data({request, response}) {
    let raw_contents = await RawContent.query().fetch()
    raw_contents = raw_contents.toJSON()
    let array = []
    for(let i = 0; i< raw_contents.length; i++){
      let obj = HeadphoneAnalyzeService.get_name_price(raw_contents[i])
      if(obj.name && obj.price){
        array.push(obj)
      }
    }
//     array = array.map((x) => x.post_description)
// array = array.join('\n')
// console.log(array)
    return array
  }
}

module.exports = CrawlerController
