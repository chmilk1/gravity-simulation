var b2Vec2 = Box2D.Common.Math.b2Vec2
  , b2AABB = Box2D.Collision.b2AABB
  ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
  ,	b2Body = Box2D.Dynamics.b2Body
  ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  ,	b2Fixture = Box2D.Dynamics.b2Fixture
  ,	b2World = Box2D.Dynamics.b2World
  ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
  ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
  , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
  , b2Shape = Box2D.Collision.Shapes.b2Shape
  , b2Joint = Box2D.Dynamics.Joints.b2Joint
  , b2Settings = Box2D.Common.b2Settings
  , b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController
  , b2ContactListener = Box2D.Dynamics.b2ContactListener;
  ;
  
/*
 * Converts from degrees to radians.
 */
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

/*
 * Converts from radians to degrees.
 */
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

/*
 * randomFloat
 * Augments the Math library with a function
 * to generate random float values between
 * a given interval.
 */
Math.randomFloat = function(min, max){
	return min + Math.random()*(max-min);
};

/*
 * Normalize2
 * Returns the normal of the vector b.
 */
function Normalize2(b) {
	return Math.sqrt(b.x * b.x + b.y * b.y);
}

//-----------------------------
 // Converts from radians to degrees.
 Math.degrees = function(radians) {
   return radians * 180 / Math.PI;
 };
 
//-----------------------------
 // Returns the determinant for two two-dimensional vectors
 Math.determinant = function(v1,v2){
 	return v1.x * v2.y - v1.y * v2.x;
 };
 
//-----------------------------
 // Returns the dot products of two two-dimensional vectors
 Math.dot = function(v1, v2){
 	return v1.x * v2.x + v1.y*v2.y;
 };
 
//-----------------------------
 // Returns the magnitude of a vector
 Math.magnitude = function(v1){
 	return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
 };
 
//-----------------------------
 Math.vectorAngle = function(v1, v2){
 	var dot_prod = Math.dot(v1, v2);
 	//console.log("dot_prod: " + dot_prod);
 	var cross_prod = Math.determinant(v1,v2);
 	//console.log("cross_prod: " + cross_prod);
 	var v1_mag = Math.magnitude(v1);
 	//console.log("v1_mag: " + v1_mag);
 	var v2_mag = Math.magnitude(v2);
 	//console.log("v2_mag: " + v2_mag);
 	var tmp = dot_prod/(v1_mag * v2_mag);
 	var angle = Math.acos(tmp.toPrecision(4)); // rounding errors seem to make this >1 or <-1 sometimes..
 	
 	return cross_prod < 0 ? angle * -1 : angle;
 };
 
//-----------------------------
 Math.arcLength = function(radians, radius){
 	return radians * radius;
 };

/*
 * p2b
 * Helper function to convert pixels to 
 * Box2D metrics.
 */
function p2b(pixels) {
	return pixels / PTM_RATIO;
}

function b2p(meters) {
	return meters * PTM_RATIO;
}

/*
 * setDebugDraw
 * Configure the Box2D debug draw.
 */
function setDebugDraw(w){
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	debugDraw.SetDrawScale(PTM_RATIO); // Set draw scale
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	
	// set debug draw to the world
	w.SetDebugDraw(debugDraw); 
}

/*
 * createBox
 * Create a box of a given size and type
 * at the position x and y.
 */
function createBox(w, h, x, y, type){
	// Create the fixture definition
	var fixDef = new b2FixtureDef;
	
	fixDef.density = 1.0;	// Set the density
	fixDef.friction = 1.0;	// Set the friction
	fixDef.restitution = 0.1;	// Set the restitution - bounciness 
	
	// Define the shape of the fixture
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(
				   w // input should be half the width
				 , h // input should be half the height
	);
    
    // Create the body definition
	var bodyDef = new b2BodyDef;
	bodyDef.type = type;
	
	// Set the position of the body
	bodyDef.position.x = x;
	bodyDef.position.y = y;
   
	// Create the body in the box2d world
	var b = world.CreateBody(bodyDef);
	b.CreateFixture(fixDef);
   
	return b;
}

/*
 * getMousePos
 * Returns mouse position of an event within src_elem
 */
function getMousePos(event, src_elem){
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var x_pos = 0;
	var y_pos = 0;
	var currElement = src_elem;

	// IE, Chrome
	if ( event.offsetX !== undefined && event.offsetY !== undefined ) {
		x_pos = event.offsetX;
		y_pos = event.offsetY;
	}

	// Firefox
	else {
		do{
			totalOffsetX += currElement.offsetLeft - currElement.scrollLeft;
			totalOffsetY += currElement.offsetTop - currElement.scrollTop;
		}
		while(currElement = currElement.offsetParent)

		x_pos = event.pageX - totalOffsetX - document.body.scrollLeft; 
		y_pos = event.pageY - totalOffsetY - document.body.scrollTop;
	}
	
	return new b2Vec2(x_pos, y_pos);
}
