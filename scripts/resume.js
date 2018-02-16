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

// var src = $(this).children("img").attr("src");
// var shown = $($(this).attr("data-target")).attr("class").match("show");
// if(shown) {
//   $(this).children("img").attr("src", src.replace(/top\.svg$/, "bottom.svg"));
// }
// else {
//   $(this).children("img").attr("src", src.replace(/bottom\.svg$/, "top.svg"));
// }
