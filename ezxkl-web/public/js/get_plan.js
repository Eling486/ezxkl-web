var now = new Date();
var nowTime = now.getTime();
var day = now.getDay();
var oneDayTime = 24 * 60 * 60 * 1000;

//获得周一到周五时间
var MonTime = nowTime - (day - 1) * oneDayTime;
var TueTime = nowTime - (day - 2) * oneDayTime;
var WedTime = nowTime - (day - 3) * oneDayTime;
var ThuTime = nowTime - (day - 4) * oneDayTime;
var FriTime = nowTime - (day - 5) * oneDayTime;

//格式转换
var day_1 = new Date(MonTime);
var day_2 = new Date(TueTime);
var day_3 = new Date(WedTime);
var day_4 = new Date(ThuTime);
var day_5 = new Date(FriTime);
day_1 = day_1.toLocaleDateString()
day_2 = day_2.toLocaleDateString()
day_3 = day_3.toLocaleDateString()
day_4 = day_4.toLocaleDateString()
day_5 = day_5.toLocaleDateString()

var planinfos = ""
var Mon_plan = ""
var Tues_plan = ""
var Wed_plan = ""
var Thur_plan = ""
var Fri_plan = ""

console.log(day_1);
console.log(day_2);
console.log(day_3);
console.log(day_4);
console.log(day_5);
$('#day-1 .plan-date-wrap').html("<h2><span class='plan-span' id='date'>" + day_1 + "</span></h2>")
$('#day-2 .plan-date-wrap').html("<h2><span class='plan-span' id='date'>" + day_2 + "</span></h2>")
$('#day-3 .plan-date-wrap').html("<h2><span class='plan-span' id='date'>" + day_3 + "</span></h2>")
$('#day-4 .plan-date-wrap').html("<h2><span class='plan-span' id='date'>" + day_4 + "</span></h2>")
$('#day-5 .plan-date-wrap').html("<h2><span class='plan-span' id='date'>" + day_5 + "</span></h2>")
/*
<div class="plan" id="Monday"></div>
<div class="plan" id="Tuesday"></div>
<div class="plan" id="Wednesday"></div>
<div class="plan" id="Thursday"></div>
<div class="plan" id="Friday"></div>
*/
function GetPlan() {
    $.get("/getplan", function (data, err) {
        console.log(data);
        for (var i = 0; i < 5; i++) {
            if (!data[i]) {
                var num = i + 1
                var planinfos = $('#day-' + num + '').html()
                //planinfos += "<h2><span class='plan-span' id='date'>" + day_ + i + 1 + "</span></h2>"
                planinfos += "<div class='plan-error-wrap' style='text-align: center;'><p><span class='plan-span' id='error'>当日暂无下课铃</span></p></div>"
                $('#day-' + num + '').html(planinfos)
            } else {
                var num = i + 1
                var planinfos = $('#day-' + num + '').html()
                //planinfos += "<h2><span class='plan-span' id='date'>" + data[i].date + "</span></h2>"
                planinfos += "<p><label class='plan-label'>显示名称：</label><span class='plan-span' id='showname'>" + data[i].showname + "</span></p>"
                planinfos += "<p><label class='plan-label'>投稿人：</label><span class='plan-span' id='user'>" + data[i].user + "</span></p>"
                $('#day-' + num + '').html(planinfos)
            }
        }
        var height_max = ""
        $("div.plan").each(function () {
            var height = $(this).innerHeight();
            if(height > height_max){
                height_max = height
            } 
        })
        $("div.plan").css('height', height_max);

    })
}
