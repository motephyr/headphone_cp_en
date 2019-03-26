const outliers = require('./outliers')
class StatHelpers {
  static filterOutliers(someArray) {

    return someArray.filter(outliers('price'));
  }
}
module.exports = StatHelpers