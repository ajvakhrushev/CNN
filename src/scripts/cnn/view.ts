import { Coords } from './interfaces';

const COLOR_BLACK = 'rgba(0, 0, 0, 1)';
const COLOR_WHITE = 'rgba(255, 255, 255, 1)';

const innerSize: number = 20;
const size: number = 28;
const increasedSize: number = 280;
const lineSize = 20;

const canvas: HTMLCanvasElement = document.querySelector('#canvas');
const canvasResult: HTMLCanvasElement = document.querySelector('#canvas-result');
const img: HTMLImageElement = document.querySelector('#canvas-image');
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const canvasResultCtx: CanvasRenderingContext2D = canvasResult.getContext("2d");
const checkButton: HTMLButtonElement = document.querySelector('#check');
const eraseButton: HTMLButtonElement = document.querySelector('#erase');
const resultNode: HTMLElement = document.querySelector('#result');

let canDrawLine: boolean = false;
let prev: Coords = [0, 0];
let current: Coords = [0, 0];

export function init() {
  ctx.strokeStyle = COLOR_WHITE;
  ctx.lineWidth = lineSize;
  ctx.lineCap = 'round';

  canvas.width = increasedSize;
  canvas.height = increasedSize;

  canvasResult.width = size;
  canvasResult.height = size;

  setBackgroundColor(canvas, ctx, COLOR_BLACK);
  setBackgroundColor(canvasResult, canvasResultCtx, COLOR_BLACK);

  resultNode.innerHTML = '';

  canvas.addEventListener('mousedown', onStart, false);
  canvas.addEventListener('mousemove', onMove, false);
  canvas.addEventListener('mouseup', onEnd, false);
  canvas.addEventListener('mouseout', onEnd, false);

  img.addEventListener('load', onLoad, false);

  checkButton.addEventListener('click', check, false);
  eraseButton.addEventListener('click', erase, false);
}

function refreshCoordinates(next: Coords) {
  prev = current;
  current = [next[0] - canvas.offsetLeft, next[1] - canvas.offsetTop];
}

function draw(prev: Coords, next: Coords) {
  ctx.beginPath();
  ctx.moveTo(prev[0], prev[1]);
  ctx.lineWidth = lineSize;
  ctx.strokeStyle = COLOR_WHITE;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineTo(next[0], next[1]);
  ctx.stroke();
  ctx.closePath();
}

function setBackgroundColor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color: string) {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function erase() {
  ctx.clearRect(0, 0, increasedSize, increasedSize);
  canvasResultCtx.clearRect(0, 0, size, size);
  setBackgroundColor(canvas, ctx, COLOR_BLACK);
  setBackgroundColor(canvasResult, canvasResultCtx, COLOR_BLACK);
  resultNode.innerHTML = '';
}

function check() {
  checkButton.disabled = true;
  eraseButton.disabled = true;

  img.src = canvas.toDataURL("image/jpeg", 1.0);
}

function onStart(event: MouseEvent) {
  canDrawLine = true;

  refreshCoordinates([event.clientX, event.clientY]);
}

function onMove(event: MouseEvent) {
  if (!canDrawLine) {
    return;
  }

  refreshCoordinates([event.clientX, event.clientY]);
  draw(prev, current);
}

function onEnd(event: MouseEvent) {
  canDrawLine = false;
}

function onLoad() {
  canvasResultCtx.clearRect(0, 0, size, size);
  setBackgroundColor(canvasResult, canvasResultCtx, COLOR_BLACK);
  canvasResultCtx.drawImage(img, 4, 4, innerSize, innerSize);
  // mnist.draw(mnist[0].get(), canvasResultCtx);

  requestAnimationFrame(() => requestAnimationFrame(didImageDraw));
}

function didImageDraw() {
  const data: Uint8ClampedArray = canvasResultCtx.getImageData(0, 0, size, size).data;
  const mappedData: number[] = [];

  for (var i = 0, length = data.length; i < length; i += 4) {
    mappedData.push(data[i+2]/255);
  }

  // const output = net.run(mappedData);
  // const result = output.reduce((prev, next: number, index: number) => {
  //   if (next >= 1) {
  //     return prev;
  //   }

  //   return next > prev.value ? {value: next, index} : prev;
  // }, {value: 0, index: -1});

  // console.log(output);



  // resultNode.innerHTML = `result is ${result.index}`;

  checkButton.disabled = false;
  eraseButton.disabled = false;

}
