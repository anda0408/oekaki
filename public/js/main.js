var socket = io();
let currentColor = '#000000';
let row = 0;
let isDrawing = false;
let x = 0;
let y = 0;
let eraser = false;
let width = 1;
const myPics = document.querySelector('#draw-area');
const context = myPics.getContext('2d');
context.fillStyle = "#fff";
context.fillRect(0, 0, myPics.clientWidth, myPics.clientHeight);

const eraserButton = document.querySelector('#eraser-button');
eraserButton.addEventListener('click', () => {
  currentColor = '#FFFFFF';
  eraser = true;
});
const penButton = document.querySelector('#pen-button');
penButton.addEventListener('click', () => {
  currentColor = '#000000';
  eraser = false;
})
const redButton = document.querySelector('#red-button');
redButton.addEventListener('click', () => {
  currentColor = '#FF0000';
});

const orangeButton = document.querySelector('#orange-button');
orangeButton.addEventListener('click', () => {
  currentColor = '#FF9900';
});

const yellowButton = document.querySelector('#yellow-button');
yellowButton.addEventListener('click', () => {
  currentColor = '#FFFF00';
});

const greenButton = document.querySelector('#green-button');
greenButton.addEventListener('click', () => {
  currentColor = '#33FF00';
});

const blueButton = document.querySelector('#blue-button');
blueButton.addEventListener('click', () => {
  currentColor = '#33CCFF';
});

var elem = document.getElementById('range');
var rangeValue = function (elem) {
  return function (evt) {
    width = elem.value;
  }
}
elem.addEventListener('input', rangeValue(elem));

const clearButton = document.querySelector('#clear-button');
clearButton.addEventListener('click', function () {
  socket.emit('clear-click');
  context.clearRect(0, 0, myPics.width, myPics.height);
  context.fillStyle = "#fff";
  context.fillRect(0, 0, myPics.clientWidth, myPics.clientHeight);
});

myPics.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});
myPics.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});
window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});
function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  if (eraser == true) {
    socket.emit('send-eraser', { x1, y1, x2, y2, width });
  }
  else {
    socket.emit('send-stroke', { x1, y1, x2, y2 })
    socket.emit('send-width', width)
    socket.emit('send-color', currentColor)
  }
  context.lineWidth = width;
  context.strokeStyle = currentColor;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
//autoDraw
socket.on('stroke', ({ x1, y1, x2, y2, widt, color }) => {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = widt;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
})
//autoErase
socket.on('eraser', ({ x1, y1, x2, y2, name, num }) => {
  context.beginPath();
  context.strokeStyle = '#FFFFFF';
  context.lineWidth = num;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
})
//autoclear
socket.on('clear-pls', (data) => {
  context.clearRect(0, 0, myPics.width, myPics.height);
  context.fillStyle = "#fff";
  context.fillRect(0, 0, myPics.clientWidth, myPics.clientHeight);
})
//download
document.getElementById("download").onclick = (event) => {
  var name = document.getElementById("file_name").value;
  var extension = document.getElementById("file_extension").value;
  let canvas = document.getElementById("draw-area");
  let link = document.createElement("a");
  link.href = canvas.toDataURL("image/" + extension);
  if (name == ""){
    link.download = "無題." + extension;
  } else {
    link.download = name + "." + extension;
  }
  link.click();
  document.getElementById("file_name").value = "";
  //let clear = document.getElementById("clear-button");
  //clear.click();
}
//message
