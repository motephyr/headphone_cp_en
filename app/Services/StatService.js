const dl = require('datalib')
const RawContent = use('App/Models/RawContent')
const AnalyzeService = require("./AnalyzeService")
const StatHelpers = require("../Helpers/StatHelpers")
const TargetContent = use('App/Models/TargetContent')

class StatService{
  static async calculate(){
    let raw_contents = await RawContent.query().fetch()
    raw_contents = raw_contents.toJSON()

    let result = AnalyzeService.getResult(raw_contents)

    let names = result.map((x) => x.name)
    let get_frequency = StatService.get_frequency(names)
    let appear_more = StatService.appearMore(get_frequency)

    let merge_array = appear_more.map(function(x) {
      x.data = result.filter(function(element) {
        return element.name == x.name;
      });
      return x
    })

    // get multi brand Statistics 
    result = merge_array.map(function(x){
      let filterOutliers = StatHelpers.filterOutliers(x.data)
      return StatService.getStatisticData(filterOutliers, x)
    })

   
    await TargetContent.renewData(result.filter(function(x){ return x.buy_it == 'true'}))
    return result
  }

  static getStatisticData(origin_data, x){
    x.stat = dl.groupby('name', 'situation')
    .summarize({'price': ['mean', 'stdev', 'count']})
    .execute(origin_data);

    x.rollup = dl.format.table(x.stat).trim()

    x.linearRegression = dl.linearRegression(origin_data, function(x) { return x.price; }, function(x) { return x.time; })
    x.buy_it = (x.linearRegression.slope > -0.02) ? 'true' : ""
    return x
  }

  static appearMore(list) {
    // choose headphone which more data.
    let result = Object.keys(list).filter(function (x) {
      return list[x] > 15
    })
    let result2 = []
    for (let i = 0; i < result.length; i++) {
      result2.push({ name: result[i], freq: list[result[i]] })
    }
    return result2
  }
  static get_frequency(string) {
    var freq = {};
    for (var i = 0; i < string.length; i++) {
      var character = string[i];
      if (freq[character]) {
        freq[character]++;
      } else {
        freq[character] = 1;
      }
    }

    return freq;
  }
}
module.exports = StatService