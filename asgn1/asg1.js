// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
let VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position ;\n' + // Set the vertex coordinates of the point
  '  gl_PointSize = u_Size;\n' +                    // Set the point size
  '}\n';

// Fragment shader program
let FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_Color;\n' + // Set the point color
  '}\n';

//global variables
const TRIANGLE = 0;
const RECTANGLE = 1;
const CIRCLE = 2;

let canvas;
let gl;
let a_Position;
let u_Color;
let u_Size;
let g_size = 5;
let g_type = TRIANGLE;
let g_segment = 10;
let track_click = 0;
let line = [0];
let copy_lastline = [];
let removed_clicks = 0;
//set up list of shapes for functions needed
let g_shapesList  = [];

//set up webGL/canvas 
function setupWebGL(){
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return -1;
  }
}

//connecting proper variables to the Vshaders and Fshader variables
function connectVariablesToGLSL(){
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return -1;
  }
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if(a_Position < 0){
    console.log("Failed to get storage location of a_position");
    return;
  }
  u_Color = gl.getUniformLocation(gl.program, "u_Color");
  if(!u_Color){
    console.log("Failed to get storage location of u_Color");
  }
  u_Size = gl.getUniformLocation(gl.program, "u_Size");
  if(a_Position < 0){
    console.log("Failed to get storage location of u_Size");
    return;
  }
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


//goes through all shapes in list and render them
//according to their class render function
function renderAllShapes(){
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

//takes in the click coordinates given at time of event
//connects it to proper shape class given and sets up
//the shape variables properly and then rendering 
function handleClicks(ev){
  [x,y] = convertCoordsEvtoGl(ev);
  //console.log([x,y]);
  let point;
  if(g_type == TRIANGLE){
    point = new Triangle();
  }
  else if(g_type == RECTANGLE){
    point = new Rectangle;//need to draw 2 triangles
  }
  else{
    point = new Circle();
    point.segment = g_segment;
  }
  point.position = [x,y];
  //arrays return pointers to arrays, using slice you can get the specific values
  //in the array at that time
  point.color = shapeColor.slice();
  point.size = g_size;
  g_shapesList.push(point);
  renderAllShapes();
}

function undo(){
  //keeps track of which clicks correlate to the last line drawn and the 2nd to last line drawn
  var currentline = line.length-1;
  var lastline = currentline-1;

  if(lastline > 0){
    //retains the splice of the last line drawn, removing all the shapes drawn from that line from g_shapesList 
    copy_lastline = g_shapesList.splice(line[lastline], g_shapesList.length-1);
    //keeps track of removed_clicks for redo
    removed_clicks = line[currentline] - line[lastline];
    //removes last lines clicks from the line list and track_clicks
    track_click = track_click - removed_clicks;
    line.splice(currentline);
  }
  else if(lastline == 0)
  {
    //for undoing first line drawn just copy to copylist and set gshapes to empty
    copy_lastline = g_shapesList;
    g_shapesList = [];
    //remove currentline, have removed clicks be current clicks and set current clicks to 0
    //to fully erase the full line 
    line.splice(currentline);
    removed_clicks = track_click;
    track_click = 0;
  }
  renderAllShapes();
}

function redo(){
  //only redos once so pressing redo on default or twice does nothing
  if(removed_clicks > 0){
    //pushes everything back into gshapes from copied list from last undo
    for(var i = 0; i < copy_lastline.length; i++){
      g_shapesList.push(copy_lastline[i]);
    }
    //add back removed clicks to track list and add back to line list
    track_click += removed_clicks;
    line.push(track_click);
    //reset copy list and removed clicks to 0 and render
    copy_lastline = [];
    removed_clicks = 0;
    renderAllShapes();
  }
}

//clears g_shapes list and everything 
function clearCanvas(){
  g_shapesList = []; 
  track_click = 0;
  removed_clicks = 0;
  line = [];
  copy_lastline = [];
  renderAllShapes();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function main() {
  // Retrieve <canvas> element
  setupWebGL();
  connectVariablesToGLSL();

  //sets shape color and size to default slider positions 
  shapeColor = [document.getElementById('redS').value/20, document.getElementById('greenS').value/20,document.getElementById('blueS').value/20, 1.0];
  g_size = document.getElementById('shapeS').value;
  //when the mouse is moving over canvas and clicking, handleClicks will run andcall renderAllShapes
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) {handleClicks(ev); track_click++}};
  canvas.onmouseup = function(){line.push(track_click);};
  //console.log("Clicks made: " + track_click);

  //connecting all html given functionality to appropriate variables we will use 
  //assigning the proper shape class after user clicks specific button
  document.getElementById('squa').onclick = function(){g_type = RECTANGLE;};
  document.getElementById('tri').onclick = function(){g_type = TRIANGLE};
  document.getElementById('circ').onclick = function(){g_type = CIRCLE};

  //Assigning proper color change when user moves the color sliders
  document.getElementById('redS').addEventListener('mouseup', function(){shapeColor[0] = this.value/20;});
  document.getElementById('greenS').addEventListener('mouseup', function(){shapeColor[1] = this.value/20;});
  document.getElementById('blueS').addEventListener('mouseup', function(){shapeColor[2] = this.value/20;});

  //Assigning proper size when user moves the size slider
  document.getElementById('shapeS').addEventListener('mouseup', function(){g_size = this.value});
  //clearing the list of shapes when user clicks clear canvas
  document.getElementById('clear').onclick = function(){clearCanvas();};
  //Assigning proper amount of segments for circles when user moves the segment slider
  document.getElementById('circleS').addEventListener('mouseup', function(){g_segment = this.value});

  //call the undo and redo functions respectively for button clicked
  document.getElementById('undo').onclick = function(){undo();};
  document.getElementById('redo').onclick = function(){redo();};
  // Clear <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  document.getElementById('draw').onclick = function(){draw();};
}

function draw(){
  let top = new Picture();
  //first xy -> point 1, 2nd xy, move down x, 3rd xy -> move up y
  top.position = [-4, 8, 0, 9, 4, 8];
  top.color =[0.25, 0.45, 0.85, 1.0];
  top.size = 25;
  top.render();
  side = new Picture();
  side.position = [-4, 2, -5, 5.5, -4, 8];
  side.color =[0.25, 0.45, 0.85, 1.0];
  side.size = 25;
  side.render();
  top.position = [4, 2, 5, 5.5, 4, 8];
  top.color =[0.25, 0.45, 0.85, 1.0];
  top.render();
  //first xy -> point 1, 2nd xy, move down x, 3rd xy -> move up y
  top.position = [-4, 2, 0, 1, 4, 2];
  top.color =[0.25, 0.45, 0.85, 1.0];
  top.render();
  top.position = [-4, 8, -4,2, 4, 2];
  top.color =[1,1,1, 1.0];
  top.render();
  top.position = [-4, 8, 4,8, 4, 2];
  top.color =[1,1,1, 1.0];
  top.render();
  top.position = [-2, 4,-3,4,-3,6];
  top.color = [0, 0, 0, 1];
  top.render();
  top.position = [-2, 4,-2,6,-3,6];
  top.render();
  top.position = [2, 4,2,6,3,6];
  top.render();
  top.position = [2, 4,3,4,3,6];
  top.render();
  
}
