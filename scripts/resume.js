var q = $(".btn[data-toggle='collapse']");
q.each(function(index) {
    $(this).on("click", function() {
      var re = /top\.svg$/;
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
