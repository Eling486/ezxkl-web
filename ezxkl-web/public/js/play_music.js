

//原读取xml文件对应方法
/*$('#music-table').on('click','td', function() {
	var detailurl = ""
	var detail = ""
	var picurl
	var state = $(this).parent().children("td").eq(1).text()
	var id = $(this).parent().children("td").eq(2).text()
	var realname = $(this).parent().children("td").eq(4).text()
	var artist = $(this).parent().children("td").eq(5).text()
	console.log(id)
	detailurl = "https://api.imjad.cn/cloudmusic/?type=detail&id=" + id
	$.getJSON({
		url: detailurl,
		timeout: 2000,
		error: function(data) {
        alert("获取歌曲封面(json)出错！请刷新重试.");
        },
        success: function(data) {
			console.log(data);
			picurl = data.songs["0"].al["picUrl"];
				if (state=="ok"){
					ap.list.add([{
						name: realname,
						artist: artist,
						url: "https://music.163.com/song/media/outer/url?id=" + id + ".mp3",
						cover: picurl,
						theme: '#ebd0c2'
					}]);
					console.log(picurl)
					ap.play()
				}else{
					ap.list.add([{
						name: realname,
						artist: artist,
						url: "/mp3/" + realname + ".mp3",
						cover: picurl,
						theme: '#ebd0c2'
					}]);
					ap.play()
				}
		}
	});
});*/


$('#music-table').on('click', 'td', function () {
	var detailurl = ""
	var picurl
	var state = $(this).parent().children("td").eq(7).text()
	var id = $(this).parent().children("td").eq(3).text()
	var realname = $(this).parent().children("td").eq(4).text()
	var artist = $(this).parent().children("td").eq(6).text()
	console.log(id)
	detailurl = "https://api.imjad.cn/cloudmusic/?type=detail&id=" + id
	$.getJSON({
		url: detailurl,
		timeout: 2000,
		error: function (data) {
			alert("获取歌曲封面(json)出错！请刷新重试.");
		},
		success: function (data) {
			console.log(data);
			picurl = data.songs["0"].al["picUrl"];
			var list = ap.list
			console.log(list)
			var have = false
			var musicnum = 0
			if (!list.audios['0']) {
				musicnum = 1
				if (state == "ok") {
					console.log(list)
					ap.list.add([{
						name: realname,
						artist: artist,
						url: "https://music.163.com/song/media/outer/url?id=" + id + ".mp3",
						cover: picurl,
						/*theme: '#ebd0c2'*/
					}]);
					ap.list.switch(musicnum)
					ap.play()
				} else {
					ap.list.add([{
						name: realname,
						artist: artist,
						url: "/mp3/" + realname + ".mp3",
						cover: picurl,
						/*theme: '#ebd0c2'*/
					}]);
					ap.list.switch(musicnum)
					ap.play()
				}
			} else {
				for (var i = 0; i < list.audios.length; i++) {
					if (list.audios[i].name == realname) {
						have = true
						musicnum = i
						break;
					} else {
						have = false
						musicnum = i + 1
					}
				}
				if (have == false) {
					if (state == "ok") {
						ap.list.add([{
							name: realname,
							artist: artist,
							url: "https://music.163.com/song/media/outer/url?id=" + id + ".mp3",
							cover: picurl,
							/*theme: '#ebd0c2'*/
						}]);
						console.log(picurl)
						console.log(list)
						ap.list.switch(musicnum)
						ap.play()


					} else {

						ap.list.add([{
							name: realname,
							artist: artist,
							url: "/mp3/" + realname + ".mp3",
							cover: picurl,
							/*theme: '#ebd0c2'*/
						}]);
						ap.list.switch(musicnum)
						ap.play()
					}
				} else {
					ap.list.switch(musicnum)
					ap.play()
				}
			}
		}
	});
});