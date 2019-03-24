
class HeadphoneAnalyzeService {
  static get_name_price(obj) {
    String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
    };
    // remove \r\n
    obj.post_description = obj.post_description.replaceAll('\r','').replaceAll('\n','')

    // get name
    obj.name = obj.post_title.match(/[A-Za-z]+\d+([A-Za-z]*|)/g)

    // get situation

    let situation = obj.post_title.match(/(出|售)/g)
    if(situation){
      obj.situation = '賣'
    }else{
      situation = obj.post_title.match(/(收)/g)
      obj.situation = '買'
    }
    
    // get price
    let judge_price = obj.post_title.match(/(\d+出|出\d+|\d+售|售\d+|\d+收|收\d+)/g)
    if(judge_price){
      obj.price = judge_price[0].match(/\d+/g)
    }else{
      // let judge_price2 = obj.post_description.match(/[^a-zA-Z0-9_+.]\d+[^a-zA-Z0-9_+.][^a-zA-Z0-9_+.]/g)
      let judge_price2 = obj.post_description.match(/(价.\d+|价格.\d+|\d+包|\d+到|售\d+|\d+块|\d+元| \d+ |\d+出|\d+求)/g)

      if(judge_price2){
        obj.price = judge_price2[0].match(/\d+/g)
      }else{
        obj.price = null
      }
    }


    
    return {situation: obj.situation, title: obj.post_title, name: obj.name && obj.name[0], price: obj.price && obj.price[0], time: obj.time}
  }


}

module.exports = HeadphoneAnalyzeService
