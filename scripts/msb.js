// var ctx = new webkitAudioContext();
// ctx.decodeAudioData(req.response, function(buffer) {
//   console.log(buffer);
//   console.log(buffer.duration); // 116
// }

window.onload = updateButtonWidth;
window.onresize = updateButtonWidth;

document.addEventListener("DOMContentLoaded", function(event) {
  updateButtonWidth();
});

// $(document).ready(function(){
//   updateButtonWidth();
// });

function updateButtonWidth(){

  var buttons = document.querySelectorAll("button");
  for( var btnIdx = 0; btnIdx < buttons.length; btnIdx++ ) {
    [w, h] = getImageSize("#"+buttons[btnIdx].id)
    buttons[btnIdx].style.height = buttons[btnIdx].offsetWidth * h/w + "px";
    buttons[btnIdx].style.borderRadius = buttons[btnIdx].offsetWidth * 0.1 + "px";
    buttons[btnIdx].onclick = function(){playAudio(this.id)};
  }
}

function getImageSize(selector) {

// q = document.querySelectorAll("button");
// w = q[0];
// q = window.getComputedStyle(w)
// q.backgroundImage
  var backgroundIm = $(selector).css("background-image");
  var imSrc = backgroundIm.replace(/^url\(\"?|\"?\)$/g, "");

  var image = new Image();
  image.src = imSrc;
  var w = image.width,
      h = image.height;

  return [w, h];
}

var audio = null;
var srcUpdated = false;
function playAudio(selector) {

  if(audio && audio.length > 0) {
    audio[0].pause();
    audio[0].currentTime = 0
  }
  audio = $("button[id=\"" + selector + "\"]>audio");
  if(!audio || audio.length == 0) {
    return;
  }
  audioSrc = $("button[id=\"" + selector + "\"]>audio>source");
  var curSrc = null;
  for( var srcIdx = 0; srcIdx < audioSrc.length; srcIdx++) {
    curSrc = audioSrc[srcIdx].src;
    srcNumber = curSrc.match(/_\d/);
    if(!srcNumber) {
      break;
    }
    srcNumber = srcNumber[0].replace(/_/, "");
    srcNumber = parseInt(srcNumber);
    curSrc = curSrc.replace(/_\d/, "_" + (srcNumber+1));
    audioSrc[srcIdx] = cycleAudio(curSrc, audioSrc[srcIdx])
  }
  if(srcUpdated) {
    srcUpdated = false;
    audio[0].load();
  }
  if(audio && audio.length > 0) {
    audio[0].play();
  }
}

function updateAudioSrc(audio, newSrc) {
  if(audio.src != newSrc) {
    audio.src = newSrc;
    srcUpdated = true;
  }
  return audio;
}

function cycleAudio(filename, audio) {
  jQuery.ajax({
    type: 'HEAD',
    url: filename,
    success: function(msg){
      audio = updateAudioSrc(audio, filename);
      return audio;
    },
    error: function(jqXHR, textStatus, errorThrown){
      filename = filename.replace(/_\d/, '_1');
      audio = updateAudioSrc(audio, filename);
      return audio;
    }
  });
}
