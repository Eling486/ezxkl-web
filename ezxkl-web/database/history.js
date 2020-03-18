var mongoose=require('mongoose');
//var db=mongoose.createConnection('mongodb://nodeadmin:simplepwd@127.0.0.1:27017/nodedb');
var db=mongoose.createConnection('mongodb://127.0.0.1:27017/nodedb');
db.on('error',function(error){
	console.log(error);
});

var mongooseHistorySchema=new mongoose.Schema({
	week:{type:String},
	date:{type:String},
    ncmid:{type:String},
	realname:{type:String},
	showname:{type:String},
	artist:{type:String},
	state:{type:String},
	user:{type:String},
});
var mongooseHistoryModel=db.model('history',mongooseHistorySchema);

mongooseHistorySchema.methods.countDocuments=function(str,callback){
	return this.model('history').countDocuments({str},callback);
}
/*mongooseHistorySchema.methods.findAll=function({},callback){
	return this.model('history').find({},callback);
}*/
module.exports=mongooseHistoryModel;