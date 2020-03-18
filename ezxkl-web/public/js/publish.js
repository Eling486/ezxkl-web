var content = ""

Date.prototype.Format = function (fmt) {  
    var o = {  
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "H+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };  
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o)  
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
    return fmt;  
} 

$(function(){
	$(document).keydown(function(event){
		if(event.keyCode==13){
			Preview();
		}
	});
});
$("#get-nowtime").click(function(){GetNowtime()});
$("#preview").click(function(){Preview()});
$('#publish-notice').click(function(){Publish()});

function GetNowtime(){
	var Nowtime = new Date().Format("yyyy-MM-dd HH:mm:ss");
	$('input#time').val(Nowtime);
}

function Preview(){
	content = marked($('#text-md').val())
	console.log(content)
	$('#notice-preview').html(content)
	$('#notice-preview-wrap')[0].style.display = 'inline'
}
	
function Publish(){
	var time = $('input#time').val();
	var user = $('input#user').val();
	var title = $('input#title').val();
	var content = marked($('#text-md').val())
	var data={'time':time,'user':user,'title':title,'content':content};
	console.log(data);
	var confirminfos = "是否确定发布该公告？"
            if (confirm(confirminfos) == true) {
	$.ajax({
		url:'/publish',
		type:'post',
		data:data,
		success:function(data,status){
		  if(status=='success'){
			$('#error-wrap').html('<div style="color:green;">录入成功</div>');
			alert("发布成功！")
			$('#notice-preview-wrap')[0].style.display = 'none';
			$("#notice-preview").html("");
			$('input#time').val("");
			$("input#user").val("");
			$("input#title").val("");
			$("#text-md").val("");
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