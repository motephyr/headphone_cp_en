

class AnalyzeService {
  static get_result(raw_contents) {
    let array = []
    for (let i = 0; i < raw_contents.length; i++) {
      let obj = AnalyzeService.get_name_price(raw_contents[i])
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

    obj.name = obj.post_title.match(/[A-Za-z]+\d+([A-Za-z]*|)/g)
    if(obj.post_description){
      obj.post_description = obj.post_description.replaceAll('\t', '').replaceAll('\n', '')
      obj.situation = obj.post_description.match(/Type: ([A-Za-z ]*)Currency/g) ? obj.post_description.match(/Type: ([A-Za-z ]*)Currency/g)[0].replace('Type: ', '').replace('Currency', '') : null
      obj.price = obj.post_description.match(/Price: ([0-9.]*)Ship/g) ? obj.post_description.match(/Price: ([0-9.]*)Ship/g)[0].replace('Price: ', '').replace('Ship', '') : null
    }

    return { 
      ori_id: obj.id,
      id: obj.post_id, 
      link: obj.post_link, 
      situation: obj.situation, 
      name: obj.name && obj.name[0].toLowerCase(), 
      title: obj.post_title.replaceAll('"', ' '), 
      price: obj.price && parseInt(obj.price), 
      time: new Date(obj.time).getTime(), 
      ori_time: obj.time,
    state: obj.state }
  }


}

module.exports = AnalyzeService
