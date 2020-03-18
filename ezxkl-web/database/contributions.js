var mongoose=require('mongoose');
//var db=mongoose.createConnection('mongodb://nodeadmin:simplepwd@127.0.0.1:27017/nodedb');
var db=mongoose.createConnection('mongodb://127.0.0.1:27017/nodedb');
db.on('error',function(error){
	console.log(error);
});

var mongooseContributionSchema=new mongoose.Schema({
	contribute_id:{type:String},
    contribute_time:{type:String},
	user:{type:String},
    ncmid:{type:String},
	realname:{type:String},
	showname:{type:String},
	artist:{type:String},
	notes:{type:String},
	state:{type:String},
	type:{type:String},
	plan_time:{type:String},
	check_user:{type:String},
	check_time:{type:String},
	check_notes:{type:String},
});
var mongooseContributionModel=db.model('contributions',mongooseContributionSchema);

mongooseContributionSchema.methods.countDocuments=function(str,callback){
	return this.model('contributions').countDocuments({str},callback);
}
/*mongooseContributionSchema.methods.findAll=function({},callback){
	return this.model('contributions').find({},callback);
}*/
module.exports=mongooseContributionModel;