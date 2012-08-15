var fs = require('fs')

var validJSON = fs.readFileSync(__dirname+'/fixtures/valid_job.json')

var JobFactory = function() {
  return JSON.parse(validJSON)
}

module.exports = JobFactory