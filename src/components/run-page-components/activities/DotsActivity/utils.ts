import _ from 'lodash';
import {
  CIRCLE_COLORS,
  CIRCLE_UPDATE_INTERVAL,
  TARGET_FRAME_RATE,
} from './constants';
import { Circle, Dimensions } from './types';

function generateNewSet(
  dimensions: Dimensions,
  circlesAmount: number,
  injectColors: boolean
): Circle[] {
  const newCircles: Circle[] = [];

  for (let i = 0; i < circlesAmount; ++i) {
    const newCircle = {
      lastVectorChange: 0,
      speed: _.random(1, 5),
      radius: dimensions.width * 0.035,
      x: _.random(
        (dimensions.width * 5) / 100,
        dimensions.width - (dimensions.width * 5) / 100
      ),
      y: _.random(
        (dimensions.height * 5) / 100,
        dimensions.height - (dimensions.height * 5) / 100
      ),
      xVector: _.random(1, 5) * _.sample([1, -1])!,
      yVector: _.random(1, 5) * _.sample([1, -1])!,
      color: '#92e744',
    };

    newCircles.push(newCircle);
  }

  if (injectColors) injectRandomColors(newCircles, CIRCLE_COLORS);

  return newCircles;
}
function resetLastVectorChange(circles: Circle[]) {
  circles.forEach((circle) => (circle.lastVectorChange = 0));
}
function injectRandomColors(circles: Circle[], fromColors: string[]) {
  const uniqueColors = _.sampleSize(fromColors, circles.length);

  circles.forEach((circle, index) => (circle.color = uniqueColors[index]));
}
function drawOutline(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  context.beginPath();
  context.arc(Math.floor(x), Math.floor(y), Math.floor(radius), 0, 2 * Math.PI);
  context.closePath();

  context.clip();
}
function drawCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  context.beginPath();
  context.arc(Math.floor(x), Math.floor(y), Math.floor(radius), 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = 'white';
  context.lineWidth = 2;
  context.stroke();
  context.closePath();
}
function clearFrame(dimensions: Dimensions, context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, dimensions.width, dimensions.height);
}
function drawFrame(context: CanvasRenderingContext2D, circles: Circle[]) {
  circles.forEach((circle) =>
    drawCircle(context, circle.x, circle.y, circle.radius, circle.color)
  );
}
function updateCircles(
  dimensions: Dimensions,
  speedMultiplier: number,
  circles: Circle[]
) {
  circles.forEach((circle) => {
    if (
      circle.lastVectorChange >= CIRCLE_UPDATE_INTERVAL ||
      circle.lastVectorChange === 0
    ) {
      circle.speed = _.random(1, 5) * speedMultiplier;
      circle.xVector = _.random(1, circle.speed) * _.sample([1, -1])!;
      circle.yVector = _.random(1, circle.speed) * _.sample([1, -1])!;

      circle.lastVectorChange = 0;
    }

    if (
      (circle.xVector > 0 &&
        circle.x + circle.radius > dimensions.width - 100) ||
      (circle.xVector < 0 && circle.x - circle.radius < 100)
    ) {
      circle.xVector *= -1;
    }
    if (
      (circle.yVector > 0 &&
        circle.y + circle.radius > dimensions.height - 100) ||
      (circle.yVector < 0 && circle.y - circle.radius < 100)
    ) {
      circle.yVector *= -1;
    }

    circle.x += circle.xVector;
    circle.y += circle.yVector;

    circle.lastVectorChange += 1000 / TARGET_FRAME_RATE;
  });
}
function updateFrame(
  dimensions: Dimensions,
  context: CanvasRenderingContext2D,
  speedMultiplier: number,
  circles: Circle[]
) {
  updateCircles(dimensions, speedMultiplier, circles);

  clearFrame(dimensions, context);

  drawFrame(context, circles);
}

const Utils = {
  drawOutline,
  generateNewSet,
  resetLastVectorChange,
  updateFrame,
};

export default Utils;
