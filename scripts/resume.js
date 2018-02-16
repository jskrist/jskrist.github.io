$(document).ready(function () {
    if(location.hash != null && location.hash != ""){
      if($(location.hash).find(".collapse").attr("class").match("show") === null) {
        $(location.hash).find(".btn").click()
      }
    }
});

var q = $(".btn[data-toggle='collapse']");
var re = /top\.svg$/;
q.each(function(index) {
    $(this).on("click", function() {
      if($(this).children("img").length > 0) {
        var src = $(this).children("img").attr("src");
        match = src.match(re);
    		if(match) {
          $(this).children("img").attr("src", src.replace(re, "bottom.svg"));
        }
    		else {
          $(this).children("img").attr("src", src.replace(/bottom\.svg$/, "top.svg"));
        }
      }
    });
});
