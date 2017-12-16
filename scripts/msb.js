window.onload = updateButtonWidth;
window.onresize = updateButtonWidth;
function updateButtonWidth(){

  alert("Debug seesion " + 7)
  var buttons = $("button");
  for( var btnIdx = 0; btnIdx < buttons.length; btnIdx++ ) {
    [w, h] = getImageSize("#"+buttons[btnIdx].id)
    buttons[btnIdx].style.height = buttons[btnIdx].offsetWidth * h/w + "px";
    buttons[btnIdx].style.borderRadius = buttons[btnIdx].offsetWidth * 0.1 + "px";
    buttons[btnIdx].onclick = function(){playAudio(this.id)};
    // buttons[btnIdx].onmouseover = function(){playAudio(this.id)};
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

var audio = null;
function playAudio(selector) {

  if(audio && audio.length > 0) {
    audio[0].pause();
    audio[0].currentTime = 0
  }
  audio = $("button[id=\"" + selector + "\"]>audio");
  // if(!audio || audio.length == 0) {
  //   return;
  // }
  //
  // audioSrc = $("button[id=\"" + selector + "\"]>audio>source");
  // var curSrc = null;
  // for( var srcIdx = 0; srcIdx < audioSrc.length; srcIdx++) {
  //   curSrc = audioSrc[srcIdx].src;
  //   curSrc = curSrc.replace(/(?<=_)\d/g, Number(curSrc.match(/(?<=_)\d/g))+1);
  //   // audioSrc[srcIdx] = cycleAudio(curSrc, audioSrc[srcIdx])
  // }
  // audio[0].load();
  if(audio && audio.length > 0) {
    audio[0].play();
  }
}

function updateAudioSrc(audio, newSrc) {
  alert(newSrc)
  audio.src = newSrc;
  return audio;
}

function cycleAudio(filename, audio) {

  var result = jQuery.ajax({
    type: 'HEAD',
    url: filename,
    success: function(msg){
      // audio = updateAudioSrc(audio, filename);
      // return audio;
      return true;
    },
    error: function(jqXHR, textStatus, errorThrown){
      // filename = filename.replace(/(?<=_)\d/g, 1);
      // updateAudioSrc(audio, filename);
      return false;
      //   // log(jqXHR);
      //   // log(errorThrown);
    }
  });

  alert(result)

  if(result) {
    audio = updateAudioSrc(audio, filename);
  } else {
    filename = filename.replace(/(?<=_)\d/g, 1);
    alert(filename)
    audio = updateAudioSrc(audio, filename);
  }
}
