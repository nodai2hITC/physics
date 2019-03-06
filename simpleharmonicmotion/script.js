
/* -- Main -- */

var manifest = [
	{ id: "ball", src: "ball.png" },
	{ id: "bane", src: "bane.png" },
];

var stage;
var ball1, ball2, bane;
var shape, circle;
var running = true;
var running2 = true;
var theta = 0;
var old_phi, phi = 0;
var tap_x = 0;
var buttons = [];

function reset_(){
	running = true;
	theta = 0;
	old_phi = 0;
	phi = 0;
	tap_x = 0;
}

function init(){}

function exec(){
	if (running){
		theta += 0.04;
	}
	var x = Math.cos(theta) * 250 * Math.cos(phi) + 400;
	ball1.x = x;
	ball1.scaleX = ball1.scaleY = Math.cos(theta) * Math.sin(phi) * 0.5 + 1.0;
	var y = -Math.sin(theta) * 250 + 300;
	ball1.y = ball2.y = y;
	var g = bane.graphics;
	g.clear();
	g.setStrokeStyle(3).beginStroke("#000").moveTo(0, 0);
	for(var i=0; i<20; i++){
		g.lineTo(20, (y+120)*(i*4+1)/80-120).lineTo(-20, (y+120)*(i*4+3)/80-120).lineTo(0, (y+120)*(i*4+4)/80-120);
	}
	circle.graphics.clear();
	circle.graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
	circle.graphics.setStrokeStyle(1);
	circle.graphics.drawEllipse(-250 * Math.cos(phi),-250,500 * Math.cos(phi),500);
	circle.graphics.endStroke();
	
	g = vector_shape.graphics;
	g.clear();
	if (document.getElementById("velocity_vector").checked){
		var v = 160;
		var vx = -Math.sin(theta) * v * Math.cos(phi);
		var vy = -Math.cos(theta) * v;
		v = Math.sqrt(vx*vx + vy*vy);
		
		if (document.getElementById("line").checked){
			g.setStrokeStyle(1).beginStroke("#999").moveTo(0, y).lineTo(960, y);
			g.setStrokeStyle(1).beginStroke("#999").moveTo(0, y+vy).lineTo(960, y+vy);
		}
		g.setStrokeStyle(5).beginStroke("#00f").moveTo(x, y);
		g.lineTo(x + vx, y + vy).moveTo(x + vx + 1.42 * vx/v - 1.42 * vy/v, y + vy + 1.42 * vx/v + 1.42 * vy/v);
		g.lineTo(x + vx - 14.2 * vx/v + 14.2 * vy/v, y + vy - 14.2 * vx/v - 14.2 * vy/v);
		g.moveTo(x + vx, y + vy);
		g.lineTo(x + vx - 14.2 * vx/v - 14.2 * vy/v, y + vy + 14.2 * vx/v - 14.2 * vy/v);
		
		var x2 = ball2.x;
		vx = 0;
		v = Math.abs(vy);
		if (v>1 || v<-1){
			g.moveTo(x2, y);
			g.lineTo(x2 + vx, y + vy).moveTo(x2 + vx + 1.42 * vx/v - 1.42 * vy/v, y + vy + 1.42 * vx/v + 1.42 * vy/v);
			g.lineTo(x2 + vx - 14.2 * vx/v + 14.2 * vy/v, y + vy - 14.2 * vx/v - 14.2 * vy/v);
			g.moveTo(x2 + vx, y + vy);
			g.lineTo(x2 + vx - 14.2 * vx/v - 14.2 * vy/v, y + vy + 14.2 * vx/v - 14.2 * vy/v);
		}
	}
	if (document.getElementById("acceleration_vector").checked){
		var a = 120;
		var ax = -Math.cos(theta) * a * Math.cos(phi);
		var ay = Math.sin(theta) * a;
		a = Math.sqrt(ax*ax + ay*ay);
		
		if (document.getElementById("line").checked){
			g.setStrokeStyle(1).beginStroke("#999").moveTo(0, y).lineTo(960, y);
			g.setStrokeStyle(1).beginStroke("#999").moveTo(0, y+ay).lineTo(960, y+ay);
		}
		g.setStrokeStyle(8).beginStroke("#f00").moveTo(x, y);
		g.lineTo(x + ax, y + ay).moveTo(x + ax + 2.84 * ax/a - 2.84 * ay/a, y + ay + 2.84 * ax/a + 2.84 * ay/a);
		g.lineTo(x + ax - 14.2 * ax/a + 14.2 * ay/a, y + ay - 14.2 * ax/a - 14.2 * ay/a);
		g.moveTo(x + ax, y + ay);
		g.lineTo(x + ax - 14.2 * ax/a - 14.2 * ay/a, y + ay + 14.2 * ax/a - 14.2 * ay/a);
		
		var x2 = ball2.x;
		ax = 0;
		a = Math.abs(ay);
		if (a>1 || a<-1){
			g.moveTo(x2, y);
			g.lineTo(x2 + ax, y + ay).moveTo(x2 + ax + 2.84 * ax/a - 2.84 * ay/a, y + ay + 2.84 * ax/a + 2.84 * ay/a);
			g.lineTo(x2 + ax - 14.2 * ax/a + 14.2 * ay/a, y + ay - 14.2 * ax/a - 14.2 * ay/a);
			g.moveTo(x2 + ax, y + ay);
			g.lineTo(x2 + ax - 14.2 * ax/a - 14.2 * ay/a, y + ay + 14.2 * ax/a - 14.2 * ay/a);
		}
	}
	stage.update();
}

function start(){
	stage = new createjs.Stage("stage");
	
	shape = new createjs.Shape();
	stage.addChild(shape);
	shape.x = 0;
	shape.y = 0;
	shape.graphics.beginFill(createjs.Graphics.getRGB(255,255,255));
	shape.graphics.drawRect(0,0,960, 600);
	shape.graphics.endFill();
	
	bane = new createjs.Shape();
	bane.x = 800;
	bane.y = 0;
	stage.addChild(bane);
	
	ball1 = new createjs.Bitmap("ball.png");
	ball1.regX = ball1.image.width  / 2;
	ball1.regY = ball1.image.height / 2;
	ball1.x = 400;
	ball1.y = 300;
	
	ball2 = ball1.clone();
	ball2.x = 800;
	stage.addChild(ball2);
	
	stage.addChild(ball1);
	
	circle = new createjs.Shape();
	stage.addChild(circle);
	circle.x = 400;
	circle.y = 300;
	circle.graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
	circle.graphics.setStrokeStyle(1);
	circle.graphics.drawEllipse(-250,-250,500,500);
	circle.graphics.endStroke();
	circle.visible = false;
	
	vector_shape = new createjs.Shape();
	stage.addChild(vector_shape);
	vector_shape.x = 0;
	vector_shape.y = 0;
	
	buttons.push(add_image("stopbutton.png", { regX: 0, regY: 0, x: 8 , y: 540,
		images: [(new createjs.Bitmap("startbutton.png")).image,
		         (new createjs.Bitmap( "stopbutton.png")).image],
		onMouseDown: function(evt){
			running2 = !running2;
			running = running2;
			this.image = running ? this.images[1] : this.images[0];
		}
	}));
	
	shape.on("mousedown", function(evt){
		tap_x = evt.stageX;
		old_phi = phi;
		circle.visible = true;
		running = false;
	});
	
	shape.on("pressmove", function(evt){
		phi = old_phi + 1.0 * (evt.stageX - tap_x) / 300;
	});
	shape.on("pressup", function(evt){
		circle.visible = false;
		running = running2;
	});
	reset_();
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(60);
	stage.mouseMoveOutside = true;
	
	stage.update();
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", exec);
}

function add_object(object, hash){
	for(var i in hash){
		if (i.match(/^on(MouseDown|PressMove|PressUp|DblClick)$/)){
			object.on(RegExp.$1.toLowerCase(), hash[i]);
		} else if (i.match(/^on(Change)$/)){
			object.on(RegExp.$1.toLowerCase(), hash[i], this);
		}
		object[i] = hash[i];
	}
	stage.addChild(object);
	return object;
}
function add_image(filename, hash){
	return add_object(new createjs.Bitmap(filename), hash);
}
function add_text(text, font, color, hash){
	return add_object(new createjs.Text(text, font, color), hash);
}
function add_shape(hash){
	return add_object(new createjs.Shape(), hash);
}
function add_slider(min, max, width, height, hash){
	return add_object(new Slider(min, max, width, height), hash);
}


/* -- init -- */
window.addEventListener("load", function(){
	init();
	if (manifest.length == 0){
		start();
	} else {
		preload = new createjs.LoadQueue(false);
		preload.loadManifest(manifest);
		preload.on("complete", start);
	}
}, false);
