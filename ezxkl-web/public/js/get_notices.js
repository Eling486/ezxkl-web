var notices = ""
var data = ""
var data = [];
function GetNotices(){
$.ajax({
    url: "/getnotices",
    error: function (err) {
        console.log(err);
    },
    success: function (result) {
        
        var rows = result;
		rows.sort(function (a, b) {
			return Date.parse(b.time) - Date.parse(a.time);//时间正序
		});
        data = rows;
        console.log(result)
        for (var i = 0; i < data.length; i++) {
            var date = ""
            date = data[i].time.split(' ')[0];
            notices += "<div class='notice-wrap' id='notice-wrap-" + data[i]._id + "'>"
			notices += "<span class='notice-datetag' id='notice-datetag-" + data[i]._id + "'>" + date + "</span>"
			notices += "<div class='notice-title' id='notice-title-" + data[i]._id + "'><h2>" + data[i].title + "</h2></div>"
            notices += "<div class='notice-contnent' id='notice-contnent-" + data[i]._id + "'>" + data[i].content + "</div>"
            notices += "<div class='notice-time' id='notice-user-" + data[i]._id + "' style='text-align: right'>发布时间：" + data[i].time + "</div>"
			notices += "<div class='notice-user' id='notice-user-" + data[i]._id + "' style='text-align: right'>发布者：" + data[i].user + "</div></div>"
            console.log(date)
            $('.notices-wrap').html(notices)
        }
    }, 
});
};