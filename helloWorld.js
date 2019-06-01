


var gravity = new lf.b2Vec2(0,-10);
var world = new lf.b2World(gravity);
lf.setWorld(world);
var groundBodyDef = new lf.b2BodyDef();
groundBodyDef.position.Set(0,-10);
var groundBody = world.CreateBody(groundBodyDef);
var groundBox = new lf.b2PolygonShape();
groundBox.SetAsBoxXY(50,10);
groundBody.CreateFixtureFromShape(groundBox,0);


var bodyDef = new lf.b2BodyDef();
bodyDef.type= lf.b2_dynamicBody;
bodyDef.position.Set(0,4);
var body=world.CreateBody(bodyDef);

var dynamicBox = new lf.b2PolygonShape;
dynamicBox.SetAsBoxXY(1,1);

fixtureDef = new lf.b2FixtureDef;
fixtureDef.shape = dynamicBox;
fixtureDef.density = 1;
fixtureDef.friction=0.3;
fixtureDef.restitution=0.5;

body.CreateFixtureFromDef(fixtureDef);
var timeStep=1/60;
var velocityIterations=6;
var positionIteration=2;

for (var i=0;i<60;i++)
{   world.Step(timeStep, velocityIterations, positionIteration);
    var position = body.GetPosition();
    var angle = body.GetAngle();
    debug(position.x+" "+position.y+" "+angle);
}