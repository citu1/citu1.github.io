// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
let VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n'+
  'attribute vec3 a_normal;\n'+
  
  'varying vec2 v_UV;\n'+
  'varying vec3 v_normal;\n'+
  'varying vec4 v_vertPos;\n'+

  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +

  'void main() {\n' +
  ' gl_Position = u_ProjectionMatrix*u_ViewMatrix*u_GlobalRotateMatrix*u_ModelMatrix*a_Position;\n' +
  ' v_UV = a_UV;\n' +
  ' v_normal = a_normal;\n' +
  ' v_vertPos = u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
let FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n'+
  'varying vec3 v_normal;\n'+

  'uniform vec4 u_FragColor;\n' +
  'uniform vec3 u_lightcolor;\n' +
  'uniform vec3 u_lightPos;\n' +
  'uniform vec3 u_spotlightPos;\n' +
  'uniform vec3 u_cameraPos;\n' +
  'uniform bool u_lightOn;\n' +

  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +
  'uniform sampler2D u_Sampler2;\n' +
  'uniform sampler2D u_Sampler3;\n' +
  'uniform sampler2D u_Sampler4;\n' +

  'uniform int u_whichTexture;\n' +
  'uniform vec4 u_TexColorWeight;\n' +
  'varying vec4 v_vertPos;\n'+

  'uniform vec3 u_spotlightdir;\n' +
  //'uniform float u_lightincuttoff;\n' +
  'uniform float u_lightoutcuttoff;\n' +
  'float spotspecular;\n'+

  'void main() {\n' +
  '  vec4 t = u_TexColorWeight;\n' + 
  '  if (u_whichTexture == -3){\n' +                   //UV colors
    '     gl_FragColor = vec4((v_normal+1.0)/2.0, 1.0);}\n' +
  '  else if (u_whichTexture == -2){\n' +                         //color 
  '     gl_FragColor = u_FragColor;}\n' + 
  '  else if (u_whichTexture == -1){\n' +                   //UV colors
  '     gl_FragColor = vec4(v_UV, 1.0, 1.0);}\n' +
  '  else if (u_whichTexture == 0){\n' +                    //sky texture
  '     gl_FragColor = texture2D(u_Sampler0, v_UV);}\n' +
  '  else if (u_whichTexture == 1){\n' +                    //dirt texture
  '     gl_FragColor = texture2D(u_Sampler1, v_UV);}\n' +
  '  else if (u_whichTexture == 2){\n' +                    //uv coords texture
  '     gl_FragColor = texture2D(u_Sampler2, v_UV);}\n' +
  '  else if (u_whichTexture == 3){\n' +                    //water texture
  '     vec4 tex = texture2D(u_Sampler3, v_UV);\n' + 
  '     gl_FragColor = mix(tex,u_FragColor, 0.6);}\n' +
  ' else if (u_whichTexture == 4){\n' +                    //uv coords texture
  '     gl_FragColor = texture2D(u_Sampler4, v_UV);}\n' +
  '  else{\n' +                                             //error Redish
  '     gl_FragColor = vec4(1,.2,.2,1);}\n' +
  '  vec3 lightVector = u_lightPos-vec3(v_vertPos);\n' +
  '  vec3 spotlightVector = u_spotlightPos-vec3(v_vertPos);\n' +
  '  float r = length(lightVector);\n' +
  //'  if (r < 1.0){\n' +
  //'   gl_FragColor = vec4(1,0,0,1);}\n' +
  //'  else if (r <2.0){\n' +
  //'   gl_FragColor = vec4(0,1,0,1);}\n' +
  //'   gl_FragColor = vec4(vec3(gl_FragColor), 1);\n' +

  '   vec3 L = normalize(lightVector);\n' +
  '   vec3 N = normalize(v_normal);\n' +
  '   float nDotL = max(dot(N,L), 0.0);\n' +

  '   float light = 0.0;\n' +
  '   vec3 W = normalize(spotlightVector);\n' +
      //gives us cosine of angle btwn spotlight and position
  '   float angle = dot(W, u_spotlightdir);\n' +

  '   vec3 R = reflect(-L,N);\n' +
  '   vec3 E = normalize(u_cameraPos-vec3(v_vertPos));\n' +

  '   float specular = pow( max(dot(E,R), 0.0), 30.0);\n' +//increasing power minimizes specular dot
  '   if (angle >= u_lightoutcuttoff){\n' +  
  '      light = dot(N, W);\n'+//probably something to do with this
  '      float spotspecular = pow( max(dot(E,W), 0.0), 15.0);}\n' +

  '   vec3 diffuse = u_lightcolor * vec3(gl_FragColor.rgb)*nDotL;\n' +
  '   vec3 ambient = vec3(gl_FragColor)*0.3;\n' +
  '   if (u_lightOn){\n' +  
  '     if(light > 0.0){\n' +  
  '       gl_FragColor = vec4(((specular+diffuse+ambient)*0.1)+spotspecular, 1.0);\n' +
  '     }\n'+
  '     else{\n' +  
  '     if (u_whichTexture == 0){\n' +  
  '       gl_FragColor = vec4(diffuse+ambient, 1.0);}\n' +
  '     else{\n' +  
  '       gl_FragColor = vec4(specular+diffuse+ambient, gl_FragColor.a);}\n' +
  '     }\n'+
  '   }\n'+
  '}\n';

let canvas;
let gl;
let a_Position;
let a_UV;
let a_normal;
let u_FragColor;
let u_ModelMatrix;//manipulate the placement of the cubes
let u_GlobalRotateMatrix; //allows us to rotate all cubes at once to see everything(simulates camera action)
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture;
let g_camera;
let identityM = new Matrix4();
let u_TexColorWeight;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_spotlightPos;
let u_spotlightdir;
let u_lightincuttoff;
let u_lightoutcuttoff;
let u_lightcolor;

//set up webGL/canvas 
function setupWebGL(){
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    //console.log('Failed to get the rendering context for WebGL');
    return -1;
  }
  gl.enable(gl.DEPTH_TEST); 
  g_camera = new Camera(canvas.width, canvas.height);
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
  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if(a_UV < 0){
    console.log("Failed to get storage location of a_UV");
    return;
  }
  a_normal = gl.getAttribLocation(gl.program, "a_normal");
  if(a_normal < 0){
    console.log("Failed to get storage location of a_normal");
    return;
  }
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if(!u_FragColor){
    console.log("Failed to get storage location of u_FragColor");
    return;
  }
  u_lightcolor = gl.getUniformLocation(gl.program, "u_lightcolor");
  if(!u_lightcolor){
    console.log("Failed to get storage location of u_lightcolor");
    return;
  }
  u_lightPos = gl.getUniformLocation(gl.program, "u_lightPos");
  if(!u_lightPos){
    console.log("Failed to get storage location of u_lightPos");
    return;
  }
  u_spotlightPos = gl.getUniformLocation(gl.program, "u_spotlightPos");
  if(!u_lightPos){
    console.log("Failed to get storage location of u_lightPos");
    return;
  }
  u_cameraPos= gl.getUniformLocation(gl.program, "u_cameraPos");
  if(!u_cameraPos){
    console.log("Failed to get storage location of u_cameraPos");
    return;
  }
  u_lightOn= gl.getUniformLocation(gl.program, "u_lightOn");
  if(!u_lightOn){
    console.log("Failed to get storage location of u_lightOn");
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if(!u_ModelMatrix){
    console.log("Failed to get storage location of u_ModelMatrix");
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if(!u_GlobalRotateMatrix){
    console.log("Failed to get storage location of u_GlobalRotateMatrix");
    return;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if(!u_ProjectionMatrix){
    console.log("Failed to get storage location of u_ProjectionMatrix");
    return;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if(!u_ViewMatrix){
    console.log("Failed to get storage location of u_ViewMatrix");
    return;
  }
  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if(!u_ViewMatrix){
    console.log("Failed to get storage location of u_Sampler0");
    return;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if(!u_ViewMatrix){
    console.log("Failed to get storage location of u_Sampler1");
    return;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
  if(!u_ViewMatrix){
    console.log("Failed to get storage location of u_Sampler2");
    return;
  }
  u_Sampler3 = gl.getUniformLocation(gl.program, "u_Sampler3");
  if(!u_ViewMatrix){
    console.log("Failed to get storage location of u_Sampler2");
    return;
  }
  u_Sampler4 = gl.getUniformLocation(gl.program, "u_Sampler4");
  if(!u_ViewMatrix){
    console.log("Failed to get storage location of u_Sampler4");
    return;
  }
  u_whichTexture= gl.getUniformLocation(gl.program, "u_whichTexture");
  if(!u_whichTexture){
    console.log("Failed to get storage location of u_whichTexture");
    return;
  }
  u_TexColorWeight= gl.getUniformLocation(gl.program, "u_TexColorWeight");
  if(!u_whichTexture){
    console.log("Failed to get storage location of u_TexColorWeight");
    return;
  }
  u_spotlightdir = gl.getUniformLocation(gl.program, "u_spotlightdir");
  if(!u_spotlightdir){
    console.log("Failed to get storage location of u_spotlightdir");
    return;
  }
  /*u_lightincuttoff= gl.getUniformLocation(gl.program, "u_lightincuttoff");
  if(!u_lightincuttoff){
    console.log("Failed to get storage location of u_lightincuttoff");
    return;
  }*/
  u_lightoutcuttoff= gl.getUniformLocation(gl.program, "u_lightoutcuttoff");
  if(!u_lightoutcuttoff){
    console.log("Failed to get storage location of u_lightoutcuttoff");
    return;
  }

  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projMat.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
}


//turn into a 32x32
var g_map = [
  [1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,4,0,0,2,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,4,0,0,0,0,0,0,0,0,0,5,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,4,3,0,0,0,0,0,0,0,0,4,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,0,3,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,4,4,4,0,0,0,0,0,2,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,4,0,4,0,4,0,0,0,4,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,4,4,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,3,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
];

var b = new Cube();
b.color = [.4,.8,1,1];
b.textureNum = 1;
b.updateUV();
function drawMap(){
  
  var v = 32;
  for(x = 0; x < v; x++){
    for(y = 0; y < v; y++){
      //add a another loop to create higher walls?
        //var b = new Cube();
        b.matrix.setTranslate(0, -3, 0);
        //b.matrix.scale(.5,.5,.5);
        b.matrix.translate(x-(v/2), 0, y-(v/2));
        if((x >=25 && x <= 30) && (y >= 25 &&  y <= 30)){
          if(g_NormalOn)
            b.textureNum = -3;
          else{
            b.textureNum = 3;
            b.updateUV();
          }
        }
        b.render();
        if(g_map[x][y] > 0){
          if(g_NormalOn)
            b.textureNum = -3;
          else
            b.textureNum = 4;
          b.updateUV();
          for(i = 0; i< g_map[x][y]; i++){
            //can adjust these to different textures if needed 
            b.matrix.translate(0,1,0);
            b.render();
          }
        }
        if(g_NormalOn)
          b.textureNum = -3;
        else{
          b.textureNum = 1;
          b.updateUV();
        }
      }
    }
  }

let init_render = true;
var sky = new Cube;
var globalRotMat = new Matrix4();
var b = new Cube();
var s = new Sphere();
var light = new Cube();
var g_spotlightpos = [1,2,-3];
var spotlight = new Cube();
function renderScene(){
  var start_time = performance.now();
  
  g_camera.viewMat.setLookAt(
    g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2], 
    g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2],
    g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMat.elements);

  globalRotMat.set(identityM).rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform3f(u_lightPos, g_light[0], g_light[1], g_light[2]);
  gl.uniform3f(u_lightcolor, g_redS, g_greenS, g_blueS);
  gl.uniform3f(u_spotlightPos, g_spotlightpos[0], g_spotlightpos[1], g_spotlightpos[2]);
  gl.uniform3f(u_spotlightdir,-1,-1,1);
  gl.uniform1f(u_lightoutcuttoff, Math.cos(16));
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2]);
  gl.uniform1i(u_lightOn, g_lightOn);

  light.color = [2,2,0,1];
  light.matrix.setTranslate(g_light[0], g_light[1], g_light[2]);
  light.matrix.scale(-.15,-.15,-.15);
  //light.matrix.translate(.5,3,10);
  light.render();

  spotlight.color = [2,0,0,1];
  spotlight.matrix.setTranslate(g_spotlightpos[0], g_spotlightpos[1], g_spotlightpos[2]);
  spotlight.matrix.scale(-.15,-.15,-.15);
  //light.matrix.translate(.5,3,10);
  spotlight.render();

  if(init_render){
  sky.textureNum = 0;
  sky.color = [.7,.8,1,1];
  sky.u_TexColorWeight = 0.9;
  //-32 for map
  //-10 for mini room
  sky.matrix.scale(-32,-32,-32);
  sky.matrix.translate(-.5,-.5,-.5);
  
  init_render = false;
  }
  if(g_NormalOn)
    sky.textureNum = -3
  else 
    sky.textureNum = 0;
  sky.render();

  

  /*if(g_NormalOn)
    b.textureNum = -3;
  else 
    b.textureNum = -2;
  b.color = [1,1,1,1];
  b.matrix.setTranslate(0, -2, 0);
  b.render();
  
  b.color = [.3,.3,.3,1];
  b.matrix.translate(-5,-.5,-5);
  b.matrix.scale(10,.5,10);
  b.render();*/
  if(g_NormalOn)
    s.textureNum = -3;
  else 
    s.textureNum = 3;
  s.matrix.setTranslate(0,0,1);
  s.render();
  drawMap();
  var duration = performance.now()-start_time;
  sendTextToHTML(" ms: " +  Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
}

var holdeye = new Vector3();
var holdat = new Vector3();
function keyDown(ev){
  holdeye.set(g_camera.eye);
  holdat.set(g_camera.at);

  if(ev.keyCode == 39 || ev.keyCode == 68){ // right
    g_camera.right();
  }
  else if(ev.keyCode == 37 || ev.keyCode == 65){ // left
    g_camera.left();
  }
  else if(ev.keyCode == 87||ev.keyCode == 38){
    g_camera.forward();
  }
  else if(ev.keyCode == 83||ev.keyCode == 40){
    g_camera.back();
  }
  else if(ev.keyCode == 81){
    g_camera.panl();
  }
  else if(ev.keyCode == 69){
    g_camera.panr();
  }
  else if(ev.keyCode == 66){
    var checkx = Math.round(g_camera.eye.elements[0])+15;
    var checkz = Math.round(g_camera.eye.elements[2])+15;

    if(checkx + 1 <= 31 && g_map[checkx+1][checkz] > 1){
      //console.log("Cubes at location: "+ g_map[checkx+1][checkz]);
      g_map[checkx+1][checkz] -= 1;
    }
    else if(checkx - 1 >= 0 && g_map[checkx-1][checkz] > 1){
      //console.log("Cubes at location: "+ g_map[checkx-1][checkz]);
      g_map[checkx-1][checkz] -= 1;
    }
    else if(checkz + 1 <= 31 && g_map[checkx][checkz+1] > 1){
      //console.log("Cubes at location: "+ g_map[checkx][checkz-1]);
      g_map[checkx][checkz+1] -= 1;
    }
    else if(checkz - 1 >= 0 && g_map[checkx][checkz-1] > 1){
      //console.log("Cubes at location: "+ g_map[checkx][checkz-1]);
      if(checkx + 1 <= 31)
        g_map[checkx][checkz-1] -= 1;
    }
  }
  else if(ev.keyCode == 67){
    var checkx = Math.round(g_camera.eye.elements[0])+15;
    var checkz = Math.round(g_camera.eye.elements[2])+15;
    if(checkz + 1 <= 31)
      g_map[checkx][checkz+1] += 1;
  }
  
  var checkx = Math.round(g_camera.eye.elements[0])+15;
  var checkz = Math.round(g_camera.eye.elements[2])+15;

  if(checkx >=0  && checkz >= 0 && checkx <= 31 && checkz <= 31 && g_map[checkx][checkz] > 0){
    //console.log("Cubes at location: "+ g_map[checkx][checkz]);
    g_camera.eye.set(holdeye);
    g_camera.at.set(holdat);
  }
  renderScene();
  //console.log(ev.keyCode);
}
var g_startime = performance.now()/1000.00
var g_seconds = g_seconds = performance.now()/1000.00-g_startime;
function tick(){
  updateAnimation();
  //console.log(g_seconds)
  g_seconds = performance.now()/1000.00-g_startime;
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimation(){
  g_light[0] = Math.cos(g_seconds)*2;
  //g_light[1] = Math.cos(g_seconds);
  //g_light[2] = Math.cos(g_seconds);
}


function main() {
  // Retrieve <canvas> element
  setupWebGL();
  connectVariablesToGLSL();
  addActionforHTMLUI();
  // Clear <canvas>
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  document.onkeydown = keyDown;
  initTextures();
  //renderScene();
  requestAnimationFrame(tick);
}

function initTextures() {

  // Create the image object
  var image = new Image();
  var image1 = new Image();
  var image2 = new Image();
  var image3 = new Image();
  var image4 = new Image();
  if (!image || !image1|| !image2 || !image3) {
    console.log('Failed to create the image objects');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image.onload = function(){ sendTexturetoGLSL(image, u_Sampler0,0); };
  image1.onload = function(){ sendTexturetoGLSL(image1, u_Sampler1,1); };
  image2.onload = function(){ sendTexturetoGLSL(image2, u_Sampler2,2); };
  image3.onload = function(){ sendTexturetoGLSL(image3, u_Sampler3,3); };
  image4.onload = function(){ sendTexturetoGLSL(image4, u_Sampler4,4); };
  // Tell the browser to load an Image
  image.src = 'sky.jpg';
  image1.src = 'dirt.jpg';
  image2.src = 'uvCoords.png';
  image3.src = 'water.jpg';
  image4.src = 'stone.jpg';
  //add more textures later
  return true;
}

function sendTexturetoGLSL(img, u_sample, texUnit) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
  // Activate texture unit0
  if(texUnit == 0)
    gl.activeTexture(gl.TEXTURE0);
  else if(texUnit == 1)
    gl.activeTexture(gl.TEXTURE1);
  else if (texUnit == 2)
    gl.activeTexture(gl.TEXTURE2);
  else if (texUnit == 3)
    gl.activeTexture(gl.TEXTURE3);
  else if (texUnit == 4)
    gl.activeTexture(gl.TEXTURE4);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameter
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_sample, texUnit);
}

let g_globalAngle =0;
let an = 0;
let startx = 0;
let starty = 0;
let endx = 0;
let endy = 0;
let isDragging = false;
let g_NormalOn = false;
let g_light = [0,3,0];
let g_lightOn = true;
let g_redS = 1;
let g_blueS = 1;
let g_greenS = 1;

function addActionforHTMLUI(){
  g_globalAngle = document.getElementById('angleSlide').value;
  document.getElementById('angleSlide').addEventListener('mousemove', function(){g_globalAngle = this.value;});
  document.getElementById('lightx').addEventListener('mousemove', function(){g_light[0] = this.value/100;});
  document.getElementById('lighty').addEventListener('mousemove', function(){g_light[1] = this.value/100;});
  document.getElementById('lightz').addEventListener('mousemove', function(){g_light[2] = this.value/100;});
  document.getElementById('blueS').addEventListener('mousemove', function(){g_blueS = this.value/20;});
  document.getElementById('redS').addEventListener('mousemove', function(){g_redS = this.value/20;});
  document.getElementById('greenS').addEventListener('mousemove', function(){g_greenS = this.value/20;});
  document.getElementById('normalOn').onclick = function(){g_NormalOn= true;};
  document.getElementById('normalOff').onclick = function(){g_NormalOn = false;};
  document.getElementById('lightOn').onclick = function(){g_lightOn= true;};
  document.getElementById('lightOff').onclick = function(){g_lightOn = false;};

  canvas.onmousedown = function(ev) {isDragging= true;[startx,starty] = convertCoordsEvtoGl(ev)};
  canvas.onmouseup = function(ev) {isDragging = false;[endx,endy] = convertCoordsEvtoGl(ev)};
  canvas.onmousemove = function(ev) {if(isDragging && ev.buttons == 1) {handleMove();}};
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

//change this function from g_global angle to camera movement. 
function handleMove(){
  var yDist = endy-starty;
  var xDist = endx-startx;
  var angle = (180/Math.PI)*(Math.atan2(yDist,xDist));
  //console.log("starting position:"+ startx+", "+ starty);
  //console.log("ending position:"+ endx+", "+ endy);
  //console.log("distance:"+ xDist+", "+ yDist);
  //console.log(angle);
  //console.log("turn: ", angle/180);
  if(angle > 0)
    if(angle > 10)
      g_camera.panl(angle/180);
    else
      g_camera.panl(angle);
  else
  if(angle < -10)
    g_camera.panr(angle/180);
  else
    g_camera.panl(angle);
  //g_globalAngle = angle;
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  htmlElm.innerText = text;
}