var initialtype = ""
var check_notes_before = ""

$('input.btn-refresh').click(function () { GetContributions() });
$('button#check-submit').click(function () { SubmitCheck() });

function GetContributions() {
    $.get("/getcontributions", function (data, err) {
        //console.log(data)
        var contributioninfos = ""
        for (var i = 0; i < data.length; i++) {
            contributioninfos += "<tr class='row-" + data[i].contribute_id + "'>";
            contributioninfos += "<td class='check-notes' style='display: none;'>" + data[i]._id + "</td>"
            contributioninfos += "<td class='contribute-id'>" + data[i].contribute_id + "</td>"
            contributioninfos += "<td class='time'>" + data[i].contribute_time + "</td>"
            contributioninfos += "<td class='ncmid' style='display: none;'>" + data[i].ncmid + "</td>"
            contributioninfos += "<td class='realname'>" + data[i].realname + "</td>"
            contributioninfos += "<td class='showname'  style='display: none;'>" + data[i].showname + "</td>"
            contributioninfos += "<td class='artist' style='display: none;'>" + data[i].artist + "</td>"
            contributioninfos += "<td class='state' style='display: none;'>" + data[i].state + "</td>"
            contributioninfos += "<td class='user'>" + data[i].user + "</td>"
            contributioninfos += "<td class='notes'>" + data[i].notes + "</td>"
            contributioninfos += data[i].type
            contributioninfos += "<td class='check-user' style='display: none;'>" + data[i].check_user + "</td>"
            contributioninfos += "<td class='check-time' style='display: none;'>" + data[i].check_time + "</td>"
            contributioninfos += "<td class='check-notes' style='display: none;'>" + data[i].check_notes + "</td>"
            contributioninfos += "</tr>"
        }
        if (contributioninfos == "") {
            contributioninfos = "<div class='get-music-error'>无法获取投稿列表！</div>"
        }
        re1 = new RegExp("%t", "g")
        re2 = new RegExp("undefined", "g")
        re3 = new RegExp("waiting", "g")
        re4 = new RegExp("success", "g")
        re5 = new RegExp("fail", "g")
        contributioninfos = contributioninfos.replace(re1, "<br />");
        contributioninfos = contributioninfos.replace(re2, "");
        contributioninfos = contributioninfos.replace(re3, "<td class='type' style='color:dimgray;'>待审核</td>");
        contributioninfos = contributioninfos.replace(re4, "<td class='type' style='color:green;'>已录用</td>");
        contributioninfos = contributioninfos.replace(re5, "<td class='type' style='color:red;'>未录用</td>");
        $(".contributions-table").html(contributioninfos);
        $(".search-input").val("");
    })
}

$('#contributions-table').on('click', 'td', function () {
    var detailurl = ""
    var detail = ""
    var id = $(this).parent().children("td").eq(0).text();
    GetContributions()
    var contribute_id = $(this).parent().children("td").eq(1).text();
    var contribute_time = $(this).parent().children("td").eq(2).text();
    var user = $(this).parent().children("td").eq(8).text();
    var ncmid = $(this).parent().children("td").eq(3).text();
    var realname = $(this).parent().children("td").eq(4).text();
    var showname = $(this).parent().children("td").eq(5).text();
    var artist = $(this).parent().children("td").eq(6).text();
    var state = $(this).parent().children("td").eq(7).text();
    var notes = $(this).parent().children("td").eq(9).text();
    var type = $(this).parent().children("td").eq(10).text();
    var check_user = $(this).parent().children("td").eq(11).text();
    var check_time = $(this).parent().children("td").eq(12).text();
    check_notes_before = $(this).parent().children("td").eq(13).text();
    initialtype = type
    initialshowname = showname


    detailurl = "https://api.imjad.cn/cloudmusic/?type=detail&id=" + ncmid
    $.getJSON({
        url: detailurl,
        timeout: 2000,
        error: function (data) {
            alert("获取歌曲封面(json)出错！请刷新重试.");
        },
        success: function (data) {
            console.log(data);
            picurl = data.songs["0"].al["picUrl"];
            if (state == "ok") {
                ap.list.hide()
                ap.list.clear()
                ap.list.add([{
                    name: realname,
                    artist: artist,
                    url: "https://music.163.com/song/media/outer/url?id=" + ncmid + ".mp3",
                    cover: picurl,
                    /*theme: '#ebd0c2'*/
                }]);
                //console.log(picurl)
                ap.list.hide()
                ap.play()
            } else {
                ap.list.hide()
                ap.list.clear()
                ap.list.add([{
                    name: realname + "(该投稿曲目无版权)",
                    artist: artist,
                    url: "",
                    cover: picurl,
                    /*theme: '#ebd0c2'*/
                }]);
                ap.list.hide()
            }
        }
    });
    $("span#id").html(id)
    $("span#contribute-id").html(contribute_id)
    $("span#contribute-time").html(contribute_time)
    $("span#user").html(user)
    $("span#ncmid").html(ncmid)
    $("input#realname").val(realname)
    $("input#showname").val(showname)
    $("input#artist").val(artist)
    $("span#state").html(state)
    $("span#notes").html(notes)
    $("select#typelist").val(type);
    $("span#check-time").html(check_time)
    $("span#check-notes-before").html(check_notes_before)
    $("span#check-user").html(check_user)
    if (check_user !== "") {
        $("input#check-submit").val("修改审核结果")
    } else {
        $("input#check-submit").val("提交审核结果")
    }
});

function SubmitCheck() {
    var id = $("span#id").html()
    var contribute_id = $("span#contribute-id").html()
    var contribute_time = $("span#contribute-time").html()
    var user = $("span#user").html()
    var ncmid = $("span#ncmid").html()
    var realname = $("input#realname").val()
    var showname = $("input#showname").val()
    var artist = $("input#artist").val()
    var state = $("span#state").html()
    var notes = $("span#notes").html()
    var type = $("select#typelist").val();
    var check_time = $("span#check-time").html()
    var check_notes_after = $("input#check-notes").val()
    var check_user = $("span#check-user").html()

    if (check_user !== "") {
        check_user = $("span#check-user").html() + " & " + $("span.span-check-user").html();
    } else {
        check_user = $("span.span-check-user").html();
    }
    if (id == "") {
        alert("请先选择稿件")
    } else if (type == initialtype) {
        if (showname == initialshowname) {
            alert("请修改显示名称");
        } else {
            re = new RegExp("&amp;", "g")
            var val_check_user = check_user.replace(re, "&");
            var check_notes_all = check_notes_before + " " + $("span.span-check-user").html() + "：" + check_notes_after
            var confirminfos = "审核后信息为：\n投稿id：" + contribute_id + "\n投稿时间：" + contribute_time + "\n投稿人：" + user + "\n网易云id：" + ncmid + "\n实际名称：" + realname + "\n显示名称：" + showname + "\n音乐人：" + artist + "\n版权状态：" + state + "\n投稿备注：" + notes + "\n审核状态：" + type + "\n审核意见：" + check_notes_all + "\n审核人：" + val_check_user + "\n " + "\n确定提交审核结果？（请确认信息是否正确）"
            if (confirm(confirminfos) == true) {
                var real_type
                real_type = type.replace("待审核", "waiting");
                real_type = real_type.replace("已录用", "success");
                real_type = real_type.replace("未录用", "fail");
                var data = { 'id': id, 'contribute_id': contribute_id, 'ncmid': ncmid, 'realname': realname, 'showname': showname, 'artist': artist, 'type': real_type, 'check_notes': check_notes_all, 'check_user': val_check_user };
                $.ajax({
                    url: '/submitcheck',
                    type: 'post',
                    data: data,
                    success: function (data, status) {
                        if (status == 'success') {
                            console.log(data);
                            alert("审核结果提交成功");
                            location.href = 'administration';
                        }
                    },
                    error: function (data, err) {
                        console.log('ajax fail');
                        alert("审核结果提交失败，请重试");
                    }
                });
            }
        }
    } else {
        re = new RegExp("&amp;", "g")
        var val_check_user = check_user.replace(re, "&");
        var check_notes_all = check_notes_before + " " + $("span.span-check-user").html() + "：" + check_notes_after
        var confirminfos = "审核后信息为：\n投稿id：" + contribute_id + "\n投稿时间：" + contribute_time + "\n投稿人：" + user + "\n网易云id：" + ncmid + "\n实际名称：" + realname + "\n显示名称：" + showname + "\n音乐人：" + artist + "\n版权状态：" + state + "\n投稿备注：" + notes + "\n审核状态：" + type + "\n审核意见：" + check_notes_all + "\n审核人：" + val_check_user + "\n " + "\n确定提交审核结果？（请确认信息是否正确）"
        if (confirm(confirminfos) == true) {
            var real_type
            real_type = type.replace("待审核", "waiting");
            real_type = real_type.replace("已录用", "success");
            real_type = real_type.replace("未录用", "fail");
            var data = { 'id': id, 'contribute_id': contribute_id, 'ncmid': ncmid, 'realname': realname, 'showname': showname, 'artist': artist, 'type': real_type, 'check_notes': check_notes_all, 'check_user': val_check_user };
            $.ajax({
                url: '/submitcheck',
                type: 'post',
                data: data,
                success: function (data, status) {
                    if (status == 'success') {
                        console.log(data);
                        alert("审核结果提交成功");
                        location.href = 'administration';
                    }
                },
                error: function (data, err) {
                    console.log('ajax fail');
                    alert("审核结果提交失败，请重试");
                }
            });
        } else {

        }
    }
};