const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope, rope2, rope3;
var fruit;
var fruit_con, fruit_con2, fruit_con3;
var backgroundIMG, fruitIMG, bunnyIMG;
var bunny;
var button, button2, button3;
var blink, eat, sad;
var bk_song, cut_sound, sad_sound, eating_sound, air;
var blower;

var canW, canH;



function preload() {
  backgroundIMG = loadImage("img/background.png");
  fruitIMG = loadImage("img/melon.png");
  bunnyIMG = loadImage("img/Rabbit-01.png");
  blink = loadAnimation("img/blink_1.png","img/blink_2.png","img/blink_3.png");
  eat = loadAnimation("img/eat_0.png","img/eat_1.png","img/eat_2.png","img/eat_3.png","img/eat_4.png");
  sad = loadAnimation("img/sad_1.png","img/sad_2.png","img/sad_3.png");

  bk_song = loadSound("sound/bk_song.mp3");
  cut_sound = loadSound("sound/rope_cut.mp3");
  sad_sound = loadSound("sound/sad.wav"); 
  eating_sound = loadSound("sound/eating_sound.mp3");
  air = loadSound("sound/air.wav");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  eat.looping = false;
  sad.looping = false;
}

function setup() 
{

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas (displayWidth+80, displayHeight);
  } else {
    canW = windowWidth;
    canH = windowHeight;
    createCanvas (windowWidth, windowHeight);
  }


  //createCanvas(500,700);
  frameRate(80);
  engine = Engine.create();
  world = engine.world;

  bk_song.play();
  bk_song.setVolume(0.2);



  

  ground = new Ground(canW/2,canH,canW,20);
  rope = new Rope (9, {x:40, y:30});
  rope2 = new Rope (7, {x:365, y:30});
  rope3 = new Rope (4, {x:400, y:215});

    rectMode(CENTER);
    ellipseMode(RADIUS);
    imageMode(CENTER);
    textSize(50)



  var fruit_options= {
   density:0.001
  }

  fruit = Bodies.circle(300,300,20,fruit_options);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link(rope3, fruit);
  
  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(420,canH-80,100,100);
  //bunny.addImage(bunnyIMG);
  bunny.scale = 0.2;
  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);
  bunny.changeAnimation("blinking");


  button = createImg("img/cut_btn.png");
  button.position(20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg("img/cut_btn.png");
  button2.position(330,35);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg("img/cut_btn.png");
  button3.position(360,200);
  button3.size(50,50);
  button3.mouseClicked(drop3);

  blower = createImg("img/balloon.png");
  blower.position(10,250);
  blower.size(150,100);
  blower.mouseClicked(airblow);

  mute_btn = createImg("img/mute.png");
  mute_btn.position(450,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);
}

function draw() 
{
  background(51);
  image(backgroundIMG,canW/2,canH/2,canW+80,canH);

  if(fruit!=null) {
    image(fruitIMG, fruit.position.x, fruit.position.y, 60,60);
    }

  ground.show();
  rope.show();
  rope2.show();
  rope3.show();

  
  Engine.update(engine);
  
  if (collide(fruit, bunny)==true) {
    bunny.changeAnimation("eating");
    eating_sound.play();
  }
 // if (collide(fruit, ground.body)==true) {
 //  bunny.changeAnimation("crying");
 //}

  if(fruit!=null && fruit.position.y>=windowHeight-30)
  {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit=null;
     
   }

 drawSprites();
   
}

function drop() {
  cut_sound.play();
  rope.break();
  fruit_con.separate();
  fruit_con = null;
}

function drop2() {
  cut_sound.play();
  rope2.break();
  fruit_con2.separate();
  fruit_con2 = null;
}

function drop3() {
  cut_sound.play();
  rope3.break();
  fruit_con3.separate();
  fruit_con3 = null;
}

function collide(body, sprite) {
  if (body!=null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(d<=80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

function airblow() {
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.01, y:0});
}

function mute (){
  if (bk_song.isPlaying()) {
    bk_song.stop();
  } else {
    bk_song.play();
  }
}
