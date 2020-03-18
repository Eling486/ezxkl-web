var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('zh-cn');
var time = moment().format('YYYY-MM-DD HH:mm:ss');
const nodemailer = require("nodemailer")

/*创建新路径语法（page为新页面）
router.get('/page', function(req, res, next) {	
	res.render('page', { title: 'page' });
  });
*/

/* GET index page. */
router.get('/', function (req, res, next) {
	res.render('index');
});

router.get('/getnotices', function (req, res, next) {
	var Notice = global.noticedb;
	var NowDate = moment().format('YYYY-MM-DD HH:mm:ss');
	Notice.find({ time: { "$lt": NowDate } }, function (err, result) {
		if (err) {
			res.send(500);
			console.log(err);
		}
		else if (result) {
			res.json(result);
		}
	});
});

/* GET plan page. */
router.get('/plan', function (req, res, next) {
	res.render('plan');
});

router.route('/getplan').get(function (req, res) {
	/*var Day1 = "2019/2/25"
	var Day2 = "2019/2/26"
	var Day3 = "2019/2/27"
	var Day4 = "2019/2/28"
	var Day5 = "2019/3/1"*/
	var weekOfday = moment().format('E');//计算今天是这周第几天
	var Day1 = moment().subtract(weekOfday - 1, 'days').format('YYYY/M/D');
	var Day2 = moment().subtract(weekOfday - 2, 'days').format('YYYY/M/D');
	var Day3 = moment().subtract(weekOfday - 3, 'days').format('YYYY/M/D');
	var Day4 = moment().subtract(weekOfday - 4, 'days').format('YYYY/M/D');
	var Day5 = moment().subtract(weekOfday - 5, 'days').format('YYYY/M/D');

	var History = global.historydb;
	var planinfos = ""

	History.find({ $or: [{ date: Day1 }, { date: Day2 }, { date: Day3 }, { date: Day4 }, { date: Day5 }] }, {date: 1, showname: 1, user: 1}, function (err, result) {
		if (err) {
			res.send(500);
			console.log(err);
		}
		else if (result) {
			res.json(result);
		}
	});

});


/* GET history page. */
router.get('/history', function (req, res, next) {
	res.render('history');
});

/* GET contribution page. */
router.route('/contribution').get(function (req, res) {
	if (!req.session.user) {
		req.session.error = "请先登录"
		res.redirect("/login");
	}
	console.log('-------用户登录-------')
	console.log("登录时间：" + time);
	console.log(req.session.user);
	console.log('---------------------')
	res.render('contribution', { title: '下课铃投稿' });

}).post(function (req, res) {
	/*投稿信息处理-数据库版*/
	var user = req.body.user;
	var ncmid = req.body.ncmid;
	var realname = req.body.realname;
	var artist = req.body.artist;
	var notes = req.body.notes;
	var state = req.body.state;
	var time = moment().format('YYYY-MM-DD HH:mm:ss');

	var Contribution = global.contributiondb;
	Contribution.findOne({ ncmid: ncmid, user: user }, function (err, result) {
		if (err) {
			res.send(500);
			console.log(err);
		}
		else if (result) {
			req.session.error = '请勿重复投稿哟';
			res.send(500);
		} else {
			total = Contribution.count("ncmid", function (err, total) {
				if (err) {
					res.send(500);
					console.log(err);
				} else {
					//type:"waiting"/"success"/"fail"(待录用/已录用/未录用)
					Contribution.create({
						contribute_id: total + 1,
						contribute_time: time,
						user: user,
						ncmid: ncmid,
						realname: realname,
						showname: "",
						artist: artist,
						state: state,
						notes: notes,
						type: "waiting",
						check_user: "",
						check_time: "",
						check_notes: "",
					}, function (err, doc) {
						if (err) {
							res.send(500);
							console.log(err);
						} else {
							req.session.error = '';
							params = {
								"contribute-id": total + 1,
								"contribute-time": time,
								"user": user,
								"ncmid": ncmid,
								"realname": realname,
								"artist": artist,
								"state": state,
								"notes": notes,
								"type": "waiting"
							}
							console.log('-------收到投稿-------');
							console.log(params);
							console.log('---------------------');
							res.send(200);
						}
					})
				}
			})
		}
	});
});

//这是旧版的JSON文件存储投稿方法
/*var params
	fs.readFile('./jsons/contribution/contribution.json',function(err,data){
	  if(err){
		return console.error(err);
	  }
	  var person = data
	  person = JSON.parse(person);
	  var total = person.contributions.length;
	  params = {
		"contribute-id":total + 1,
		"contribute-time":time,
		"user":user,
		"ncmid":ncmid,
		"realname":realname,
		"artist":artist,
		"state":state,
		"type":"waiting"
	  }
	  //"type":"waiting"/"success"/"fail"(待录用/已录用/未录用)
	  console.log('-------收到投稿-------');
	  console.log(params);
	  console.log('---------------------');
	  person.contributions.push(params);
	  person.total = person.contributions.length;
	  var str = JSON.stringify(person,"","\t");
	  fs.writeFile('./jsons/contribution/contribution.json',str,function(err){
		if(err){
		  console.error(err);
		}
	  })
	})
  res.send(200);
});*/


/* GET register page. */
router.route('/register').get(function (req, res) {
	res.render('register', { title: '注册' });
}).post(function (req, res) {
	var username = req.body.name;
	var psw = req.body.psw;
	var email = req.body.email;
	var User = global.userdb;
	User.findOne({ name: username }, function (err, result) {

		if (err) {
			res.send(500);
			console.log(err);
		}
		else if (result) {
			req.session.error = '用户名已存在';
			res.send(500);
		}
		else {
			var uid = 0;
			User.findOne({}).sort({ uid: -1 }).limit(1).exec(function (err, last) {
				if (err) {
					res.send(500);
					console.log(err);
				} else {
					uid = Number(last.uid) + 1;
					User.create({
						uid: uid,
						name: username,
						password: psw,
						email: email,
						admin: false
					}, function (err, doc) {
						if (err) {
							res.send(500);
							console.log(err);
						}
						else {
							req.session.error = '注册成功';
							res.send(200);
						}
					})
				}
			});

		}
	});

});

/* GET login page. */
router.route('/login').get(function (req, res) {
	//alert('get');
	res.render('login', { title: '登录' });
}).post(function (req, res) {
	var username = req.body.name;
	var psw = req.body.psw;
	var User = global.userdb;
	User.findOne({ name: username }, function (err, result) {

		if (err) {
			res.send(500);
			console.log(err);
		}
		else if (!result) {
			req.session.error = '用户名不存在';
			res.send(404);
		}
		else {
			if (psw != result.password) {
				req.session.error = '密码错误';
				res.send(404);
			}
			else {
				req.session.user = result;
				req.session.admin = result.admin;
				res.send(200);
			}
		}
	});
});

/* GET admin-login page. */
router.route('/adminlogin').get(function (req, res) {
	//alert('get');
	res.render('adminlogin', { title: '登录' });
}).post(function (req, res) {
	var username = req.body.name;
	var psw = req.body.psw;
	var User = global.userdb;
	User.findOne({ name: username }, function (err, result) {

		if (err) {
			res.send(500);
			console.log(err);
		}
		else if (!result) {
			req.session.error = '用户名不存在';
			res.send(404);
		}
		else {
			if (psw != result.password) {
				req.session.error = '密码错误';
				res.send(404);
			}
			else if (result.admin !== true) {
				req.session.error = '抱歉，您不是管理员';
				res.send(404);
			}
			else {
				req.session.user = result;
				req.session.admin = result.admin;
				res.send(200);
			}
		}
	});
});

/* GET administration page. */
router.route('/administration').get(function (req, res) {
	console.log(req.session.user);
	if (!req.session.user) {
		req.session.error = "请先登录"
		res.redirect("/adminlogin");
	}
	else if (req.session.admin !== true) {
		req.session.error = "抱歉，您不是管理员"
		res.redirect("/adminlogin");
	}

	res.render('administration', { title: '下课铃投稿管理' });
	console.log('-------管理登录-------')
	console.log("登录时间：" + time);
	console.log(req.session.user);
	console.log('---------------------')
});


router.route('/getcontributions').get(function (req, res) {
	var Contribution = global.contributiondb;
	Contribution.find({}, function (err, data) {
		if (err) {
			res.send(500);
			//console.log(err);
		} else {
			//console.log(data);
			//res.send('收到啦！'); //JSON.stringify(data)
			res.json(data);
		}
	})
});

router.route('/submitcheck').post(function (req, res) {

	var _id = req.body.id;
	var contribute_id = req.body.contribute_id;
	var ncmid = req.body.ncmid;
	var realname = req.body.realname;
	var showname = req.body.showname;
	var artist = req.body.artist;
	var type = req.body.type;
	var check_notes = req.body.check_notes;
	var check_user = req.body.check_user;
	var check_time = moment().format('YYYY-MM-DD HH:mm:ss');

	var Contribution = global.contributiondb;
	var User = global.userdb;
	//{'id':id,'contribute_id':contribute_id,'ncmid':ncmid,'realname':realname,'showname':showname,'artist':artist,'type':real_type,'check_notes':check_notes,'check_user':check_user}
	Contribution.update({ _id: _id }, {
		realname: realname,
		showname: showname,
		artist: artist,
		type: type,
		check_notes: check_notes,
		check_user: check_user,
		check_time: check_time,
	}, { multi: true }, function (err, doc) {
		if (err) {
			res.send(500);
			console.log(err);
		} else {
			req.session.error = '';
			params = {
				"_id": _id,
				"contribute-id": contribute_id,
				"ncmid": ncmid,
				"realname": realname,
				"showname": showname,
				"artist": artist,
				"check_user": check_user,
				"type": type,
				"check_notes": check_notes,
				"check_time": check_time,
			}
			console.log('-----收到审核结果-----');
			console.log(params);
			console.log('---------------------');

			Contribution.findOne({ _id: _id }, function (err, docs) {
				if (err) {
					console.log(err);
					res.send(500);
				} else {
					User.findOne({ name: docs.user }, function (err, result) {
						if (err) {
							console.log(err);
							res.send(500);
						} else {
							console.log(docs)
							var val_type
							if (docs.type == "success") {
								val_type = "已录用";
							} else if (docs.type == "fail") {
								val_type = "未录用";
							} else if (docs.type == "waiting") {
								val_type = "待审核";
							}
							re = new RegExp("&amp;", "g")
							var val_check_user = docs.check_user.replace(re, "&")
							var showname_text = ""
							if (docs.type == "fail") {
								showname_text = "";
							} else if (docs.showname == "") {
								showname_text = "\n显示名称：（待定）";
							} else {
								showname_text = "\n显示名称：" + docs.showname;
							}
							var body = docs.user + "，你好！\n    你于" + docs.contribute_time + "投稿的： " + docs.artist + " 的 《" + docs.realname + "》 已于" + docs.check_time + " 时审核完毕！\n以下为 审核/修改后审核 的结果：\n\n审核结果：" + val_type + "\n审核意见：" + docs.check_notes + showname_text + "\n审核人：" + val_check_user + "\n\n感谢你的投稿~"
							let transporter = nodemailer.createTransport({
								service: "163",  //  邮箱
								secure: true,    //  安全的发送模式
								auth: {
									user: "bjezxkl@163.com", //发件人邮箱
									pass: "2020Xiakeling" //授权码
								}
							})
							let mailOptions = {
								from: "bjezxkl@163.com",
								to: result.email,
								subject: "北京二中下课铃投稿结果反馈",
								text: body
							}

							transporter.sendMail(mailOptions, (err, callback) => {
								if (err) {
									console.log(err);
									res.send(500);
								} else {
									console.log(callback);
									res.send(200);
								}
							})
						}
					})
				}
			});
		}
	});
});

router.route('/gethistories').get(function (req, res) {
	var History = global.historydb;
	var NowDate = moment().format('YYYY/M/D');
	History.find({ date: { "$lt": NowDate } }, function (err, data) {
		if (err) {
			res.send(500);
			//console.log(err);
		} else {
			//console.log(data);
			res.json(data);
		}
	})
});


/* GET about page. */
router.get('/about', function (req, res, next) {
	res.render('about');
});

/* GET report page. */
router.get('/report', function (req, res, next) {
	res.render('report');
});

/* GET create page. */
router.get('/create', function (req, res, next) {
	console.log(req.session.user);
	if (!req.session.user) {
		req.session.error = "请先登录"
		res.redirect("/adminlogin");
	}
	else if (req.session.admin !== true) {
		req.session.error = "抱歉，您不是管理员"
		res.redirect("/adminlogin");
	} else {
		res.render('create');
	}
});

router.route('/createtodb').post(function (req, res) {
	var week = req.body.week;
	var date = req.body.date;
	var ncmid = req.body.ncmid;
	var realname = req.body.realname;
	var showname = req.body.showname;
	var artist = req.body.artist;
	var state = req.body.state;
	var user = req.body.user;

	var History = global.historydb;

	History.findOne({ date: date }, function (err, result) {
		if (err) {
			res.send(500);
			console.log(err);
		}
		else if (result) {
			req.session.error = '当天下课铃已存在';
			res.send(500);
		}
		else {
			History.create({
				week: week,
				date: date,
				ncmid: ncmid,
				realname: realname,
				showname: showname,
				artist: artist,
				state: state,
				user: user
			}, function (err, doc) {
				if (err) {
					res.send(500);
					console.log(err);
				}
				else {
					req.session.error = '录入成功';
					res.send(200);
				}
			})
		}
	});
});

router.route('/publish').get(function (req, res) {
	console.log(req.session.user);
	if (!req.session.user) {
		req.session.error = "请先登录"
		res.redirect("/adminlogin");
	}
	else if (req.session.admin !== true) {
		req.session.error = "抱歉，您不是管理员"
		res.redirect("/adminlogin");
	} else {
		res.render('publish');
	}
}).post(function (req, res) {
	var Notice = global.noticedb;
	Notice.create({
		time: req.body.time,
		title: req.body.title,
		user: req.body.user,
		content: req.body.content,

	}, function (err, doc) {
		if (err) {
			res.send(500);
			console.log(err);
		}
		else {
			req.session.error = '发布成功';
			res.send(200);
		}
	})
})

/* GET logout page. */
router.route('/logout').get(function (req, res) {
	req.session.user = null;
	req.session.error = null;
	req.session.admin = null;
	res.redirect("/login");

});

module.exports = router;
