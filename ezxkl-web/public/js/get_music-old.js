String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

function GetMusic() {
    $.ajax({
        url: "/xmls/music_data.xml",
        dataType: 'xml',
        type: 'GET',
        timeout: 2000,
        error: function(xml) {
            alert("加载XML 文件出错！请刷新重试.");
        },
        success: function(xml) {
			var infos = "";
			var state;
			var date;
			var showname;
			var realname;
			var artist;
            $(xml).find("music").each(function(i) {
				state = $(this).attr('state')
				id = $('id',this).text();
				date = $('date',this).text();
                showname = $('showname',this).text();
                realname = $('realname',this).text();
                artist = $('artist',this).text();
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
}