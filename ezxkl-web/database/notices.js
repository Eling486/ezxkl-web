var mongoose=require('mongoose');
//var db=mongoose.createConnection('mongodb://nodeadmin:simplepwd@127.0.0.1:27017/nodedb');
var db=mongoose.createConnection('mongodb://127.0.0.1:27017/nodedb');
db.on('error',function(error){
	console.log(error);
});

var mongooseNoticeSchema=new mongoose.Schema({
	time:{type:String},
	title:{type:String},
	user:{type:String},
    content:{type:String},
});
var mongooseNoticeModel=db.model('notice',mongooseNoticeSchema);

mongooseNoticeSchema.methods.countDocuments=function(str,callback){
	return this.model('notice').countDocuments({str},callback);
}
module.exports=mongooseNoticeModel;