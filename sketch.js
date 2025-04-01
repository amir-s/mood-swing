let angle = 0.3;
let angleVel = 0.0225;
let angleAcc = 0;
let ropeLength = 200;
let centerX, centerY;
let swingForce = 0.1;
let score = 0;
let allowScore = true;
let tiltInfluence = 0;

const MAX_DURATION = 30;
let duration = MAX_DURATION;

let emoji = "😂";
function setup() {
  createCanvas(600, 800);
  centerX = width / 2;
  centerY = 200;
  textAlign(CENTER, CENTER);

  // Request permission for iOS devices
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      })
      .catch(console.error);
  } else {
    // Non-iOS devices
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

function handleOrientation(event) {
  // Use gamma (left/right tilt) for swing control
  tiltInfluence = event.gamma || 0; // fallback to 0 if undefined
  tiltInfluence = constrain(tiltInfluence, -30, 30); // limit extremes
  tiltInfluence *= 0.0002; // scale down to match physics
}

function draw() {
  background(255);

  // Apply tilt-based influence
  angleVel += tiltInfluence;

  // Physics
  angleAcc = -0.03 * sin(angle);
  angleVel += angleAcc;
  angleVel *= 0.98;
  angle += angleVel;

  // Calculate swing position
  let x = centerX + ropeLength * sin(angle);
  let y = centerY + ropeLength * cos(angle);

  // Draw rope
  stroke(139, 69, 19);
  strokeWeight(4);
  line(centerX, centerY, x, y);

  /*
  // Draw emoji face
  noStroke();
  fill(255, 223, 0);
  ellipse(x, y, 60, 60);

  // Eyes
  fill(0);
  ellipse(x - 10, y - 10, 5, 5);
  ellipse(x + 10, y - 10, 5, 5);
  */
  textSize(70);
  if (duration < 0) {
    emoji = "😭";
  }
  duration--;
  text(emoji, x, y + 4);

  // Perfect timing zone
  noFill();
  stroke(135, 206, 250);
  strokeWeight(2);
  ellipse(centerX, centerY + ropeLength, 80, 80);

  // Score
  fill(0);
  noStroke();
  textSize(24);
  text("Score: " + score, width / 2, 40);

  // Reset scoring permission when swing leaves perfect zone
  if (abs(angle) < 0.3 && allowScore) {
    allowScore = false;
    score++;
    emoji = "😂";
    duration = MAX_DURATION;
    navigator.vibrate(10);
  } else if (abs(angle) >= 0.3) {
    allowScore = true;
  }
}

function keyPressed() {
  if (keyCode === ENTER && abs(angle) < 0.3 && allowScore) {
    angleVel += -sin(angle) * swingForce;
    score++;
    allowScore = false;
  }
}

async function requestPermission() {
  await DeviceMotionEvent.requestPermission();
}
