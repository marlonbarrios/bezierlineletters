let points = [];
let draggingPoint = null;
let noiseOffsets = [];
let inputText = "";
let textPositionOffsets = [];
let inputElement;
let fontSize = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  inputElement = createInput('');
  inputElement.position(10, height - 50);
  inputElement.size(width - 20, 20);
  inputElement.input(updateInputText);
  inputElement.style('text-align', 'center');

  for (let i = 0; i < 4; i++) {
    noiseOffsets.push(createVector(random(1000), random(1000)));
  }
}

function updateInputText() {
  inputText = inputElement.value();
  textPositionOffsets = [];
  for (let i = 0; i < inputText.length; i++) {
    textPositionOffsets.push(i / (inputText.length - 1));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  updatePointsWithPerlinNoise();
  drawPoints();
  drawBezierCurve();
  drawTextOnBezierCurve();
}

function mousePressed() {
  if (mouseButton === LEFT) {
    for (const point of points) {
      if (dist(mouseX, mouseY, point.x, point.y) < 10) {
        draggingPoint = point;
        return;
      }
    }

    if (points.length < 4) {
      const newPoint = createVector(mouseX, mouseY);
      points.push(newPoint);
    }
  }
}
function keyPressed() {
  if (keyCode === UP_ARROW) {
    fontSize++;
  } else if (keyCode === DOWN_ARROW) {
    fontSize--;
    if (fontSize < 1) {
      fontSize = 1;
    }
  }
}

function mouseDragged() {
  if (mouseButton === LEFT) {
    if (draggingPoint) {
      draggingPoint.x = mouseX;
      draggingPoint.y = mouseY;

      constrainPointToBounds(draggingPoint);
    }
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    if (draggingPoint) {
      draggingPoint = null;
    }
  }
}

function drawPoints() {
  for (const point of points) {
    fill(220);
    stroke(220);
    strokeWeight(1);
    ellipse(point.x, point.y, 50);
  }
}

function drawBezierCurve() {
  if (points.length === 4) {
    stroke(220);
    strokeWeight(2);
    noFill();
    beginShape();
    vertex(points[0].x, points[0].y);
    bezierVertex(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
    endShape();
  }
}

function updatePointsWithPerlinNoise() {
  if (!draggingPoint) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const offsetX = noiseOffsets[i].x;
      const offsetY = noiseOffsets[i].y;

      point.x += map(noise(offsetX), 0, 1, -1, 1);
      point.y += map(noise(offsetY), 0, 1, -1, 1);

      constrainPointToBounds(point);

      noiseOffsets[i].x += 0.01;
      noiseOffsets[i].y += 0.01;
    }
  }
}

function constrainPointToBounds(point) {
  point.x = constrain(point.x, 0, width);
  point.y = constrain(point.y, 0, height);
}

function drawTextOnBezierCurve() {
  inputText = inputElement.value();
  if (points.length === 4) {
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    fill(0);
    noStroke();
    for (let i = 0; i < inputText.length; i++) {
      const t = textPositionOffsets[i];
      const textPos = getBezierPoint(points, t);
      text(inputText[i], textPos.x, textPos.y);
    }
  }
}

function getBezierPoint(points, t) {
  const x = bezierPoint(points[0].x, points[1].x, points[2].x, points[3].x, t);
  const y = bezierPoint(points[0].y, points[1].y, points[2].y, points[3].y, t);
  return createVector(x, y);
}

