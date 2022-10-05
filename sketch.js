var play = 1
var gamestate = play
var end = 0
var obstaclesgroup
var cloudsgroup
var trex ,trex_running;
var ground
var score = 0
function preload(){
  trex_running = loadAnimation('trex1.png','trex3.png','trex4.png')
  trex_collided = loadAnimation('trex_collided.png')
  groundimage = loadImage('ground2.png')
  cloud = loadImage('cloud.png')
  obstacle1 = loadImage('obstacle1.png')
  obstacle2 = loadImage('obstacle2.png')
  obstacle3 = loadImage('obstacle3.png')
  obstacle4 = loadImage('obstacle4.png')
  obstacle5 = loadImage('obstacle5.png')
  obstacle6 = loadImage('obstacle6.png')
  restartbutton = loadImage('restart.png')
  gameoverbutton = loadImage('gameOver.png')
  jumpSound = loadSound('jump.mp3')
  checkpointSound = loadSound('checkPoint.mp3')
  dieSound = loadSound('die.mp3')
}

function setup(){
  obstaclesgroup = createGroup()
  cloudsgroup = createGroup()  
  createCanvas(600,200)
  //ground creation
  ground = createSprite(200,180,400,20)
  ground.addImage(groundimage)
  //t-rex creation
  trex = createSprite(50,160,20,50)
  trex.scale = 0.5
  trex.addAnimation('running',trex_running)
  trex.addAnimation('collided',trex_collided)
  //trex.debug = true
  trex.setCollider('rectangle',0,0,40,trex.height) 
  //invisible ground creation
  invis = createSprite(200,190,400,10)
  invis.visible = false
  //end screen creation
  restart = createSprite(300,135)
  restart.visible = false
  gameover = createSprite(300,100)
  gameover.visible = false
}
function draw(){
  background(250)
  fill('black')
  text('Score: '+score.toFixed(2),500,50)
  trex.collide(invis)
  var ran = Math.round(random(10,60))
  if (gamestate === play) {
    score = score + getFrameRate()/60
    ground.velocityX = (-2+score/-1000)
    spawnclouds()
    spawnobstacles()
    //ground reset
    if (ground.x < 0) {
      ground.x = ground.width/2
    }
    //t-rex jump
    if (keyDown('SPACE') && trex.y >=150) {
      jumpSound.play()
      trex.velocityY = -10
    }
    trex.velocityY += 0.5
    //t-rex death
    if (obstaclesgroup.isTouching(trex)) {
      gamestate = end
      dieSound.play()
      jumpSound.play()
      trex.velocityY = -10
    }
  }
  else if (gamestate === end) {
    obstaclesgroup.setLifetimeEach(-1)
    cloudsgroup.setLifetimeEach(-1)
    gameover.addImage(gameoverbutton)
    gameover.scale = 0.75
    gameover.visible = true
    restart.addImage(restartbutton)
    restart.scale = 0.4
    restart.visible = true
    trex.changeAnimation('collided',trex_collided)
    ground.velocityX = 0
    trex.velocityY = 0
    obstaclesgroup.setVelocityXEach(0)
    cloudsgroup.setVelocityXEach(0)
    if (mousePressedOver(restart)) {
      reset()
    }
  }
  drawSprites()
}
function spawnclouds() {
  if (frameCount%60 === 0){
  var clouds = createSprite(600,random(10,60))
  cloudsgroup.add(clouds)
  clouds.velocityX = -2
  clouds.addImage(cloud)
  clouds.scale = 0.5
  clouds.depth = trex.depth - 1
  clouds.lifetime = 300
  }
}
function spawnobstacles() {
  if (frameCount%60 === 0){
    var obstacle = createSprite(600,165,10,40)
    obstaclesgroup.add(obstacle)
    var rand = Math.round(random(1,6))
    switch(rand) {
      case 1:obstacle.addImage(obstacle1);
      break;
      case 2:obstacle.addImage(obstacle2);
      break;
      case 3:obstacle.addImage(obstacle3);
      break;
      case 4:obstacle.addImage(obstacle4);
      break;
      case 5:obstacle.addImage(obstacle5);
      break;
      case 6:obstacle.addImage(obstacle6);
      break;
      default:
      break;
    }
    obstacle.velocityX = -(6+score/1000)
    obstacle.scale = 0.5
    obstacle.lifetime = 300
  }
}
function reset() {
  score = 0
  obstaclesgroup.destroyEach()
  cloudsgroup.destroyEach()
  trex.changeAnimation('running',trex_running)
  restart.visible = false
  gameover.visible = false
  gamestate = play
}