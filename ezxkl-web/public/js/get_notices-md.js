var notices = ""
var data = [];
var notice = document.getElementById('notice-wrap');
function GetNotices(){
$.ajax({
    url: "/getnotices", success: function (result) {
        console.log(result)
        data = result
        return dataArray.sort(function(a,b) {
            return Date.parse(b.date.replace(/-/g,"/"))-Date.parse(a.date.replace(/-/g,"/"));
        });    
        //notice.innerHTML = JSON.parse(result).body;
        for (var i = 0; i < result.length; i++) {
            notice.innerHTML += JSON.parse(data[i]).body;
        }
    }, error: function (err) {
        console.log(err);
        notice.innerHTML = '';
    }
});
};