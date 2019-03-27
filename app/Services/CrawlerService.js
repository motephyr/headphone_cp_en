const Crawler = require("crawler");
const RawContent = use('App/Models/RawContent')
const TargetContent = use('App/Models/TargetContent')

const MailService = require("./MailService")
const HeadphoneAnalyzeService = require("./HeadphoneAnalyzeService")

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
  /**
   * From headphone_detail_page, get post_description
   * @param obj include post_id, post_title, post_link, time
   * @param need_mail if true, we will check new data if exists in TargetContent 
   */
  static async get_data_detail_page(obj, need_mail) {

    c.queue({
      uri: `http://www.erji.net/${obj.post_link}`,
      callback: async function (error, res, done) {
        if (error) {
          console.log(error);
        } else {
          var $ = res.$;
          let common = $('div').add('t_fsz').find('td .t_f')

          obj.post_description = $(common[0]).text()

          const result = await RawContent.findBy('post_id', obj.post_id)
          
          if (!result) {
            const raw_content = new RawContent()
            raw_content.post_id = obj.post_id
            raw_content.post_title = obj.post_title
            raw_content.post_description = obj.post_description
            raw_content.post_link = obj.post_link
            raw_content.time = obj.time
            raw_content.post_at = new Date(obj.time)
            await raw_content.save()

            if (need_mail) {
              console.log('send_mail')
              obj = HeadphoneAnalyzeService.get_name_price(obj)
              if (obj.name) {
                let target = await TargetContent.findBy('name', obj.name)
                if (target){
                  MailService.send({ subject: obj.title, text: JSON.stringify(obj) })
                }
              }
            }
          }
        }
        done();
      }
    })


  }




  static async get_data_page(nowpage, totalpage, result, need_mail) {
    c.queue({
      uri: `http://www.erji.net/forum.php?mod=forumdisplay&fid=8&filter=author&orderby=dateline&typeid=10&page=${nowpage}`,
      callback: function (error, res, done) {
        if (error) {
          console.log(error);
        } else {
          var $ = res.$;
          let common = $('tr').add(' .common')
          for (let i = 0; i < common.length; i++) {
            // console.log(common[i])
            let obj = {}
            obj.post_id = $(common[i]).find(' .showcontent').attr('id')
            obj.post_title = $(common[i]).find(' .xst').text()
            obj.post_link = $(common[i]).find(' .xst').attr('href')
            obj.time = $($(common[i]).find(' .by')[0]).find('span').text()
            if (obj.post_title && obj.post_link) {
              CrawlerService.get_data_detail_page(obj, need_mail)
            }
          }

          // console.log(`nowpage=${nowpage} result_length=${result.length} `)
          // if (nowpage < totalpage) {

          //   CrawlerService.get_data_page(nowpage + 1, totalpage, result)
          // } else {
          //   CrawlerService.get_data_detail_page(0, result)
          // }
        }
        done();
      }
    })
  }

  static async get_data() {
    // await RawContent.query().delete() // all delete test

    // if (!lock) {
    lock = true
    // Queue URLs with custom callbacks & parameters
    c.queue([{
      uri: 'http://www.erji.net/forum.php?mod=forumdisplay&fid=8&filter=author&orderby=dateline&typeid=10',

      // The global callback won't be called
      callback: function (error, res, done) {
        if (error) {
          console.log(error);
        } else {
          var $ = res.$;
          let totalpage = $('#autopbn').attr('totalpage')
          for (let i = 1; i <= totalpage; i++) {
            console.log(i)
            CrawlerService.get_data_page(i, totalpage, [], false)
          }
          console.log('Grabbed', res.body.length, 'bytes');
        }
        done();
      }
    }]);

    // }

    return 'finish'
  }
}

module.exports = CrawlerService