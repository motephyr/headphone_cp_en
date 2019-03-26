'use strict'

const Model = use('Model')

class TargetContent extends Model {


  static async renew_data(data){
    await TargetContent.query().delete()
    
    for(let i=0; i<data.length; i++){
      let obj = new TargetContent()
      obj.name =  data[i].name

      let sell = data[i].stat.find((x) => { return x.situation === 'sell'})
      obj.mean_price = sell.mean_price
      obj.stdev_price = sell.stdev_price
      obj.save()
    }
  }
}

module.exports = TargetContent
