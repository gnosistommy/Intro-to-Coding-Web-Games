/*document.body.innerHTML += ": It's me!"*/

//let canvas = document.querySelector('canvas');
let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");
canvas.style.backgroundColor = "yellow";

drawCircle();
//drawRect();

function drawCircle(){
    context.beginPath();
    let grad = context.createRadialGradient((canvas.width/2)-50,(canvas.height/2)-50, 5, (canvas.width/2),(canvas.height/2), 100);
    grad.addColorStop(0.0, "white");
    grad.addColorStop(0.2, "gray");
    /*grad.addColorStop(0.4, "yellow");
    grad.addColorStop(0.5, "green");
    grad.addColorStop(0.6, "blue");
    grad.addColorStop(0.8, "purple");*/
    grad.addColorStop(1.0, "black");
    context.fillStyle = grad;
    context.arc((canvas.width/2),(canvas.height/2), 100, 0, 2*Math.PI);
    context.closePath();
    context.fill();
}
function drawRect(){
    context.beginPath();
    let grad = context.createLinearGradient(10, 10, 110, 10);
    grad.addColorStop(0.0, "red");
    grad.addColorStop(0.2, "orange");
    grad.addColorStop(0.4, "yellow");
    grad.addColorStop(0.5, "green");
    grad.addColorStop(0.6, "blue");
    grad.addColorStop(0.8, "purple");
    grad.addColorStop(1.0, "pink");
    context.fillStyle = grad;
    context.rect(10,10,100, 50);
    context.closePath();
    context.fill();
}