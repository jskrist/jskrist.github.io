window.onload = updateButtonWidth;
window.onresize = updateButtonWidth;
function updateButtonWidth(){

  var buttons = $("button");
  for( var btnIdx = 0; btnIdx < buttons.length; btnIdx++ ) {
    [w, h] = getImageSize("#"+buttons[btnIdx].id)
    buttons[btnIdx].style.height = buttons[btnIdx].offsetWidth * h/w + "px";
    buttons[btnIdx].style.borderRadius = buttons[btnIdx].offsetWidth * 0.1 + "px";
  }
}

function getImageSize(selector) {

  var backgroundIm = $(selector).css("background-image");
  var imSrc = backgroundIm.replace(/^url\(\"?|\"?\)$/g, "");

  var image = new Image();
  image.src = imSrc;
  var w = image.width,
      h = image.height;

  return [w, h];

}
