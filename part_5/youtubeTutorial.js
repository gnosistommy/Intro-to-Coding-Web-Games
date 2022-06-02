/*document.body.innerHTML += ": It's me!"*/
//let canvas = document.querySelector('canvas');

let spriteArray = [];
let assetsLoaded = 0;
let assetsToLoad = [];
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
let imageObject = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 0,
    sourceHeight: 0,
    image: undefined,
    update: function(){

    },
    draw: function(){
        context.drawImage(
            this.image,
            this.sourceX, this.sourceY,
            this.sourceWidth, this.sourceHeight,
            this.x, this.y,
            this.width, this.height
        );
    }
};
let spriteSheet = new Image();
spriteSheet.src = "spriteSheet.png";
spriteSheet.addEventListener("load", loadHandler, false);
assetsToLoad.push(spriteSheet);
makeImage(0, -2, canvas.width+1, canvas.height+2, 0, 50, 500, 400, spriteSheet);
makeAlien();
function makeAlien(){
    let tempAlien = makeImage(canvas.width/2,canvas.height/2,60,60, 50, 0, 50, 50, spriteSheet);
    tempAlien.count =0;
    tempAlien.update = function(){
        if(this.count%10 === 0){
            if(this.state !== 0){
                this.state = 0;
                this.sourceX += 50;
            }else{
                this.state = 1;
                this.sourceX -= 50;
            }
        }
        this.count++;
        if(this.count === 100){
            this.count = 0;
        }
    }
}
function loadHandler(){
    assetsLoaded++;
    if(assetsLoaded === assetsToLoad.length){
        update();
    }
}
function makeImage(x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight, image){
    let tempImage = Object.create(imageObject);
    tempImage.x = x;
    tempImage.y = y;
    tempImage.width = width;
    tempImage.height = height;
    tempImage.sourceX = sourceX;
    tempImage.sourceY = sourceY;
    tempImage.sourceWidth = sourceWidth;
    tempImage.sourceHeight = sourceHeight;
    tempImage.image = image;
    spriteArray.push(tempImage);
    return tempImage;
}
function makeCircle(x, y, radius, color1, color2){
    let tempCircle = Object.create(circleObject);
    tempCircle.x = x;
    tempCircle.y = y;
    tempCircle.radius = radius;
    tempCircle.color1 = color1;
    tempCircle.color2 = color2;
    spriteArray.push(tempCircle);
}
/*for(var i=0; i<3; i++){
    makeCircle(150*(i+1), 150, 75, "pink", "red");
}*/
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
/*window.onload = function(){
    update();
}*/