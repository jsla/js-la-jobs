var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/jsla_jobs');

var JobSchema = new Schema({
    company: String
  , company_url: String
  , logo: String
  , location: String
  , position: String
  , body: String
  , created_at: Date
  , activated_at: Date
  , created_by: String
})

var Job = mongoose.model('Job', JobSchema)

module.exports = Job