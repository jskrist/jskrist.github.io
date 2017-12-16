window.onload = updateButtonWidth;
window.onresize = updateButtonWidth;
function updateButtonWidth(){

  alert("Debug session " + 21)
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

  alert("in playAudio")
  if(audio && audio.length > 0) {
    audio[0].pause();
    audio[0].currentTime = 0
  }
  alert("playAudio: 1")
  audio = $("button[id=\"" + selector + "\"]>audio");
  if(!audio || audio.length == 0) {
    return;
  }
  alert("playAudio: 2")
  audioSrc = $("button[id=\"" + selector + "\"]>audio>source");
  var curSrc = null;
  for( var srcIdx = 0; srcIdx < audioSrc.length; srcIdx++) {
    alert("playAudio: 2a")
    curSrc = audioSrc[srcIdx].src;
    alert("playAudio: 2b")
    srcNumber = curSrc.match(/_\d/);
    alert("playAudio: 2c - " + srcNumber)
    srcNumber = parseInt(srcNumber.replace(/_/, ""));
    alert("playAudio: 2d")
    alert(srcNumber)
    curSrc = curSrc.replace(/_\d/, "_" + srcNumber);
    audioSrc[srcIdx] = cycleAudio(curSrc, audioSrc[srcIdx])
  }
  alert("playAudio: 3")
  audio[0].load();
  if(audio && audio.length > 0) {
    alert("playAudio: 4")
    audio[0].play();
  }
}

function updateAudioSrc(audio, newSrc) {
  alert(newSrc)
  audio.src = newSrc;
  return audio;
}

function cycleAudio(filename, audio) {

  jQuery.ajax({
    type: 'HEAD',
    url: filename,
    success: function(msg){
      audio = updateAudioSrc(audio, filename);
      return audio;
      // return true;
    },
    error: function(jqXHR, textStatus, errorThrown){
      // filename = filename.replace(/(?<=_)\d/g, 1);
      // updateAudioSrc(audio, filename);
      // return false;
      //   // log(jqXHR);
      //   // log(errorThrown);
      filename = filename.replace(/_\d/, '_1');
      alert("error: " + filename)
      audio = updateAudioSrc(audio, filename);
    }
  });

  // if(result) {
  //   audio = updateAudioSrc(audio, filename);
  // } else {
  //   filename = filename.replace(/_\d/, '_1');
  //   alert(filename)
  //   audio = updateAudioSrc(audio, filename);
  // }
}
