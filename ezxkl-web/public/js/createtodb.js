var id = "";
var realname = "";
var artist = "";
var picurl = "";
var state = "";
var musicinfo = "";
var url = "";



$(function(){
	$(document).keydown(function(event){
		if(event.keyCode==13){
			GetMusicInfo();
		}
	});

});

$("#ncmid_submit").click(function(){GetMusicInfo()});
$('#contribution_submit').click(function(){CreatToDB()});

function GetMusicInfo(){
	$('#error-wrap').html('<div style="color:green;"></div>');
	url = $('input#ncmid').val();
	var ncmurl = new RegExp("://music.163.com/");
	//var existid = ncmurl.test(url);
	//console.log(existid);
	if(ncmurl.test(url)){
		if(url.indexOf("?id=")>=0){
			//e.g.//http://music.163.com/song?id=480355041&userid=333267690
		id = url.split("?id=")[1]
		id = id.split("&")[0]
		}else if(url.indexOf("/song/")>=0){
			//e.g.//http://music.163.com/song/1362857147/?userid=259800353
		id = url.split("/song/")[1]
		id = id.split("/")[0]
		}else{
		$('#error-wrap').html('<div style="color:red;">链接格式可能有误 推荐直接从电脑端获取重试</div>');
		};
		detailurl = "https://api.imjad.cn/cloudmusic/?type=detail&id=" + id
		musicurl = "https://api.imjad.cn/cloudmusic/?type=song&id=" + id
		$.getJSON({
			url: detailurl,
			timeout: 2000,
			error: function(data) {
			alert("获取歌曲信息(json)出错！请刷新重试.");
			},
			success: function(data) {
				var musicinfo = ""
				console.log(data);
				realname = data.songs["0"].name;
				//artist = data.songs["0"].ar["0"].name;
				picurl = data.songs["0"].al["picUrl"];
				artist = "";
				for (var i=0;i<data.songs["0"].ar.length;i++)
					{
						artist += data.songs["0"].ar[i].name + "/"
					}
					//if(artist.substr(artist.length-1,1)=="/"){
						artist = artist.substr(0,artist.length-1);
					//}
				$.getJSON({
					url: musicurl,
					timeout: 2000,
					error: function(data) {
					alert("获取歌曲信息(state-json)出错！请刷新重试.");
					},
					success: function(data) {
						console.log(data);
						if(data.data["0"].url!==""){
							state = "ok"
							//$('input#week').val("")
							//$('input#date').val("")
							$('span#ncmid').html(id)
							$('input#realname').val(realname)
							$('input#showname').val("")
							$('input#artist').val(artist)
							$('span#state').html(state)
							$('input#user').val("")
							$('#get-musicinfo-wrap')[0].style.display = 'inline';
							ap.list.hide()
							ap.list.clear()
							ap.list.add([{
								name: realname,
								artist: artist,
								url: "https://music.163.com/song/media/outer/url?id=" + id + ".mp3",
								cover: picurl,
							}]);
							ap.list.hide()
						}else{
							state = "error"
							//$('input#week').val("")
							//$('input#date').val("")
							$('span#ncmid').html(id)
							$('input#realname').val(realname)
							$('input#showname').val("")
							$('input#artist').val(artist)
							$('span#state').html(state)
							$('input#user').val("")
							$('#get-musicinfo-wrap')[0].style.display = 'inline';
							ap.list.hide()
							ap.list.clear()
							ap.list.add([{
								name: realname + "(由于版权原因无法播放)",
								artist: artist,
								//url: "",
								cover: picurl,
							}]);
							ap.list.hide()
						}
					}
				});
			}
		});

	}else{
		$('#error-wrap').html('<div style="color:red;">请输入正确链接</div>');
	}
};

	
function CreatToDB(){
	var week = $('input#week').val();
	var date = $('input#date').val();
	var ncmid = $('span#ncmid').text();
	var realname = $('input#realname').val();
	var showname = $('input#showname').val();
	var artist = $('input#artist').val();
	var state =  $('span#state').text();
	var user = $('input#user').val();
	var data={'week':week,'date':date,'ncmid':ncmid,'realname':realname,'showname':showname,'artist':artist,'state':state,'user':user,};
	console.log(data);
	var confirminfos = "要录入的信息为：\n播放周：" + week + "\n播放日期：" + date + "\n网易云id：" + ncmid + "\n实际名称：" + realname + "\n显示名称：" + showname + "\n音乐人：" + artist + "\n版权状态：" + state + "\n投稿人：" + user + "\n " + "\n确定提交？（请确认信息是否正确）"
            if (confirm(confirminfos) == true) {
	$.ajax({
		url:'/createtodb',
		type:'post',
		data:data,
		success:function(data,status){
		  if(status=='success'){
			$('#error-wrap').html('<div style="color:green;">录入成功</div>');
			alert("录入成功！")
			ap.list.hide()
			ap.list.clear()
			$('#get-musicinfo-wrap')[0].style.display = 'none';
			$(".musicinfo-wrap span").html("");
			//$(".musicinfo-wrap input").val("");
			$("input#ncmid").val("");
			$("input#realname").val("");
			$("input#showname").val("");
			$("input#artist").val("");
			$("input#user").val("");

		  }
		},
		error:function(data,err){
		  console.log('ajax fail');
		  $('#error-wrap').html('<div style="color:red;">录入失败，请刷新重试</div>');
		}
	})
	}else{

	}
};