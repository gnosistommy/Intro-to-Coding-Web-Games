/*document.body.innerHTML += ": It's me!"*/

//let canvas = document.querySelector('canvas');
let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");
canvas.style.backgroundColor = "yellow";
context.beginPath();
context.fillStyle = "green";
context.rect(10,10,100, 50);
context.closePath();
context.fill();
