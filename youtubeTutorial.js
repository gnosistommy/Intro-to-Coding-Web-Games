/*document.body.innerHTML += ": It's me!"*/
//let canvas = document.querySelector('canvas');

let spriteArray = [];
let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");
canvas.style.backgroundColor = "yellow";

//drawCircle(canvas.width-100, canvas.height-100, 100, "white", "black");
//drawRect((canvas.width/2)-50, (canvas.height/2)-25, 100, 50, "blue", "maroon");
let circleObject = {
    x: 0,
    y: 0,
    radius: 0,
    width: 0,
    height: 0,
    color1: "white",
    color2: "black",
    update: function(){
        if(!(this.y + this.radius >= canvas.height)){
            this.y++;
        }
    },
    draw: function(){
        drawCircle(this.x, this.y, this.radius, this.color1, this.color2);
    }
};
function makeCircle(x, y, radius, color1, color2){
    let tempCircle = Object.create(circleObject);
    tempCircle.x = x;
    tempCircle.y = y;
    tempCircle.radius = radius;
    tempCircle.color1 = color1;
    tempCircle.color2 = color2;
    spriteArray.push(tempCircle);
}
makeCircle(150, 150, 75, "pink", "red");
function drawCircle(x, y, radius, color1, color2){
    context.beginPath();
    let grad = context.createRadialGradient(x-(radius/2),y-(radius/2), (radius/2)/10, x,y, radius);
    grad.addColorStop(0.0, color1);
    /*grad.addColorStop(0.2, "gray");
    grad.addColorStop(0.4, "yellow");
    grad.addColorStop(0.5, "green");
    grad.addColorStop(0.6, "blue");
    grad.addColorStop(0.8, "purple");*/
    grad.addColorStop(1.0, color2);
    context.fillStyle = grad;
    context.arc(x,y, radius, 0, 2*Math.PI);
    context.closePath();
    context.fill();
}
function drawRect(x, y, width, height, color1, color2){
    context.beginPath();
    let grad = context.createLinearGradient(x, y, x+width, y);
    grad.addColorStop(0.0, color1);
    /*grad.addColorStop(0.2, "orange");
    grad.addColorStop(0.4, "yellow");
    grad.addColorStop(0.5, "green");
    grad.addColorStop(0.6, "blue");
    grad.addColorStop(0.8, "purple");*/
    grad.addColorStop(1.0, color2);
    context.fillStyle = grad;
    context.rect(x,y,width, height);
    context.closePath();
    context.fill();
}
function update(){
    for(sprite of spriteArray){
        sprite.update();
    }
    render();
    requestAnimationFrame(update, canvas);
}
function render(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(sprite of spriteArray){
        sprite.draw();
    }
}
window.onload = function(){
    update();
}