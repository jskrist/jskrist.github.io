var x = 100,
y = 100,
angle1 = 0.0,
segLength = 50;
var gameStarted = false;
var canvasCreated = false;
var a = [];
var canvasDiv = [];

// Wait for the page to load first
window.onload = function() {

  //Get a reference to the link on the page
  // with an id of "mylink"
  a = document.getElementById("play-btn");
  canvasDiv = document.getElementById("defaultCanvas");
  //Set code to run when the link is clicked
  // by assigning a function to "onclick"
  a.onclick = startGame;
}

function setup() {
  // if(!canvasCreated) {
  //   canvas = createCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
  //   canvas.parent("defaultCanvas");
  //   strokeWeight(20.0);
  //   stroke(255, 100);
  // }
  // noLoop();
}

function draw() {
  if(gameStarted) {
    background(0);

    dx = mouseX - x;
    dy = mouseY - y;
    angle1 = atan2(dy, dx);
    x = mouseX - (cos(angle1) * segLength);
    y = mouseY - (sin(angle1) * segLength);

    segment(x, y, angle1);
    ellipse(x, y, 20, 20);
  }
}

function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}

function startGame() {
    if(!gameStarted) {
      canvasDiv.style.display = "block";
      if(!canvasCreated) {
        canvas = createCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
        canvas.parent("defaultCanvas");
        strokeWeight(20.0);
        stroke(255, 100);
      }
      resizeCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
      gameStarted = true;
      a.text = "Restart Game";
      a.onclick = resetGame;
    }
    return false;
  }

function resetGame() {
  // Reset Game Parameters

  // reset the link's callback
  resizeCanvas(1,1)
  gameStarted = false;
  a.onclick = startGame;
  a.text = "Start Game";
  return false;
}
