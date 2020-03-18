var mongoose=require('mongoose');
//var db=mongoose.createConnection('mongodb://nodeadmin:simplepwd@127.0.0.1:27017/nodedb');
var db=mongoose.createConnection('mongodb://127.0.0.1:27017/nodedb');
db.on('error',function(error){
	console.log(error);
});

var mongooseUserSchema=new mongoose.Schema({
	uid:{type:String},
	name:{type:String},
	password:{type:String},
	email:{type:String},
	admin:{type:Boolean}
});
mongooseUserSchema.methods.findByName=function(name,callback){
	return this.model('user').find({name:name},callback);
}
var mongooseUserModel=db.model('user',mongooseUserSchema);

module.exports=mongooseUserModel;
