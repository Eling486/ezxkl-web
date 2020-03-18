String.prototype.replaceAll = function (s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

//原读取xml文件方法
/*function GetMusic() {
	$.ajax({
		url: "/xmls/music_data.xml",
		dataType: 'xml',
		type: 'GET',
		timeout: 2000,
		error: function (xml) {
			alert("加载XML 文件出错！请刷新重试.");
		},
		success: function (xml) {
			var infos = "";
			var state;
			var date;
			var showname;
			var realname;
			var artist;
			$(xml).find("music").each(function (i) {
				state = $(this).attr('state')
				id = $('id', this).text();
				date = $('date', this).text();
				showname = $('showname', this).text();
				realname = $('realname', this).text();
				artist = $('artist', this).text();
				infos += "<tr class='row-" + date + "' title='点击加入播放列表'><td class='date'>" + date + "</td>"
				infos += "<td class='state' style='display:none;'>" + state + "</td>"
				infos += "<td class='id' style='display:none;'>" + id + "</td>"
				infos += "<td class='showname'>" + showname + "</td>"
				infos += "<td class='realname'>" + realname + "</td>"
				infos += "<td class='artist'>" + artist + "</td>"
				infos += "</tr>"
			});
			if (infos == "") {
				infos = "<div class='get-music-error'>无法获取下课铃列表！</div>"
			}
			infos = infos.replaceAll("%t", "<br />");
			$(".music-table").html(infos);
			$(".search-input").val("");
		}
	});
}*/

function GetMusic() {
	$.get("/gethistories", function (data, err) {
		//console.log(data)
		var musicinfos = ""
		
		var rows = data;
		rows.sort(function (a, b) {
			return Date.parse(a.date) - Date.parse(b.date);//时间正序
		});
		data = rows;

		for (var i = 0; i < data.length; i++) {
			musicinfos += "<tr class='row-" + data[i]._id + "' title='点击加入播放列表'>";
			musicinfos += "<td class='id' style='display: none;'>" + data[i]._id + "</td>"
			musicinfos += "<td class='week' style='display: none;'>" + data[i].week + "</td>"
			musicinfos += "<td class='date' id='search-obj'>" + data[i].date + "</td>"
			musicinfos += "<td class='ncmid' style='display: none;'>" + data[i].ncmid + "</td>"
			musicinfos += "<td class='realname' id='search-obj'>" + data[i].realname + "</td>"
			musicinfos += "<td class='showname' id='search-obj'>" + data[i].showname + "</td>"
			musicinfos += "<td class='artist' id='search-obj'>" + data[i].artist + "</td>"
			musicinfos += "<td class='state' style='display: none;'>" + data[i].state + "</td>"
			musicinfos += "<td class='user' style='display: none;'>" + data[i].user + "</td>"
			musicinfos += "</tr>"
		}

		if (musicinfos == "") {
			musicinfos = "<div class='get-music-error'>无法获取下课铃列表！</div>"
		}
		musicinfos = musicinfos.replaceAll("%t", "<br />");
		$(".music-table").html(musicinfos);
		$(".search-input").val("");
	})
}