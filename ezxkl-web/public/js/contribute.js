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
$('#contribution_submit').click(function(){SubmitContribution()});

function GetMusicInfo(){
	$('#error-wrap').html('<div style="color:green;"></div>');
	url = $('#ncmid').val();
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
		$("input#notes").val("");
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
							musicinfo += "<div class='musicinfo'><p class='id'>投稿id：<span class='contribution-span' id='ncmid'>" + id + "</span></p><p class='realname'>所投曲名：<span class='contribution-span' id='realname'>" + realname + "</span></p><p class='artist'>音乐人：<span class='contribution-span' id='artist'>" + artist + "</span></p><p class='state'>版权状态：<span class='contribution-span' id='state'>" + state + "</span></p></div>"
							$('.musicinfo-wrap').html(musicinfo)
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
							musicinfo += "<div class='musicinfo'><p class='id'>投稿id：<span class='contribution-span' id='ncmid'>" + id + "</span></p><p class='realname'>所投曲名：<span class='contribution-span' id='realname'>" + realname + "</span></p><p class='artist'>音乐人：<span class='contribution-span' id='artist'>" + artist + "</span></p><p class='state'>版权状态：<span class='contribution-span' id='state'>" + state + "</span></p></div>"
							$('.musicinfo-wrap').html(musicinfo)
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

	
function SubmitContribution(){
	var user = $('span#contribute-user').text();
	var ncmid = $('span#ncmid').text();
	var realname = $('span#realname').text();
	var artist = $('span#artist').text();
	var notes =  $('input#notes').val();
	var state =  $('span#state').text();
	var data={'user':user,'ncmid':ncmid,'realname':realname,'artist':artist,'notes':notes,'state':state};
	console.log(data);
	$.ajax({
		url:'/contribution',
		type:'post',
		data:data,
		success:function(data,status){
		  if(status=='success'){
			$('#error-wrap').html('<div style="color:green;">投稿成功</div>');
			alert("投稿成功！请注意查看邮箱以获得审核结果")
			ap.list.hide()
			ap.list.clear()
			$('#get-musicinfo-wrap')[0].style.display = 'none';
			$("input#ncmid").val("");
			$("input#notes").val("");
		  }
		},
		error:function(data,err){
		  console.log('ajax fail');
		  $('#error-wrap').html('<div style="color:red;">投稿失败，刷新下再试试吧（也有可能是重复投稿了呦）</div>');
		}
	})
};