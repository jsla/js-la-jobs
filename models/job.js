var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/jsla_jobs'+'-'+process.env.NODE_ENV);

var JobSchema = new Schema({
    company: String
  , company_url: String
  , logo_url: String
  , location: String
  , position: String
  , body: String
  , how_to_apply: String
  , created_at: Date
  , activated_at: Date
  , created_by: String
})

var Job = mongoose.model('Job', JobSchema)

module.exports = Job