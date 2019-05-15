const Crawler = require("crawler");
const RawContent = use('App/Models/RawContent')
const TargetContent = use('App/Models/TargetContent')

const MailService = require("./MailService")
const AnalyzeService = require("./AnalyzeService")

const c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      console.log($("title").text());
    }
    done();
  }
});

let lock = false
class CrawlerService {


  static async get_data_page(nowpage, totalpage, result, need_mail) {
    let url = ''
    if (nowpage === 1) {
      url = 'https://www.head-fi.org/forums/headphones-for-sale-trade.6550/'
    } else {
      url = `https://www.head-fi.org/forums/headphones-for-sale-trade.6550/page-${nowpage}`
    }
    c.queue({
      uri: url,
      callback: async function (error, res, done) {
        if (error) {
          console.log(error);
        } else {
          try {
            var $ = res.$;
            let common = $('ol.discussionListItems > li')
            for (let i = 0; i < common.length; i++) {
              if (common.eq(i).attr('id')) {
                // let inner = common.eq(i).find('.pairsInline').text().replaceAll('\t', '').replaceAll('\n', '')
                // if(inner && inner !== ''){
                //   obj.type = inner.match(/Type: ([A-Za-z ]*)Currency/g)[0].replace('Type: ', '').replace('Currency', '')
                //   obj.currency = inner.match(/Currency: ([A-Za-z ]*)Price/g)[0].replace('Currency: ', '').replace('Price', '')
                //   obj.price = inner.match(/Price: ([0-9.]*)Ship/g)[0].replace('Price: ', '').replace('Ship', '')
                //   obj.ship_to = inner.match(/Ship to: ([A-Za-z ]*)/g)[0].replace('Ship to: ', '').replace('Best offer', '')
                // }
                let post_id = common.eq(i).attr('id')
                let raw_content = await RawContent.findBy('post_id', post_id)
                if (!raw_content) {
                  raw_content = new RawContent()
                  raw_content.post_id = post_id
                  raw_content.post_title = common.eq(i).find('h3 > a').text()
                  raw_content.post_description = common.eq(i).find('.pairsInline').text()
                  raw_content.post_link = common.eq(i).find('h3 > a').attr('href')
                  if (common.eq(i).find('abbr').attr('data-time')) {
                    raw_content.post_at = parseInt(common.eq(i).find('abbr').attr('data-time')) * 1000
                    let str = new Date(raw_content.post_at).toISOString()
                    raw_content.time = str.substring(0, str.length - 8).replace('T', ' ')
                  } else if (common.eq(i).find('a.dateTime')) {
                    raw_content.post_at = new Date(common.eq(i).find('a.dateTime').text())
                    if (raw_content.post_at) {
                      let str = new Date(raw_content.post_at).toISOString()
                      raw_content.time = str.substring(0, str.length - 8).replace('T', ' ')
                    }
                  }
                  await raw_content.save()
                  if (need_mail) {
                    console.log('send_mail')
                    raw_content = AnalyzeService.getNamePrice(raw_content)
                    if (raw_content.name) {
                      let target = await TargetContent.findBy('name', raw_content.name)
                      if (target) {
                        MailService.send({ subject: raw_content.title, text: JSON.stringify(raw_content) })
                      }
                    }
                  }
                }

              }
            }
          } catch (err) {
            console.log(err)
          }

        }
        done();
      }
    })
  }

  static async get_data() {
    let totalpage = 1611
    for (let i = 1; i <= 800; i++) {
      CrawlerService.get_data_page(i, totalpage, [], false)
    }

    return 'finish'
  }
}

module.exports = CrawlerService