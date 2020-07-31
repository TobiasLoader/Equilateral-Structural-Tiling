
let points;
let depth;
let cols;
let pointHold;


// DRAG 0 Points to see it change

function setup() {
	W = window.innerWidth;
	H = window.innerHeight;
	canvas = createCanvas(W, H);
	points = [[{x:W/2-3*W/10,y:H-H/20},{x:W/2-2*W/10,y:H-H/10},{x:W/2-W/10,y:H-95*H/1000},{x:W/2,y:H-110*H/1000},{x:W/2+W/10,y:H-95*H/1000},{x:W/2+2*W/10,y:H-H/10},{x:W/2+3*W/10,y:H-H/20}]];
	depth = 7;
	pointHold = -1;
	textFont('Avenir Next',18);
	textAlign(CENTER,CENTER);
	
	cols = [color(214, 102, 94),color(214, 164, 94),color(194, 214, 94),color(130, 214, 94),color(94, 214, 122),color(94, 214, 196),color(94, 164, 214),color(94, 98, 214)];
	drawNetwork();
}


function drawNetwork(){
	background(255);
	textInfo();
	for (var level=0; level<depth; level+=1){
		points.push(nextRow());
	}

	
	strokeWeight(2);
	for (var level=0; level<depth-1; level+=1){
		for (var i=0; i<points[level].length-1; i+=1){
			stroke(cols[level])
			line(points[level][i].x,points[level][i].y,points[level][i+1].x,points[level][i+1].y);
			line(points[level][i].x,points[level][i].y,points[level+1][i].x,points[level+1][i].y);
		}
		for (var i=1; i<points[level].length; i+=1){
			stroke(cols[level])
			line(points[level][i].x,points[level][i].y,points[level+1][i-1].x,points[level+1][i-1].y);
		}
		
		for (var i=0; i<points[level].length-1; i+=1){
			fill(red(cols[level]),green(cols[level]),blue(cols[level]),50)
			triangle(points[level][i].x,points[level][i].y,points[level][i+1].x,points[level][i+1].y,points[level+1][i].x,points[level+1][i].y);
// 			line(points[level][i].x,points[level][i].y,points[level+1][i].x,points[level+1][i].y);
		}
	}
	
	textAlign(CENTER,CENTER);
	textSize(18);
	for (var level=0; level<depth; level+=1){
		for (var i=0; i<points[level].length; i+=1){
			fill(255);
			if (level){
				strokeWeight(1);
				stroke(50,50,50,150);
			} else {
				strokeWeight(2);
				stroke(50,50,50,200);
			}
			ellipse(points[level][i].x,points[level][i].y-2,30,30);
			fill(30);
			noStroke();
			text(level, points[level][i].x,points[level][i].y);
		}
	}
}

function textInfo(){
	fill(50);
	textSize(14);
	textAlign(LEFT,BASELINE);
	text("Drag points on the bottom layer (layer 0) and observe how the network behaves.\n\nPress the up and down arrow keys to add or remove layers from the network.\n\nEach layer is built from successive equilateral triangles. The central points on layer 0 are the most sensitive, whilst the points farthest away from the center are least sensitive.\n\nThe behavior of the system is chaotic, however the system itself it completely determistic and depends solely on the initial state of the zero'th layer.",50,50,270);
	textAlign(CENTER,CENTER);
	textSize(15);
	text("DRAG  POINTS  MARKED  WITH  A  ZERO",W/2,H-40*H/1000);
}

function newPoint(P1,P2){
// 	let D = -abs(P2.x-P1.x)/(P2.x-P1.x);
	
	return {x:0.5*(P1.x+P2.x+sqrt(3)*/* D* */(P2.y-P1.y)),y:0.5*(P1.y+P2.y+sqrt(3)*/* D* */(P1.x-P2.x))};
}

function nextRow(){
	let row = [];
	for (var i=0; i<points[points.length-1].length-1; i+=1){
		row.push(newPoint(points[points.length-1][i],points[points.length-1][i+1]));
	}
	return row;
}

function draw(){
	cursor('default');
	for (var i=0; i<points[0].length; i+=1){
		if (dist(mouseX,mouseY,points[0][i].x,points[0][i].y)<15){
			cursor('pointer');
		}	
	}
	
	if (pointHold!==-1){
		points[0][pointHold].x = mouseX;
		points[0][pointHold].y = mouseY;
		drawNetwork();
	}
}

window.onresize = function() {
  resizeCanvas(windowWidth, windowHeight);
  W = windowWidth;
  H = windowHeight
};

function mouseDragged(){
	points = [points[0]];
	for (var i=points[0].length-1; i>=0; i-=1){
		if (dist(mouseX,mouseY,points[0][i].x,points[0][i].y)<15 && pointHold===-1){
			pointHold = i;
		}	
	}
}

function keyPressed(){
	if (keyIsDown(DOWN_ARROW) && depth>1){
		depth -= 1;
		drawNetwork();
	}
	
	if (keyIsDown(UP_ARROW) && depth<points[0].length){
		depth += 1;
		drawNetwork();
	}
}

function mouseReleased(){
	pointHold = -1;
}