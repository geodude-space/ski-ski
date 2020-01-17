var canvas
var ctx

var scale
var score

var drawTimer
var roadTimer
var levelTimer

var levelIndex
var hasLeveled
var levels

var user
var leftBumpers = []
var rightBumpers = []
var debug = false

function levelChange() {
  // rotate levels
  if(levels[level] != levels[levels.length-1]) {
    level++
  } else {
    levels.reverse()
    level = 1
  }

  // could move this to drive() above chooseDirection()
  // adjust leading bumpers for new level
  if(levels[0] == 1) { // level up
    leftBumpers.x[0] += 10
    rightBumpers.x[0] -= 10

  } else { // level down
    leftBumpers.x[0] -= 10
    rightBumpers.x[0] += 10

  }
  hasLeveled = true
}

function drive() {
  var tempL1 = leftBumpers.x[0]
  var tempR1 = rightBumpers.x[0]

  // don't change directions when the level is changing
  if (!hasLeveled) {
    let direction = chooseDirection(leftBumpers.x[0], rightBumpers.x[0])
    leftBumpers.x[0] += scale*direction
    rightBumpers.x[0] += scale*direction
  } else {
    hasLeveled = false
  }

  // update the positions of the rest of the road
  for(i=1; i < leftBumpers.x.length; i++) {
    tempL2 = leftBumpers.x[i]
    tempR2 = rightBumpers.x[i]
    leftBumpers.x[i] = tempL1
    rightBumpers.x[i] = tempR1
    tempL1 = tempL2
    tempR1 = tempR2
  }

  // right now it's 1 point per board movement
  score ++
}

function crashed() {
  let left = leftBumpers.x[leftBumpers.x.length-1]
  let right = rightBumpers.x[rightBumpers.x.length-1]

  // check if user hit left bumper
  if(user.x <= left+10) {
    return true

  // check if user hit right bumper
} else if(user.x >= right-8) {
    return true

  }
  return false
}

function keyPress(e){
  // arrow left
  if(e.keyCode == 37){
    user.x-=10
  }
  // arrow right
  else if(e.keyCode == 39){
    user.x+=10
  }
}

function init() {
  window.addEventListener("keydown", keyPress, false);

  let width = 480
  let centerScreen = 240
  let height = window.innerHeight
  // scale = window.innerHeight/
  // scale = parseInt(height/24) // this magic number needs to go
  score = 0
  level = 0
  levels = [1,2,3,4,5,6]

  canvas = document.getElementById('gameBoard')
  canvas.width = width
  canvas.height = height

  ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black';
  ctx.font = '48px Ubuntu'

  user = new User('*',  centerScreen, height)
  scale = window.innerHeight/parseInt(ctx.measureText('^').width)
  // scale = window.innerHeight/parseInt(ctx.TextMetrics.emHeightAscent)

  leftBumpers = new Bumpers('^', centerScreen-90, height, scale)
  rightBumpers = new Bumpers('^', centerScreen+90, height, scale)

  drawTimer=setInterval(draw, 10)
  roadTimer=setInterval(drive, 500)
  levelTimer=setInterval(levelChange, 2000)
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // background color
    // ctx.fillStyle = '#849684'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    // ctx.fillStyle = 'black'

    // bumpers
    for(i=0; i < leftBumpers.x.length; i++) {
      if(debug && (i==0 || i==leftBumpers.x.length-1)){ctx.fillStyle = '#849684'}
      ctx.fillText(leftBumpers.char, leftBumpers.x[i], leftBumpers.y[i])
      ctx.fillText(rightBumpers.char, rightBumpers.x[i], rightBumpers.y[i])
      if(debug) {ctx.fillStyle = 'black'}
      // ctx.addHitRegion({id: "bumpers"});
    }

    // user
    ctx.font = '36px Ubuntu'
    ctx.fillText(user.char,user.x,user.y)
    ctx.font = '48px Ubuntu'

    // scoreboard
    ctx.font = 'bold 12px Ubuntu'
    ctx.fillText(score, 20, 20)
    ctx.font = '48px Ubuntu'

    if(crashed()) {
      // write score to file? will someone hack this?
      alert("Game Over")
      clearInterval(drawTimer)
      clearInterval(roadTimer)
      clearInterval(levelTimer)
      init()
    }
}

// Todo:
// more tuning to keep bumpers off walls
// shorter height interval so the game looks smoother
// fix user left/right change latency
