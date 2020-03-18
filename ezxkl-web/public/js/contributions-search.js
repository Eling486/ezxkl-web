jQuery.expr[':'].Contains = function (a, i, m) {
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
function filterList(list) {
    $('#contributions').bind('input propertychange',
        function () {
            $("input#type-sift[name='sift-waiting']").prop("checked", false)
            $("input#type-sift[name='sift-success']").prop("checked", false)
            $("input#type-sift[name='sift-fail']").prop("checked", false)
            var filter = $(this).val();
            if (filter) {
                $matches = $(list).find('td:Contains(' + filter + ')').parent();
                $('tr', list).not($matches).slideUp();
                $matches.slideDown();
            } else {
                var waiting = $("input#type-sift[name='sift-waiting']").is(':checked');
                var success = $("input#type-sift[name='sift-success']").is(':checked');
                var fail = $("input#type-sift[name='sift-fail']").is(':checked');
                if (waiting == true && success == false && fail == false) {
                    $matches = $(list).find('td:Contains("待审核")').parent();
                    $('tr', list).not($matches).slideUp();
                    $matches.slideDown();
                } else if (waiting == false && success == true && fail == false) {
                    $matches = $(list).find('td:Contains("已录用")').parent();
                    $('tr', list).not($matches).slideUp();
                    $matches.slideDown();
                } else if (waiting == false && success == false && fail == true) {
                    $matches = $(list).find('td:Contains("未录用")').parent();
                    $('tr', list).not($matches).slideUp();
                    $matches.slideDown();
                } else if (waiting == true && success == true && fail == false) {
                    $matches = $(list).find('td:Contains("待审核"),td:Contains("已录用")').parent();
                    $('tr', list).not($matches).slideUp();
                    $matches.slideDown();
                } else if (waiting == false && success == true && fail == true) {
                    $matches = $(list).find('td:Contains("已录用"),td:Contains("未录用")').parent();
                    $('tr', list).not($matches).slideUp();
                    $matches.slideDown();
                } else if (waiting == true && success == false && fail == true) {
                    $matches = $(list).find('td:Contains("待审核"),td:Contains("未录用")').parent();
                    $('tr', list).not($matches).slideUp();
                    $matches.slideDown();
                } else if (waiting == true && success == true && fail == true || waiting == false && success == false && fail == false) {
                    $('tr', list).slideDown();
                };
            }
        });
}

$(function () {
    //GetCheckbox();
    filterList($("#contributions-table"));
    SiftList($("#contributions-table"));
    //$("input#type-sift[name='sift-waiting']").prop("checked", true);

})

function GetCheckbox() {

    var success = $("input#type-sift[name='sift-success']").is(':checked');
    var waiting = $("input#type-sift[name='sift-waiting']").is(':checked');
    var fail = $("input#type-sift[name='sift-fail']").is(':checked');
    console.log("待审核：" + waiting + "\n已录用：" + success + "\n未录用：" + fail)
    $("input#type-sift").on('change', function () {
        var waiting = $("input#type-sift[name='sift-waiting']").is(':checked');
        var success = $("input#type-sift[name='sift-success']").is(':checked');
        var fail = $("input#type-sift[name='sift-fail']").is(':checked');
        console.log("待审核：" + waiting + "\n已录用：" + success + "\n未录用：" + fail)
    });
}
function SiftList(list) {
    var waiting = $("input#type-sift[name='sift-waiting']").is(':checked');
    var success = $("input#type-sift[name='sift-success']").is(':checked');
    var fail = $("input#type-sift[name='sift-fail']").is(':checked');
    if (waiting == true && success == false && fail == false) {
        $matches = $(list).find('td:Contains("待审核")').parent();
        $('tr', list).not($matches).slideUp();
        $matches.slideDown();
    } else if (waiting == false && success == true && fail == false) {
        $matches = $(list).find('td:Contains("已录用")').parent();
        $('tr', list).not($matches).slideUp();
        $matches.slideDown();
    } else if (waiting == false && success == false && fail == true) {
        $matches = $(list).find('td:Contains("未录用")').parent();
        $('tr', list).not($matches).slideUp();
        $matches.slideDown();
    } else if (waiting == true && success == true && fail == false) {
        $matches = $(list).find('td:Contains("待审核"),td:Contains("已录用")').parent();
        $('tr', list).not($matches).slideUp();
        $matches.slideDown();
    } else if (waiting == false && success == true && fail == true) {
        $matches = $(list).find('td:Contains("已录用"),td:Contains("未录用")').parent();
        $('tr', list).not($matches).slideUp();
        $matches.slideDown();
    } else if (waiting == true && success == false && fail == true) {
        $matches = $(list).find('td:Contains("待审核"),td:Contains("未录用")').parent();
        $('tr', list).not($matches).slideUp();
        $matches.slideDown();
    } else if (waiting == true && success == true && fail == true || waiting == false && success == false && fail == false) {
        $('tr', list).slideDown();
    };

    $("input#type-sift").on('change', function () {
        $('#contributions').val("")
        var waiting = $("input#type-sift[name='sift-waiting']").is(':checked');
        var success = $("input#type-sift[name='sift-success']").is(':checked');
        var fail = $("input#type-sift[name='sift-fail']").is(':checked');
        if (waiting == true && success == false && fail == false) {
            $matches = $(list).find('td:Contains("待审核")').parent();
            $('tr', list).not($matches).slideUp();
            $matches.slideDown();
        } else if (waiting == false && success == true && fail == false) {
            $matches = $(list).find('td:Contains("已录用")').parent();
            $('tr', list).not($matches).slideUp();
            $matches.slideDown();
        } else if (waiting == false && success == false && fail == true) {
            $matches = $(list).find('td:Contains("未录用")').parent();
            $('tr', list).not($matches).slideUp();
            $matches.slideDown();
        } else if (waiting == true && success == true && fail == false) {
            $matches = $(list).find('td:Contains("待审核"),td:Contains("已录用")').parent();
            $('tr', list).not($matches).slideUp();
            $matches.slideDown();
        } else if (waiting == false && success == true && fail == true) {
            $matches = $(list).find('td:Contains("已录用"),td:Contains("未录用")').parent();
            $('tr', list).not($matches).slideUp();
            $matches.slideDown();
        } else if (waiting == true && success == false && fail == true) {
            $matches = $(list).find('td:Contains("待审核"),td:Contains("未录用")').parent();
            $('tr', list).not($matches).slideUp();
            $matches.slideDown();
        } else if (waiting == true && success == true && fail == true || waiting == false && success == false && fail == false) {
            $('tr', list).slideDown();
        };
    });
};
