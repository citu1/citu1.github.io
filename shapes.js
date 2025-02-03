class Cube{
  constructor(){
    this.type = 'cube';
    //this.position = [0,0,0,0,0,0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 5.0;
    this.matrix = new Matrix4();
  }

  render(){
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;

    //pass color into fragcolor
    gl.uniform4f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    //pass matrix into uniform variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //front of cube
    drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
    drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);
    //change color to simulate "lighting"
    //top of cube
    gl.uniform4f(u_Color, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
    drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);
    
    //bottom of cube
    gl.uniform4f(u_Color, rgba[0]*.3, rgba[1]*.3, rgba[2]*.3, rgba[3]);
    drawTriangle3D([0,0,1, 0,0,0, 1,0,1]);
    drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);

    //right of cube
    gl.uniform4f(u_Color, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
    drawTriangle3D([1,1,0, 1,1,1, 1,0,0]);
    drawTriangle3D([1,1,1, 1,0,0, 1,0,1]);

    //left of cube
    gl.uniform4f(u_Color, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
    drawTriangle3D([0,0,0, 0,1,0, 0,1,1]);
    drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
    
    //back of cube
    gl.uniform4f(u_Color, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
    drawTriangle3D([0,0,1, 0,1,1, 1,0,1]);
    drawTriangle3D([0,1,1, 1,0,1, 1,1,1]);
  }
}

let g_buffer = null;
let g_cubeVerticies = null;
function drawCube(matrix, color){
  if(g_buffer == null)
    g_buffer = gl.createBuffer();
  //this will make the color the same if we push all the faces into one big verticies... 
  if(g_cubeVerticies == null){
    let v = [];
    g_cubeVerticies = [];
    //front
    v.push(-.3,-.3,.15, .3,.3,.15, .3,-.3,.15);
    v.push(-.3,-.3,.15, -.3,.3,.15, .3,.3,.15);
    g_cubeVerticies.push(new Float32Array(v));
    v = [];
    //top
    v.push(-0.3,.3,.15, -.3,.3,-.15, .3,.3,-.15);
    v.push(-0.3,.3,.15, .3,.3,-.15, .3,.3,.15);
    g_cubeVerticies.push(new Float32Array(v));
    v = [];
    //bottom
    v.push(-.3,-.3,-.15, -.3,-.3,.15, .3,-.3,-.15);
    v.push(-.3,-.3,.15, .3,-.3,-.15, .3,-.3,.15);
    g_cubeVerticies.push(new Float32Array(v));
    v = [];
    //right
    v.push(.3,.3,.15, .3,.3,-.15, .3,-.3,.15);
    v.push(.3,.3,-.15, .3,-.3,.15, .3,-.3,-.15);
    g_cubeVerticies.push(new Float32Array(v));
    v = [];
    //left
    v.push(-.3,-.3,.15, -.3,.3,.15, -.3,.3,-.15);
    v.push(-.3,-.3,.15, -.3,-.3,-.15, -.3,.3,-.15);
    g_cubeVerticies.push(new Float32Array(v));
    v = [];
    //back
    v.push(-.3,-.3,-.15, -.3,.3,-.15, .3,-.3,-.15,);
    v.push(-.3,.3,-.15, .3,-.3,-.15, .3,.3,-.15,);
    g_cubeVerticies.push(new Float32Array(v));
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
  let light = [.6,.9,.5,.8,.8,1];//[1,.9,.3,.8,.8,.6];
  let [r, g, b, a] = color;
  for(let i = 0; i < 6; i++){
    gl.uniform4f(u_Color, r*light[i], g*light[i], b*light[i], a);
    //bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffer);
  //write data to buffer object
    gl.bufferData(gl.ARRAY_BUFFER, g_cubeVerticies[i], gl.DYNAMIC_DRAW);
  //assign buffer object to a_Position variable
  //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  //enable assignment to a_position variable
    gl.enableVertexAttribArray(a_Position);
 
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

let g_pyramidVerticies = null;
function drawPyramid(matrix, color){
  if(g_buffer == null)
    g_buffer = gl.createBuffer();
  if(g_pyramidVerticies == null){
    let v = [];
    g_pyramidVerticies = [];
    v.push(-.5,-.5,.25,  0.5,-.5,.25,  0,.25, 0);
    g_pyramidVerticies.push(new Float32Array(v));
    v = [];
    v.push(.5,-.5,.25,  0.5,-.5,-.25,  0,.25, 0);
    g_pyramidVerticies.push(new Float32Array(v));
    v = [];
    v.push(-.5,-.5,-.25,  0.5,-.5,-.25,  0,.25, 0);
    g_pyramidVerticies.push(new Float32Array(v));
    v = [];
    v.push(-.5,-.5,.25,  -0.5,-.5,-.25,  0,.25, 0);
    g_pyramidVerticies.push(new Float32Array(v));
    v = [];
    v.push(.5,-.5,.25,  0.5,-.5,-.25,  0,.25, 0);
    g_pyramidVerticies.push(new Float32Array(v));
    //bottom square of pyramid
    v = [];
    v.push(-.5,-.5,.25,  -0.5,-.5,-.25,  .5,-.5, .25);
    g_pyramidVerticies.push(new Float32Array(v));
    v = [];
    v.push(-.5,-.5,-.25,  0.5,-.5,-.25,  .5,-.5, .25);
    g_pyramidVerticies.push(new Float32Array(v));
    //console.log(g_pyramidVerticies);
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
  let [r, g, b, a] = color;
  let light = [.8,.8,1,.6,.8,.5,.5];
  for(let i = 0; i < 7; i++){
    gl.uniform4f(u_Color, r*light[i], g*light[i], b*light[i], a);
    //bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffer);
  //write data to buffer object
    gl.bufferData(gl.ARRAY_BUFFER, g_pyramidVerticies[i], gl.DYNAMIC_DRAW);
  //assign buffer object to a_Position variable
  //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  //enable assignment to a_position variable
    gl.enableVertexAttribArray(a_Position);
 
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

function drawTriangle3D(verticies){
  var n =3;
  let vertexBuffer = gl.createBuffer();
 
  //bind buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //write data to buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
  //assign buffer object to a_Position variable
  //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  //enable assignment to a_position variable
  gl.enableVertexAttribArray(a_Position);
 
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
