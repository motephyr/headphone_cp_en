'use strict'
const CrawlerService = require("../../Services/CrawlerService")

class CrawlerController {
  get_data ({ request, response }) {

    return CrawlerService.get_data("AA")
  }
}

module.exports = CrawlerController
