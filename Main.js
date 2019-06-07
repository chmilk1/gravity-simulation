// Reference to canvas context
var ctx = false;

// Update frequency
var fHz = 1000/60;

// Array of debris
var debris = [];

// Array of planets
var planets = [];

// Box2D World
var world = null;

// Pixel-to-Meter ratio
var PTM_RATIO = 30.0;

// Current mouse position
var mousePos = null;

// Position of the mouse on mousedown event
var startMousePos = null;

var mouseHold =  false;

var hold = 0;

var destroy_list = [];

var mouseGavity = [];



/*
 * reset
 * Resets the demo.
 */
function reset() {
	for ( var i = 0; i < debris.length; i++ ) {
		world.DestroyBody(debris[i]);
	}
	for ( var j = 0; j < planets.length; j++ ) { 		
		world.DestroyBody(planets[j]);
		}
	planets = [];	
	createPlanets();
	debris = [];
	startMousePos = null;
}

/*
 * createDebris
 * Create debris at the position pos with linear velocity defined
 * by v.
 */



function createDebris(pos, v, r) {
	var b = newPlanet(p2b(pos.x), p2b(pos.y), p2b(r), r*0.1, 140);
	b.SetLinearVelocity(v);
	debris.push(b);
}



/*
 * newPlanet
 * x - x coord
 * y - y coord
 * r - radius
 * g - gravitational force
 * gf - gravity factor; multiplied by r to get the reach of
 *		the gravitational force.
 */
 
function newPlanet(x, y, r, g, gf) {
	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.1;
	fixDef.restitution = 0;
	fixDef.damping = 0.1;
	

	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	
	bodyDef.fixedRotation = false;
	fixDef.shape = new b2CircleShape(r);
	//fixDef.shape.SetAsBox(r , r );
	
	fixDef.isSensor = false;

	bodyDef.position.x = x;
	bodyDef.position.y = y;

	bodyDef.userData = {gravity: g,
						radius: r,
						gravity_factor: gf};

	var b = world.CreateBody(bodyDef);;
	b.CreateFixture(fixDef);
	
	return b;
}

/*
 * createPlanets
 */
function createPlanets(){
	
	var planet1 = newPlanet(p2b(150), p2b(200), p2b(30), 10, 4);
	planets.push(planet1);
	
	var planet2 = newPlanet(p2b(350), p2b(200), p2b(50), 13, 3.5);
	planets.push(planet2);
}

/*
 * update
 * Clears the canvas and calls the update and draw
 * function of elements in the explosions list.
 */
function update() {

	// Update the world simulation
	world.Step(
		  1 / 60,   //frame-rate
		  10,       //velocity iterations
		  10        //position iterations
	);
	
	world.ClearForces();
	var counter = 0;
	// Draw debug data on the canvas
	//world.DrawDebugData();
	ctx.rect(0, 0, canvas.width, canvas.height);
	//ctx.fillStyle = getColor(currentcolor);
	ctx.fill();	
	for ( var i = 0; i < debris.length; i++ ) {
		var debris_position = debris[i].GetWorldCenter();

		var ud = debris[i].GetUserData()
		var radius = b2p(ud.radius);
	
	  ctx.save();
	  //ctx.strokeStyle = 'rgba(0,0,255,1)';
	  //ctx.strokeStyle = "rgba(1, 1, 1, 0)";

	  //ctx.fillStyle = '#7733AA';
	  ctx.fillStyle = randomColor(i) ;

	  ctx.beginPath();
	  ctx.lineWidth = 0;
	  ctx.arc(b2p(debris_position.x), b2p(debris_position.y), radius, 0, 2 * Math.PI);		
	  ctx.fill();
	  ctx.restore();
		
		for ( var j = 0; j < debris.length; j++ ) {
			if(j != i && debris[i]!= debris[j]) {
			var planet_position = debris[j].GetWorldCenter();
			var planet_data = debris[j].GetUserData();
			// Vector that is used to calculate the distance
			// of the debris to the planet and what force
			// to apply to the debris.
			var planet_distance = new b2Vec2(0,0);
			
			// Add the distance to the debris
			planet_distance.Add(debris_position);
			// Subtract the distance to the planet's position
			// to get the vector between the debris and the planet.
			planet_distance.Subtract(planet_position);
			
			// Calculate the magnitude of the force to apply to the debris.
			// This is proportional to the distance between the planet and 
			// the debris. The force is weaker the further away the debris.
			var force = (planet_data.gravity * debris[i].GetMass()) / Math.pow(planet_distance.Length(), 2);

			//if ( planet_distance.Length() <= planet_data.radius/2) {
				//debris[i]= undefined;
               // debris[i].radius += debris[j].radius;
               
			 //   world.DestroyBody(debris[j]);
			 
                
            //}
			//else 
                if ( planet_distance.Length() < planet_data.radius  * planet_data.gravity_factor *.1) {
				//debris[i]= undefined;
                //world.DestroyBody(debris[i]);
                //var force = (planet_data.gravity * debris[i].GetMass()) / Math.pow(planet_distance.Length(), 2);

				// Multiply the magnitude of the force to the directional vector.
				planet_distance.Multiply(force);

				debris[i].ApplyForce(planet_distance, 
									 debris[i].GetWorldCenter());
				// Draw gravitational force on the debris
				/*ctx.save();
				ctx.strokeStyle = 'rgba(0,0,255,1)';
				ctx.lineWidth = 1;
		
				ctx.beginPath();
		
				ctx.moveTo(b2p(debris_position.x), b2p(debris_position.y));
				ctx.lineTo(b2p(debris_position.x) + b2p(planet_distance.x), 
						   b2p(debris_position.y) + b2p(planet_distance.y));
				ctx.stroke();
		
				ctx.fill();
				ctx.restore();
				*/
			}
			// Check if the distance between the debris and the planet is within the reach
			// of the planet's gravitational pull.
			else if ( planet_distance.Length() < planet_data.radius * planet_data.gravity_factor) {
				// Change the direction of the vector so that the force will be
				// towards the planet.
				planet_distance.NegativeSelf();
				
				// Multiply the magnitude of the force to the directional vector.
				planet_distance.Multiply(force)
				debris[i].ApplyForce(planet_distance, 
									 debris[i].GetWorldCenter());
				
				/*// Draw gravitational force on the debris
				ctx.save();
				ctx.strokeStyle = 'rgba(0,0,255,1)';
				ctx.lineWidth = 1;
		
				ctx.beginPath();
		
				ctx.moveTo(b2p(debris_position.x), b2p(debris_position.y));
				ctx.lineTo(b2p(debris_position.x) + b2p(planet_distance.x), 
						   b2p(debris_position.y) + b2p(planet_distance.y));
				ctx.stroke();
		
				ctx.fill();
				ctx.restore();
			*/
			}
		}
		
		// for ( var j = 0; j < debris.length; j++ ) {


		// }
		/*
		// Draw linear velocity for the debris
		ctx.save();
		ctx.strokeStyle = 'rgba(255,0,0,1)';
		ctx.lineWidth = 1;

		ctx.beginPath();
		var linear_velocity = debris[i].GetLinearVelocity();
		ctx.moveTo(b2p(debris_position.x), b2p(debris_position.y));
		ctx.lineTo(b2p(debris_position.x) + b2p(linear_velocity.x), 
				   b2p(debris_position.y) + b2p(linear_velocity.y));
		ctx.stroke();

		ctx.fill();
		ctx.restore();
			*/
	}


  	}

  	// Draw gravitational field of each planet
  	for ( var j = 0; j < 0; j++ ) {
  		var ud = debris[j].GetUserData()
  		var radius = b2p(ud.radius) * ud.gravity_factor;
  		var planet_position = debris[j].GetWorldCenter();
  		ctx.save();
  		ctx.beginPath();
      	ctx.arc(b2p(planet_position.x), b2p(planet_position.y), radius, 0, 2 * Math.PI, false);
      	//ctx.fillStyle = 'rgba(240,240,240,0.3)';
		//ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#666666';
		ctx.stroke();
		ctx.restore();
	}

	/*// Draw firing vector of debris
	if ( startMousePos ) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'rgba(181,201,200,0.5)';
		ctx.strokeStyle = '#CCCCCC'
		ctx.lineWidth = 1;
		ctx.rect(startMousePos.x-9, startMousePos.y-9, 18, 18);
		ctx.fill();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = '#FF0000';
		ctx.moveTo(startMousePos.x, startMousePos.y);
		ctx.lineTo(mousePos.x, mousePos.y);
		ctx.stroke();
		ctx.restore();
	}
*/
	
	}

/*
 * The init function called when the page loads.
 * It setup up the event listener for mouseup
 * events and sets the interval to call the update
 * function.
 */
function init(){
	//
	// Create the box2d world
	//
	
	
	world = new b2World(
						new b2Vec2(0, 0),   //gravity is zero in space
						true                //allow sleep
					   );
	
	//
	// Configure debug draw
	//
	//setDebugDraw(world);
	
	var canvas = document.getElementById('canvas');
	canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete
    canvasW = canvas.width;
    canvasH = canvas.height;
	ctx = canvas.getContext('2d');
	
	DebrisSet();

	//canvas.addEventListener('click', function(e) {
	canvas.addEventListener('mouseup', function(e) {
		// The mouse position of the event
		mousePos = getMousePos(e, this);
		var endMousePos = mousePos.Copy();
		
		startMousePos = mousePos;
		
		var linear_velocity = new b2Vec2(0,-1 - hold);
			createDebris(mousePos, linear_velocity, 2);
			startMousePos = null;
				mouseHold = false;
				hold = 0;
		

		
	}, false);

	canvas.addEventListener('mousedown', function(e) {
		// The mouse position of the event
		mousePos = getMousePos(e, this);
		mouseHold = true;
		CallEvent();
		
		
	}, false);
	
	canvas.addEventListener('mousemove', function(e) {
		// The mouse position of the event
		mousePos = getMousePos(e, this);
	}, false);
	
	// The reset button.
	// var button = document.getElementById('reset_btn');
	// button.addEventListener('click', 
	// 						function(e) { reset(); }, 
	// 						false);
	
	//createPlanets();
	
	//
	// Create an interval that calls the update function 60 times a second
	//
	window.setInterval(update, fHz);
}

function CallEvent()
{
 if(mouseHold)
 {
   // do whatever you want
   // it will continue executing until mouse is not released
	hold++;

   setTimeout("CallEvent()",100);
 }
}

function DebrisSet()
{
	for(var i=0; i <1 ; i++) {
	var pos = new b2Vec2(Math.random() * 300+200, Math.random() * 200+200);
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
	//console.log(pos);
	
	var linear_velocity = new b2Vec2(Math.random() * plusOrMinus,Math.random() * plusOrMinus);
	//var linear_velocity = new b2Vec2(0, 0);

	
	//createDebris(pos, linear_velocity, 4);
	}
	for(var i=0; i < 700; i++) {
		
            var x = Math.random() * 600 + 300;
            var y = Math.random() * 500 + 100;
			var pos = new b2Vec2(x, y);
			
		
	var plusOrMinus = (Math.random() < 0.5 ? -1 : 1) * 30;
	//console.log(pos);
	var linear_velocity = new b2Vec2(0, 0);
    var velocity =6;
	var linear_velocity = new b2Vec2((Math.random()  * plusOrMinus,Math.random() * plusOrMinus)*.15);
	// if(x> 550 && y > 350)
    //      linear_velocity = new b2Vec2(0, -velocity);
    // else if(x < 550 && y < 350)
    //      linear_velocity = new b2Vec2(0, velocity);
	// else if(x > 550 && y < 350)
    //      linear_velocity = new b2Vec2(-velocity, 0);
    //  else
    //      linear_velocity = new b2Vec2(velocity, 0);

	createDebris(pos, linear_velocity, Math.random()*2);
	}
}

function getRndColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function randomColor(seed) {
    var r = Math.sin(seed) * 255;
	var g = Math.sin(seed*2) * 255;
	var b = Math.sin(seed*3) * 255;
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}