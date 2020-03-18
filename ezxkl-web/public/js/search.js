jQuery.expr[':'].Contains = function(a, i, m) {
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
function filterList(list) {
    $('#search-input').bind('input propertychange',
    function() {
        var filter = $(this).val();
        if (filter) {
            $matches = $(list).find('td#search-obj:Contains(' + filter + ')').parent();
            $('tr', list).not($matches).slideUp();
            $matches.slideDown();
        } else {
            $(list).find("tr").slideDown();
        }
    });
}

$(function() {
    filterList($("#music-table"));
})