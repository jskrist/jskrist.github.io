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
    [w, h] = getImageSize(buttons[btnIdx])
    buttons[btnIdx].style.height = buttons[btnIdx].offsetWidth * h/w + "px";
    buttons[btnIdx].style.borderRadius = buttons[btnIdx].offsetWidth * 0.1 + "px";
    buttons[btnIdx].onclick = function(){playAudio(this.id)};
  }
}

function getImageSize(btn) {

  // btn = document.querySelector(selector);
  css = window.getComputedStyle(btn);
  backgroundIm = css.backgroundImage;
  // var backgroundIm = $(selector).css("background-image");
  var imSrc = backgroundIm.replace(/^url\(\"?|\"?\)$/g, "");

  var image = new Image();
  image.src = imSrc;
  var w = image.width,
      h = image.height;

  return [w, h];
}

// loadSound('http://127.0.0.1:3000/media/frizzle_6.ogg')

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

var context;
var buffers = [];
buffers.frizzle = [];
buffers.arnold = [];
buffers.producer = [];
buffers.da = [];
buffers.carlos = [];
buffers.janet = [];
buffers.jyoti = [];
buffers.keesha = [];
buffers.ralphie = [];
buffers.phoebe = [];
buffers.tim = [];
buffers.wanda = [];
var personRe = /([a-z]+)_(\d)/;
var currentBuffer = null;
var source = null;

window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    source = context.createBufferSource();
    loadAllAudio();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

function loadAllAudio() {
  people = Object.keys(buffers);
  audioPath = '/media/';
  audio = document.createElement('audio');
  if(audio.canPlayType("audio/ogg") === "probably") {
    ext = ".ogg";
  }
  else {
    ext = ".wav";
  }
  for( var personIdx = 0; personIdx < people.length; personIdx++) {
    curPerson = people[personIdx];
    srcNum = 1;
    personLimit = sessionStorage.getItem(curPerson+'Limit');
    // while(!personLimit || personLimit < srcNum) {
      url = audioPath + curPerson + '_' + srcNum + ext;
      //loadSound(url)
      srcNum++;
      personLimit = sessionStorage.getItem(curPerson+'Limit');
    // }
  }
  if(srcUpdated) {
    srcUpdated = false;
    audio[0].load();
  }
  if(audio && audio.length > 0) {
    audio[0].play();
  }
}

function loadSound(url) {

  jQuery.ajax({
    type: 'HEAD',
    url: url,
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

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      if(currentBuffer) {
        currentBuffer.concat(buffer);
      }
    }, function(ME) {
			onError(ME, url)
		});
  }
  var reMatch = url.match(personRe);
  if(reMatch) {
    currentBuffer = buffers[reMatch[1]];
  }
  else {
    currentBuffer = null;
  }
  request.send();
}

function onError(ME, url) {
  var reMatch = url.match(personRe);
  if(reMatch) {
    sessionStorage.setItem(reMatch[1]+'Limit', reMatch[2]-1)
  }
}
// loadSound('http://127.0.0.1:3000/media/frizzle_6.ogg')
function playSound(buffer, person) {
  var personLimit = sessionStorage.getItem(person+'Limit');
  var currentBufferNumber = sessionStorage.getItem(person+'CurrentBuffer');
  if(personLimit && currentBufferNumber) {
    currentBufferNumber = (currentBufferNumber) % personLimit;
  }
  else {
    currentBufferNumber = 0;
  }
  sessionStorage.setItem(person+'CurrentBuffer', currentBufferNumber);
  source.buffer = buffers[person][currentBufferNumber];
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}
// playSound(frizzleBuffer[1]); playSound(frizzleBuffer[2]), playSound(frizzleBuffer[3]); playSound(frizzleBuffer[4])
