const Crawler = require("crawler");
const c = new Crawler({
  maxConnections: 5,
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

  static async get_data_detail_page(nowtopic, result) {
    // if(nowtopic <= thispagetotaltopic){
    //   console.log(`nowtopic=${nowtopic} `)

    //   CrawlerService.get_data_detail_page({nowpage: nowpage, totalpage: totalpage, result: result, nowtopic: nowtopic +1, thispagetotaltopic: thispagetotaltopic})
    // }else{
    //   CrawlerService.get_data_page(nowpage, totalpage, result)
    // }
    if (nowtopic < result.length) {
      c.queue({
        uri: `http://www.erji.net/${result[nowtopic].post_link}`,
        callback: function (error, res, done) {
          if (error) {
            console.log(error);
          } else {
            console.log(nowtopic)
            var $ = res.$;
            let common = $('div').add('t_fsz').find('td .t_f')

            result[nowtopic].post_description = $(common[0]).text()

            CrawlerService.get_data_detail_page(nowtopic + 1, result)
          }
          done();
        }
      })
    } else {
      console.log(result)
      console.log(`result_length=${result.length} end`)
      lock = false
    }

  }




  static async get_data_page(nowpage, totalpage, result) {
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
            obj.post_title = $(common[i]).find(' .xst').text()
            obj.post_link = $(common[i]).find(' .xst').attr('href')
            obj.time = $($(common[i]).find(' .by')[0]).find('span').text()
            // console.log(obj)
            if (obj.post_title && obj.post_link) {
              result.push(obj);
            }
          }

          console.log(`nowpage=${nowpage} result_length=${result.length} `)
          if (nowpage < totalpage) {

            CrawlerService.get_data_page(nowpage + 1, totalpage, result)
          } else {
            CrawlerService.get_data_detail_page(0, result)
          }
        }
        done();
      }
    })
  }

  static async get_data(aaa) {

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

            CrawlerService.get_data_page(1, 2, [])
            console.log('Grabbed', res.body.length, 'bytes');
          }
          done();
        }
      }]);

    // }

    return aaa
  }
}

module.exports = CrawlerService