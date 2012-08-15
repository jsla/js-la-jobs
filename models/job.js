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

JobSchema.path('company').required(true)
JobSchema.path('company_url').required(true)
JobSchema.path('location').required(true)
JobSchema.path('position').required(true)
JobSchema.path('body').required(true)
JobSchema.path('how_to_apply').required(true)
JobSchema.path('created_by').required(true)
JobSchema.path('created_at').required(true)

var Job = mongoose.model('Job', JobSchema)



module.exports = Job