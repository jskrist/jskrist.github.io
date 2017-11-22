var x = 100,
y = 100,
angle1 = 0.0,
segLength = 50;
var gameStarted = false;

// Wait for the page to load first
window.onload = function() {

  //Get a reference to the link on the page
  // with an id of "mylink"
  var a = document.getElementById("play-btn");

  //Set code to run when the link is clicked
  // by assigning a function to "onclick"
  a.onclick = function() {

    var canvas = createCanvas();
    canvas.parent("defaultCanvas")
    strokeWeight(20.0);
    stroke(255, 100);

    gameStarted = true;
    return false;
  }
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
