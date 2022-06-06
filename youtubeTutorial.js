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
    up: false,
    left: false,
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
    up: false,
    left: false,
    type: undefined,
    halfWidth: function(){
        return this.width/2;
    },
    halfHeight: function(){
        return this.height/2;
    },
    centerX: function(){
        return this.x + this.halfWidth();
    },
    centerY: function(){
        return this.y + this.halfHeight();
    },
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
makeImage(0, -2, canvas.width+1, canvas.height+2, 0, 50, 500, 400, spriteSheet, "background");

for(var i=0; i<10; i++){
    makeAlien((canvas.width/2)*i,canvas.height/2);
}

function hitTestRectangle(r1,r2){
    var hit = false;

    var vx = r1.centerX() - r2.centerX();
    var vy = r1.centerY() - r2.centerY();

    var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
    var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

    if(Math.abs(vx) < combinedHalfWidths){
        if(Math.abs(vy) < combinedHalfHeights){
            hit = true;
        }else{
            hit = false;
        }
    }else{
        hit = false;
    }
    return hit;
}
function getRandomNum(max){
    return Math.floor(Math.random()*max);
}
function destroyAlien(alien){
    alien.sourceX = 150;
    setTimeout(function(){
        spriteArray.splice(spriteArray.indexOf(alien), 1);
    },200);
}
function makeAlien(x, y){
    let tempAlien = makeImage(x,y,60,60, 50, 0, 50, 50, spriteSheet, "alien");
    tempAlien.count =0;
    tempAlien.up = getRandomNum(2);
    tempAlien.left = getRandomNum(2);
    tempAlien.hit = false;
    tempAlien.update = function(){
        for(sprite of spriteArray){
            if(sprite !== this && sprite.type === "alien" && this.type === "alien" && !this.hit){
                var hit = hitTestRectangle(this, sprite);
                if(hit){
                    this.hit = true;
                    destroyAlien(this);
                }else{
                    if(this.count%10 === 0 && !this.hit){
                        if(this.state !== 0){
                            this.state = 0;
                            this.sourceX += 50;
                        }else{
                            this.state = 1;
                            this.sourceX -= 50;
                        }
                        if(this.y <= 0){
                            this.up = false;
                        }
                        if(this.y + this.height >= canvas.height){
                            this.up = true;
                        }
                        if(this.x < 0){
                            this.left = false;
                        }
                        if(this.x + this.width >= canvas.width){
                            this.left = true;
                        }
                    }
                }
            }
        }
        if(this.up){
            this.y -= 1;
        }else{
            this.y += 1;
        }
        if(this.left){
            this.x -= 1;
        }else{
            this.x += 1;
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
function makeImage(x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight, image, type){
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
    tempImage.type = type;
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