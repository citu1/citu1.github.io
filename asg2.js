// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
let VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix*u_ModelMatrix*a_Position ;\n' +                // Set the point size
  '}\n';

// Fragment shader program
let FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_Color;\n' + // Set the point color
  '}\n';

let canvas;
let gl;
let a_Position;
let u_Color;
let u_Size;
let u_ModelMatrix;//manipulate the placement of the cubes
let u_GlobalRotateMatrix; //allows us to rotate all cubes at once to see everything(simulates camera action)

//set up webGL/canvas 
function setupWebGL(){
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    //console.log('Failed to get the rendering context for WebGL');
    return -1;
  }
  gl.enable(gl.DEPTH_TEST); 
}

//connecting proper variables to the Vshaders and Fshader variables
function connectVariablesToGLSL(){
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    //console.log('Failed to intialize shaders.');
    return -1;
  }
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if(a_Position < 0){
    //console.log("Failed to get storage location of a_position");
    return;
  }
  u_Color = gl.getUniformLocation(gl.program, "u_Color");
  if(!u_Color){
    //console.log("Failed to get storage location of u_Color");
  }
  u_Size = gl.getUniformLocation(gl.program, "u_Size");
  if(a_Position < 0){
    //console.log("Failed to get storage location of u_Size");
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if(a_Position < 0){
    //console.log("Failed to get storage location of u_ModelMatrix");
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if(a_Position < 0){
    //console.log("Failed to get storage location of u_ModelMatrix");
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

//restraining coordinates to canvas borders
function convertCoordsEvtoGl(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x,y]);
}

let g_globalAngle = 0;
let g_legAngle = 0;
let g_pawAngle = 0;
let g_animationAngle = 0;
let g_legAnimation = false;
let g_pawAnimation = false;
let g_Animation = false;
let startx = 0;
let starty = 0;
let endx = 0;
let endy = 0;

function addActionforHTMLUI(){
  g_globalAngle = document.getElementById('angleSlide').value;
  document.getElementById('legSlide').addEventListener('mousemove', function(){g_legAngle = this.value;renderScene();});
  document.getElementById('pawSlide').addEventListener('mousemove', function(){g_pawAngle = this.value;renderScene();});
  document.getElementById('angleSlide').addEventListener('mousemove', function(){g_globalAngle = this.value;renderScene();});
  
  document.getElementById('AnimationOn').onclick = function(){g_Animation= true;};
  document.getElementById('AnimationOff').onclick = function(){g_Animation = false;g_legAnimation = false; g_pawAnimation = false;};
  document.getElementById('legAnimationOn').onclick = function(){g_legAnimation= true;};
  document.getElementById('legAnimationOff').onclick = function(){g_legAnimation = false};
  document.getElementById('pawAnimationOn').onclick = function(){g_pawAnimation= true;};
  document.getElementById('pawAnimationOff').onclick = function(){g_pawAnimation = false};

  //canvas.onmousedown = function(ev) {[startx,starty] = convertCoordsEvtoGl(ev)};
  canvas.onmouseup = function(ev) { handleMove(ev)};
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) {handleMove(ev);}};
}

//restraining coordinates to canvas borders
function convertCoordsEvtoGl(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x,y]);
}

function handleMove(ev){
  [endx,endy] = convertCoordsEvtoGl(ev)
  var yDist = endy-starty;
  var xDist = endx-startx;
  var angle = (180/Math.PI)*(Math.atan2(yDist,xDist));
  g_globalAngle = angle;
}

let g_backAngle = 0;
let g_frontlegAngle = 0;
let g_backlegAngle = 0;
let g_neckAngle = 0;
let g_tailAngle = 0;
let g_frontleft_leg= 0;
let g_backright_leg = 0;
function updateAnimation(){
  if(g_Animation){
    g_animationAngle = 5.5*Math.sin(3*g_seconds);
    g_backAngle = 35*Math.sin(3*g_seconds);
    g_neckAngle = Math.abs(15*Math.sin(g_seconds));
    g_tailAngle = Math.abs(30*Math.sin(3*g_seconds));
    g_legAnimation = true;
    g_pawAnimation = true;
  }
  if(g_legAnimation){
    g_frontlegAngle = 30*Math.sin(3*g_seconds);
    g_frontleft_leg = 30*Math.cos(3*g_seconds);
    g_backlegAngle = 35*Math.sin(3*g_seconds);
    g_backright_leg = 35*Math.cos(3*g_seconds);;
  }
  if(g_pawAnimation)
    g_pawAngle = 20*Math.sin(3*g_seconds);
}
//goes through all shapes in list and render them
//according to their class render function
function renderScene(){
  var start_time = performance.now();
 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //add snout to head
  //head of ferret
  
  let m4 = new Matrix4();
  m4.translate(-.65,.6,-0.0001);
  m4.rotate(5,0,0);
  m4.rotate(g_animationAngle,0,0,1);
  var m = new Matrix4(m4);
  var m5 = new Matrix4(m4);
  var m22 = new Matrix4(m4);
  var m23 = new Matrix4(m4);
  var m24 = new Matrix4(m4);
  m4.scale(.4,.55,.66);
  drawCube(m4, [0.859, 0.827, .807, 1]);

  //eyes
  m24.translate(-0.115, .05 ,-.06);
  m24.scale(.08,.08,.08);
  drawCube(m24, [0,0,0, 1]);
  m24.translate(0,0,1.5);
  drawCube(m24, [0,0,0, 1]);

  //snout
  m5.translate(-.15, -.02 ,0);
  var m25 = new Matrix4(m5);
  m5.scale(.15,.2,.3);
  drawCube(m5, [0.859, 0.827, .807, 1]);
  m25.translate(-.015,0,0);
  m25.rotate(180,0,0);
  m25.scale(.1,.1,.1);
  drawPyramid(m25, [0.937, 0.663, 0.816,1]);

  //ears 
  m22.translate(0,.18,-.088);
  m22.rotate(325,1,0,0);
  m22.rotate(0,0,1,0);
  m22.scale(.1,.15,.3);
  drawPyramid(m22, [0.859, 0.827, .807, 1]);

  m23.translate(0,.18,.088);
  m23.rotate(-325,1,0,0);
  m23.rotate(0,0,1,0);
  m23.scale(.1,.15,.3);
  drawPyramid(m23, [0.859, 0.827, .807, 1]);
  
  //upper body of ferret
  //neck
  m.translate(0.1,-.35,0);
  m.rotate(-70,0,0,1);
  m.rotate(g_neckAngle, 0, 0, 1);
  var m6 = new Matrix4(m);
  m.scale(.7,.3,.6);
  drawCube(m, [0.145, 0.098, .051, 1]);
  
  //chest
  m6.translate(.3,0,0);
  m6.rotate(60,0,0);
  m6.rotate(g_animationAngle/2,0,0,1);
  var m7 = new Matrix4(m6);
  var m8 = new Matrix4(m6);
  var m2 = new Matrix4(m6);
  m6.scale(.4,.57,.8);
  drawCube(m6, [0.145, 0.098, .051, 1]);

  //front legs
  m7.translate(0,-.21,-.16);
  m7.rotate(g_frontleft_leg,0,0,1);
  m7.scale(.2,1.1,.4);
  //before the initializition of the new matrixes, rotate for animation
  var m14 = new Matrix4(m7);
  drawCube(m7, [0.145, 0.098, .051, 1]);

  //left paw
  m14.translate(-.155,-.3,0);
  m14.rotate(3,0,0);
  m14.rotate(g_pawAngle,0,0,1);
  var m18 = new Matrix4(m14);
  m14.scale(1.5,.25,.7);
  drawCube(m14, [0.145, 0.098, .051, 1]);

  m18.translate(-.45,-.025,-.1);
  m18.scale(.1,.1,.1);
  drawPyramid(m18, [0.823, 0.761,0.671,1]);
  m18.translate(0,0,1);
  drawPyramid(m18, [0.823, 0.761,0.671,1]);
  m18.translate(0,0,1);
  drawPyramid(m18, [0.823, 0.761,0.671,1]);

  //right leg
  m8.translate(0,-.21, .16);
  m8.rotate(g_frontlegAngle,0,0,1);
  m8.scale(.2,1.1,.4);
  //m8.translate(0,0,.8);
  var m15 = new Matrix4(m8);
  drawCube(m8, [0.145, 0.098, .051, 1]);

  //right paw
  m15.translate(-.155,-.3,0);
  m15.rotate(3,0,0);
  m15.rotate(g_pawAngle,0,0,1);
  let m19 = new Matrix4(m15);
  m15.scale(1.5,.25,.7);
  drawCube(m15, [0.145, 0.098, .051, 1]);

  m19.translate(-.45,-.025,-.1);
  m19.scale(.1,.1,.1);
  drawPyramid(m19, [0.823, 0.761,0.671,1]);
  m19.translate(0,0,1);
  drawPyramid(m19, [0.823, 0.761,0.671,1]);
  m19.translate(0,0,1);
  drawPyramid(m19, [0.823, 0.761,0.671,1]);

  //middle body of ferret
  m2.translate(.27,.04,0.001);
  m2.rotate(10,0,0,1);
  m2.rotate(g_animationAngle/3,0,0,1);
  var m3 = new Matrix4(m2);
  m2.scale(.7,.5,.8);
  drawCube(m2, [0.749, 0.6, 0.447, 1]);

  //back body of ferret
  m3.translate(.268,-.08,0);
  m3.rotate(-30,0,0);
  m3.rotate(g_backAngle/2,0,0,1);
  var m9 = new Matrix4(m3);
  var m10 = new Matrix4(m3);
  var m11 = new Matrix4(m3);
  m3.scale(.55,.6,1);
  drawCube(m3, [0.749, 0.6, 0.447, 1]);

  //back legs 
  m9.translate(.09,-.15,-.17);
  m9.rotate(60,0,0);
  m9.rotate(g_backlegAngle,0,0,1);
  m9.scale(.5,.5,.5);
  var m16 = new Matrix4(m9);
  drawCube(m9,[0.349,0.243,0.2,1]);

  //back left paw
  m16.translate(-.35,-.3,0);
  m16.rotate(65,0,0);
  m16.rotate(g_pawAngle,0,0,1);
  let m20 = new Matrix4(m16);
  m16.scale(.5,.5,1.1);
  drawCube(m16, [0.227, 0.146, .125, 1]);

  //claws
  m20.translate(-.045,.15,-.1);
  m20.rotate(270,0,0);
  m20.scale(.05,.2,.1);
  drawPyramid(m20, [0.823, 0.761,0.671,1]);
  m20.translate(0,0,1);
  drawPyramid(m20, [0.823, 0.761,0.671,1]);
  m20.translate(0,0,1);
  drawPyramid(m20, [0.823, 0.761,0.671,1]);

  //back right pleg
  m10.translate(.09,-.15,.17);
  m10.rotate(60,0,0);
  m10.rotate(g_backright_leg,0,0,1);
  m10.scale(.5,.5,.5);
  var m17 = new Matrix4(m10);
  drawCube(m10,[0.349,0.243,0.2,1]);

  //back right paw
  m17.translate(-.35,-.3,0);
  m17.rotate(65,0,0);
  m17.rotate(g_pawAngle,0,0,1);
  var m21 = new Matrix4(m17);
  m17.scale(.5,.5,1.1);
  drawCube(m17, [0.227, 0.146, .125, 1]);

  //claws
  m21.translate(-.045,.15,-.1);
  m21.rotate(270,0,0);
  m21.scale(.05,.2,.1);
  drawPyramid(m21, [0.823, 0.761,0.671,1]);
  m21.translate(0,0,1);
  drawPyramid(m21, [0.823, 0.761,0.671,1]);
  m21.translate(0,0,1);
  drawPyramid(m21, [0.823, 0.761,0.671,1]);

  //tail segments
  m11.translate(.38,0.08,0.00001);
  m11.rotate(10,0,0);
  m11.rotate(g_tailAngle,0,0,1);
  var m12 = new Matrix4(m11);
  m11.scale(.7,.5,.65);
  drawCube(m11, [0.29, 0.192, 0.165,1]);

  m12.translate(.3,0,0);
  m12.rotate(20,0,0);
  m12.rotate(g_tailAngle,0,0,1);
  var m13 = new Matrix4(m12);
  m12.scale(.45,.35,.45);
  drawCube(m12, [0.227, 0.146, .125, 1]);

  m13.translate(.18,-.02,0);
  m13.rotate(5,0,0);
  m13.rotate(g_tailAngle,0,0,1);
  m13.scale(.35,.25,.35);
  drawCube(m13, [0.227, 0.146, .125, 1]);
  var duration = performance.now()-start_time;
  sendTextToHTML(" ms: " +  Math.floor(duration) + " fps: " + Math.floor(1000/duration).toFixed(3), "numdot");
}
function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  htmlElm.innerText = text;
}

function main() {
  // Retrieve <canvas> element
  setupWebGL();
  connectVariablesToGLSL();
  addActionforHTMLUI();
  // Clear <canvas>
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //renderScene();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime; 
function tick(){
  g_seconds = performance.now()/1000.0 - g_startTime; 
  updateAnimation();
  //console.log(g_seconds);
  renderScene();

  requestAnimationFrame(tick);
}
