var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var out = document.getElementById("out");
var turnos = document.getElementById("turnos")
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;



  initTestBlock('mouse', {
  start: 'mousedown',
  move: 'mousemove',
  end: 'mouseup'
}, true);
initTestBlock('touch-no-remove', {
  start: 'touchstart',
  move: 'touchmove',
  end: 'touchend'
}, true);
var turno=1;
function initTestBlock(id, events, noRemove) {
  canvas.addEventListener(events.start, function(e) {
	  var distanciaX=0;
	  var distanciaY=0;
	  var touch=1;
	  var clientX= id=="mouse" ? e.clientX : e.touches[0].clientX;
	  var clientY= id=="mouse" ? e.clientY : e.touches[0].clientY;
    if (((player1.x+player1.size)>=clientX) && (player1.x<=clientX) && ((player1.y+player1.size)>=clientY) && (player1.y<=clientY)){
        function onMove(e) {
			touch=1;
		  }
		  canvas.addEventListener(events.move, onMove);
		  canvas.addEventListener(events.end, onEnd);
    }
    else if (((player2.x+player2.size)>=clientX) && (player2.x<=clientX) && ((player2.y+player2.size)>=clientY) && (player2.y<=clientY)){
        function onMove(e) {
			touch=2;
		  }
		  canvas.addEventListener(events.move, onMove);
		  canvas.addEventListener(events.end, onEnd);
    }

    function onEnd(e) {
		distanciaX=  id=="mouse" ? e.clientX : e.changedTouches[0].clientX;
		distanciaY= id=="mouse" ? e.clientY : e.changedTouches[0].clientY;
		let count=0;
		if ((turno==1) && (touch==1)){
			distanciaX-=player1.x;
			distanciaY-=player1.y;
			let intervalo=setInterval(function(){
					player1.x-=distanciaX/100;
					player1.y-=distanciaY/100;
					count++;
					if(player1.x + player1.size > canvas.width){
						player1.x = canvas.width - player1.size;
						distanciaX*=-1;
					}
					if(player1.x - player1.size < 0){
						player1.x = 0 + player1.size;
						distanciaX*=-1;
					}
					if(player1.y + player1.size > canvas.height){
						player1.y = canvas.height - player1.size;
						distanciaY*=-1;
					}
					if(player1.y - player1.size < 0){
						player1.y = 0 + player1.size;
						distanciaY*=-1;
					}
					checkPlayers_BallCollision();
					if (count==70){
						clearInterval (intervalo)
					}
					
			},20)
			turno=2;
		}
		else if ((turno==2) && (touch==2)){
			distanciaX-=player2.x;
			distanciaY-=player2.y;
			let intervalo=setInterval(function(){
					player2.x-=distanciaX/100;
					player2.y-=distanciaY/100;
					count++;
					if(player2.x + player2.size > canvas.width){
						player2.x = canvas.width - player2.size;
						distanciaX*=-1;
					}
					if(player2.x - player2.size < 0){
						player2.x = 0 + player2.size;
						distanciaX*=-1;
					}
					if(player2.y + player2.size > canvas.height){
						player2.y = canvas.height - player2.size;
						distanciaY*=-1;
					}
					if(player2.y - player2.size < 0){
						player2.y = 0 + player2.size;
						distanciaY*=-1;
					}
					checkPlayers_BallCollision();
					if (count==100){
						clearInterval (intervalo)
					}
					
			},20)
			turno=1;
		}
      canvas.removeEventListener(events.move, onMove);
      canvas.removeEventListener(events.end, onEnd);
    }



  });
}
  function getCoords(e) {
    if (e instanceof TouchEvent) {
      return {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    }
    return {
      x: e.pageX,
      y: e.pageY
    };
  }
  
  canvas.addEventListener('selectstart', function() {
    return false;
  }, true);
// Returns pointer coordinates

var init = requestAnimationFrame(start);
if (screen.orientation.type=="landscape-primary"){
	var player1 = new Player(100,250);
	var player2 = new Player(600,250);
	var ball = new Ball(350,250);
}
else {
	var player1 = new Player(470,200);
	var player2 = new Player(470,1300);
	var ball = new Ball(465,750);
}
function start(){
	clear();
	renderBackground();
	renderGates();
	checkBallBounds();
	moveBall();
	renderPlayers();
	renderBall();
	if (turno==1){
		turnos.style="background-color:red"
	}
	else if (turno==2){
		turnos.style="background-color:blue"
	}
	out.innerHTML = "<p> Player 1 Score: " + player1.score + "</p>" + " <p> Player 2 Score: " + player2.score + "</p>";
	turnos.innerHTML = "<p> Turn of Player " + turno+"</p>";
	requestAnimationFrame(start);
}

function Ball(x,y){
	this.x = x;
	this.y = y;
	this.xVel = 0;
	this.yVel = 0;
	this.decel = 0.1;
	if (screen.orientation.type=="landscape-primary"){
		this.size = 10;
	}
	else{
		this.size = 20;
	}
}
function Player(x,y){
    this.x = x;
	this.y = y;
	if (screen.orientation.type=="landscape-primary"){
		this.size = 20;
	}
	else{
		this.size = 40;
	}
    this.score = 0;
}

function iniciar(){
	canvas.style="display:block;"
	document.getElementById("boton").style="display:none;"
}
function reset(){
	var score1 = player1.score;
	var score2 = player2.score;
	if (screen.orientation.type=="landscape-primary"){
		player1 = new Player(200,250);
		player2 = new Player(600,250);
		ball = new Ball(350,250);
	}
	else{
		player1 = new Player(470,200);
		player2 = new Player(470,1300);
		ball = new Ball(465,750);
	}
	player1.score = score1;
	player2.score = score2;
}

function checkPlayers_BallCollision(){
	var p1_ball_distance = getDistance(player1.x,player1.y,ball.x,ball.y) - player1.size - ball.size;
	if(p1_ball_distance < 0){
		collide(ball,player1);
	}
	var p2_ball_distance = getDistance(player2.x,player2.y,ball.x,ball.y) - player2.size - ball.size;
	if(p2_ball_distance < 0){
		collide(ball,player2);
	}
}

function collide(cir1,cir2){
	var dx = (cir1.x - cir2.x) / (cir1.size);
	var dy = (cir1.y - cir2.y) / (cir1.size);
	cir1.xVel = dx;
	cir1.yVel = dy;
}

function getDistance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function moveBall(){
	if(ball.xVel !== 0){
		if(ball.xVel > 0){
			ball.xVel -= ball.decel;
			if(ball.xVel < 0) ball.xVel = 0;
		} else {
			ball.xVel += ball.decel;
			if(ball.xVel > 0) ball.xVel = 0;
		}
	}
	if(ball.yVel !== 0){
		if(ball.yVel > 0){
			ball.yVel -= ball.decel;
			if(ball.yVel < 0) ball.yVel = 0;
		} else {
			ball.yVel += ball.decel;
			if(ball.yVel > 0) ball.yVel = 0;
		}
	}
	ball.x += ball.xVel;
	ball.y += ball.yVel;
}

function checkBallBounds(){
	if(ball.x + ball.size > canvas.width){
		if(ball.y > 150 && ball.y < 350){
			player1.score++;
			reset();
			return;
		}
		ball.x = canvas.width - ball.size;
		ball.xVel *= -1.5;
	}
	if(ball.x - ball.size < 0){
		if(ball.y > 150 && ball.y < 350){
			player2.score++;
			reset();
			return;
		}
		ball.x = 0 + ball.size;
		ball.xVel *= -1.5;
	}
	if(ball.y + ball.size > canvas.height){
		ball.y = canvas.height - ball.size;
		ball.yVel *= -1.5;
	}
	if(ball.y - ball.size < 0){
		ball.y = 0 + ball.size;
		ball.yVel *= -1.5;
	}
}

function checkPlayersBounds(){
	if(player1.x + player1.size > canvas.width){
		player1.x = canvas.width - player1.size;
		distanciaX*=-1;
	}
	if(player1.x - player1.size < 0){
		player1.x = 0 + player1.size;
		distanciaX*=-1;
	}
	if(player1.y + player1.size > canvas.height){
		player1.y = canvas.height - player1.size;
		distanciaY*=-1;
	}
	if(player1.y - player1.size < 0){
		player1.y = 0 + player1.size;
		distanciaY*=-1;
	}
	if(player2.x + player2.size > canvas.width){
		player2.x = canvas.width - player2.size;
		distanciaX*=-1;
	}
	if(player2.x - player2.size < 0){
		player2.x = 0 + player2.size;
		distanciaX*=-1;
	}
	if(player2.y + player2.size > canvas.height){
		player2.y = canvas.height - player2.size;
		distanciaY*=-1;
	}
	if(player2.y - player2.size < 0){
		player2.y = 0 + player2.size;
		distanciaY*=-1;
	}
}

function renderBall(){
	c.save();
	c.beginPath();
	c.fillStyle = "black";
	c.arc(ball.x,ball.y,ball.size,0,Math.PI*2);
	c.fill();
	c.closePath();
	c.restore();
}

function renderPlayers(){
	c.save();
	c.fillStyle = "red";
	c.beginPath();
	c.arc(player1.x,player1.y,player1.size,0,Math.PI*2);
	c.fill();
	c.closePath();
	c.beginPath();
	c.fillStyle = "blue";
	c.arc(player2.x,player2.y,player2.size,0,Math.PI*2);
	c.fill();
	c.closePath();
	c.restore();
}

function renderGates(){
	c.save();
	c.beginPath();
	if (screen.orientation.type=="landscape-primary"){
		c.moveTo(0,150);
		c.lineTo(0,350);
		c.strokeStyle = "red";
		c.lineWidth = 10;
		c.stroke();
		c.closePath();
		c.beginPath();
		c.moveTo(canvas.width,150);
		c.lineTo(canvas.width,350);
		c.strokeStyle = "blue";
		c.lineWidth = 10;
		c.stroke();
		c.closePath();
	}
	else {
		c.moveTo(275,0);
		c.lineTo(660,0);
		c.strokeStyle = "red";
		c.lineWidth = 20;
		c.stroke();
		c.closePath();
		c.beginPath();
		c.moveTo(275,canvas.height);
		c.lineTo(660,canvas.height);
		c.strokeStyle = "blue";
		c.lineWidth = 20;
		c.stroke();
		c.closePath();
	}
	c.restore();
}

function renderBackground(){
	fondo = new Image()
	if (screen.orientation.type=="landscape-primary"){
		fondo.src="./src/styles/cancha.png";
		c.drawImage (fondo,0,0,700,500);
	}
	else{
		fondo.src="./src/styles/canchaV.png";
		c.drawImage (fondo,0,0,950,1500);
	}
}

function clear(){
	c.clearRect(0,0,canvas.width,canvas.height);
}