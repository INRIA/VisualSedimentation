var canvas;
var tooltipOpen=true;
var Width  = 960;
var Height = 400;
var delta = [0, 0];
var stage = [195, 250, 1150, 835]   //     bottom
var b2bod = [];

var worldAABB, world, iterations = 1, timeStep = 1 / 20;

var walls = [];
var wall_thickness = 20;
var wallsSetted = false;

var bodies, elements, text;

var createMode = false;
var destroyMode = false;

var emptyBottom = true;

var isFreezing = false;
var refLoop, refFileAttente;

var isMouseDown = false;
var isMouseDragging = false;
var isMouseDragging2 = true;
var mouseJoint;
var mouse = { x: 0, y: 0 };
var gravity = { x: 0, y: 0.3 };

var PI2 = Math.PI * 2;

var timeOfLastTouch = 0;
var tweetSilos = [];

init();
play();

function init() {

	worldAABB = new b2AABB();
	worldAABB.minVertex.Set( -200, -200 );
	worldAABB.maxVertex.Set( window.innerWidth + 200, window.innerHeight + 200 );

	world = new b2World( worldAABB, new b2Vec2( 0, 0 ), true );

	setWalls();
	reset();
}


function play() {

  if(!isFreezing)
    refLoop = setInterval( loop, 1000 / 40 );
 else
    clearInterval(refLoop);
    
  isFreezing = !isFreezing;
}

function reset() {

	if(bodies) {
		for (var i= 0; i < bodies.length; i++ ) {
			var body = bodies[ i ]
			canvas.removeChild( body.GetUserData().element );
			world.DestroyBody( body );
			body = null;
		}
	}
	bodies = [];
	elements = [];
}

function loop() {

	delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;
	world.m_gravity.x = gravity.x * 350 + delta[0];
	world.m_gravity.y = gravity.y * 350 + delta[1];

	world.Step(timeStep, iterations);

	for (i = 0; i < bodies.length; i++) {
		var body = bodies[i];
		var element = elements[i];
		element.style.left = (body.m_position0.x - (element.width >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (element.height >> 1)) + 'px';
	}
}

function createBox(world, x, y, width, height, fixed) {

  var c=document.createElement('canvas');
  var ctx=c.getContext("2d");
  ctx.fillStyle="#FF0000";
  ctx.fillRect(0,0,1500,750);

	if (typeof(fixed) == 'undefined') {
		fixed = true;
	}

	var boxSd = new b2BoxDef();

	if (!fixed) {
		boxSd.density = 1.0;
	}

	boxSd.extents.Set(width, height);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);

	return world.CreateBody(boxBd);
}



function getBodyAtMouse() {

	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouse.x, mouse.y);

	var aabb = new b2AABB();
	aabb.minVertex.Set(mouse.x - 1, mouse.y - 1);
	aabb.maxVertex.Set(mouse.x + 1, mouse.y + 1);

	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = new Array();
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;

	for (var i = 0; i < count; ++i) {
		if (shapes[i].m_body.IsStatic() == false) {
			if ( shapes[i].TestPoint(mousePVec) ) {
				body = shapes[i].m_body;
				break;
			}
		}
	}
	return body;
}

function setWalls() {

	if (wallsSetted) {
		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);
		walls[0] = null; 
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
	} else {
    
    walls[0] = createBox(world, 1880, 900, wall_thickness, 900); //  rightmost wall
    walls[1] = createBox(world, 1510, 600, wall_thickness, 300); //  wall 4 / 3
   
    walls[2] = createBox(world, 1130, 600, wall_thickness, 300); //  wall 3 / 2
    walls[3] = createBox(world, 760, 600, wall_thickness, 300); //   wall 2 / 1
    walls[4] = createBox(world, 390, 600, wall_thickness, 300); //   leftmostwall   
   
    walls[5] = createBox(world, 580, 600, 170, 10); //  4    
    walls[6] = createBox(world, 950, 750, 170, 10); //  3   
    walls[7] = createBox(world, 1320, 750, 170, 10); //  2   
    walls[8] = createBox(world, 1690, 600, 170, 10); //  1   
    
    setInterval(function() {
    
      // Check if div podiums are already loaded
      if($('#podium div').size() > 0) {
        
        $('#podium div').each( function(idx, panel) {
       
          var idxWall = 5+idx;
          var yWall = 920-$(this).height();
          world.DestroyBody(walls[idxWall]);
          walls[idxWall] = createBox(world, 580+370*idx, yWall, 170, 10);      
        
        });
      }
    }, 1000);
  }
}

function  createBallTweetForce(t) {

	var element = document.createElement( 'div' );
	element.width = 96;
	element.height = 96;	
	element.style.position = 'absolute';
	element.style.left = -200 + 'px';
	element.style.top = -200 + 'px';
	element.style.cursor = "default";
  element.style.hover = "red";
	element.id = t.id_str;
  
  var id = "tweet_"+bodies.length;
  var canvas = document.getElementById('canvas');
	canvas.appendChild(element);
	elements.push( element );

  BALL_SIZE = 150;
  
  var circle = document.createElement('canvas');
  circle.width = 96;
  circle.height = 96;

  var offset = (48 - BALL_SIZE)/2;
  
  var graphics = circle.getContext('2d');
  graphics.fillStyle = "white";
  graphics.beginPath();
  graphics.arc(BALL_SIZE* .25+10, BALL_SIZE* .25, BALL_SIZE* .25, 0, PI2, true); 
  graphics.closePath();
  graphics.fill();
    
  graphics.fillStyle = "#E2F0D6";
  graphics.beginPath();
  graphics.arc(BALL_SIZE * .5 +offset+24, BALL_SIZE * .5+offset+14, BALL_SIZE * .20, 0, PI2, true);
  graphics.closePath();
  graphics.fill();
  
  var img = new Image();
  img.src = t.profile_image_url;

  img.onload = function(){

    // Resize image
    var canvasCopy = document.createElement("canvas");
    var copyContext = canvasCopy.getContext("2d");
    canvasCopy.width = 96;
    canvasCopy.height = 96;
    copyContext.drawImage(img, 0, 0, 96, 96);

    var ptrn = graphics.createPattern(canvasCopy,'no-repeat');
    graphics.fillStyle = ptrn;
    graphics.fill(-5,0,150,150);
  }
  
	element.appendChild(circle);

	var circle = new b2CircleDef();
	circle.radius = BALL_SIZE/4+2 ;
	circle.density = 1;
	circle.friction = 0.3;
	circle.restitution = 0.3;

  var a, b, xpos, ypos;

  switch (t.cat) { 
    case 0: // 1
      a = 250;
      b = -100;
      xpos = 40;
      ypos = 250;
      break; 
    case 1: // 2
      a = 250;
      b = -150;
      xpos = 40;
      ypos = 70;      
      break; 
    case 2: // 3
      a = 290;
      b = -180;
      xpos = 40;
      ypos = 100;    
      break; 
    case 3: // 4
      a = 400;
      b = -180;
      xpos = 40;
      ypos = 150;      
      break;     
    default:
      a = 390;
      b = -180;
      xpos = 40;
      ypos = 70;      
      console.log("DEFAULT IMPULS PARAMS! Should not be there..");
      break; 
  }

  var b2body = new b2BodyDef();  
	b2body.AddShape(circle);
	b2body.userData = {element: element};
	b2body.position.Set( xpos, ypos);
  
  b2body.linearVelocity.Set(a, b);
  b2bod[t.id_str] = world.CreateBody(b2body);
  console.log("created " + t.id_str)
	bodies.push(b2bod[t.id_str]);	

	$("#"+t.id_str).mouseover(function() {
	    var _of = $(this).offset();
	    $(this).css({
	        "cursor": "pointer"
	    });
	    showTooltip(t, _of.left, _of.top);  
	}).mouseout(hideTooltip).click(function() {
        addTweetToSelection($("#btv-tooltip"));
	    $(this).fadeTo(100,.25, function() {
	        $(this).fadeTo(100,1);
	        showControlPanel();
	    })
	});
   
/*  $("#"+t.id_str).click(function() {
		if(!isMouseDragging) {
            fancyBoxTwitter(t.from_user, (t.candidats && t.candidats.length ? candidats[t.candidats[0]].couleur : '#666699'));
//      window.open("https://twitter.com/#!/"+t.from_user+"/status/"+t.id_str);
    }
  });   */
}