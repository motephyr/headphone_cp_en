

class HeadphoneAnalyzeService {
  static get_result(raw_contents) {
    let array = []
    for (let i = 0; i < raw_contents.length; i++) {
      let obj = HeadphoneAnalyzeService.get_name_price(raw_contents[i])
      if (obj.name && obj.price && obj.situation) {
        array.push(obj)
      }
    }
    return array
  }

  static get_name_price(obj) {
    String.prototype.replaceAll = function (search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
    };
    // remove \r\n
    if(obj.post_description){
      obj.post_description = obj.post_description.replaceAll("\r\n", "\n").replaceAll("\r", "\n").replaceAll("\n", "<br />")
    }
    // get name
    obj.name = obj.post_title.match(/[A-Za-z]+\d+([A-Za-z]*|)/g)

    // get situation

    let situation = obj.post_title.match(/(出|售|卖)/g)
    if (situation) {
      obj.situation = 'sell'
    }
    situation = obj.post_title.match(/(收)/g)
    if (situation) {
      obj.situation = 'buy'
    }

    // get price
    let judge_price = obj.post_title.match(/(\d+出|出\d+|\d+售|售\d+|\d+收|收\d+)/g)
    if (judge_price) {
      obj.price = judge_price[0].match(/\d+/g)
    } else if(obj.post_description){
      // let judge_price2 = obj.post_description.match(/[^a-zA-Z0-9_+.]\d+[^a-zA-Z0-9_+.][^a-zA-Z0-9_+.]/g)
      let judge_price2 = obj.post_description.match(/(价.\d+|价格.\d+|\d+包|\d+到|售\d+|\d+块|\d+元| \d+ |出\d+|\d+求)/g)
      if (judge_price2) {
        obj.price = judge_price2[0].match(/\d+/g)
      } else {
        obj.price = null
      }
    }


    return { 
      ori_id: obj.id,
      id: obj.post_id, 
      link: obj.post_link, 
      situation: obj.situation, 
      title: obj.post_title, 
      name: obj.name && obj.name[0].toLowerCase(), 
      price: obj.price && parseInt(obj.price[0]), 
      time: new Date(obj.time).getTime() / (60 * 60 * 24 * 1000), 
      ori_time: obj.time }
  }


}

module.exports = HeadphoneAnalyzeService
