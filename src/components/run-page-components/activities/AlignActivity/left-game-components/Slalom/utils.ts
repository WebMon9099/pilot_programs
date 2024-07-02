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

const Utils = { drawCircle };

export default Utils;
