"use strict";

// easings from https://gist.github.com/gre/1650294
function easeInOutQuad(t) {
  return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function easeInOutQuint(t) {
  return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
function easeInOutElastic(t) {
  return (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1;
}

var canvas = undefined;
var ctx = undefined;
var numberOfPoints = undefined;
var squarePoints = undefined;
var circlePoints = undefined;
var w = undefined,
    h = undefined;
var tick = undefined;

function setup() {
  tick = 0;
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  numberOfPoints = 200;
  reset();
  window.addEventListener("resize", reset);
}

function addCirclePoints() {
  circlePoints = [];
  var r = Math.min(w, h) * 0.4;
  for (var i = 0; i < numberOfPoints; i++) {
    var angle = i / numberOfPoints * Math.PI * 2 - Math.PI / 4 * 3;
    var cx = w / 2 + Math.cos(angle) * r;
    var cy = h / 2 + Math.sin(angle) * r;
    circlePoints.push([cx, cy]);
  }
}

function addSquarePoints() {
  squarePoints = [];
  var d = Math.min(w, h) * 0.8;
  var pointsPerSide = numberOfPoints / 4;
  for (var i = 0; i < pointsPerSide; i++) {
    var sx = (w - d) / 2 + i / pointsPerSide * d;
    var sy = (h - d) / 2;
    squarePoints.push([sx, sy]);
  }
  for (var i = 0; i < pointsPerSide; i++) {
    var sx = (w - d) / 2 + d;
    var sy = (h - d) / 2 + i / pointsPerSide * d;
    squarePoints.push([sx, sy]);
  }
  for (var i = pointsPerSide; i >= 0; i--) {
    var sx = (w - d) / 2 + i / pointsPerSide * d;
    var sy = (h - d) / 2 + d;
    squarePoints.push([sx, sy]);
  }
  for (var i = pointsPerSide; i >= 0; i--) {
    var sx = (w - d) / 2;
    var sy = (h - d) / 2 + i / pointsPerSide * d;
    squarePoints.push([sx, sy]);
  }
}

function reset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  addCirclePoints();
  addSquarePoints();
}

function draw() {
  tick++;
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, w, h);
  tweenShapes(tick);
}

function tweenPoints(p0, p1, t, i) {
  var t1 = 200;
  if (i % 2 === 1) {
    t += 75;
  }
  var t0 = t % t1;
  var x = undefined,
      y = undefined;
  var eased = easeInOutQuint(t0 / t1);
  if (t % (t1 * 2) >= t1) {
    x = p0[0] + (p1[0] - p0[0]) * eased;
    y = p0[1] + (p1[1] - p0[1]) * eased;
  } else {
    x = p1[0] - (p1[0] - p0[0]) * eased;
    y = p1[1] - (p1[1] - p0[1]) * eased;
  }
  return [x, y];
}

function tweenShapes(tick) {
  var p0 = tweenPoints(circlePoints[0], squarePoints[0], tick);
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  for (var i = 1; i < numberOfPoints; i++) {
    var p = tweenPoints(circlePoints[i], squarePoints[i], tick, i);
    ctx.lineTo(p[0], p[1]);
  }
  ctx.closePath();
  ctx.stroke();
}

setup();
draw();