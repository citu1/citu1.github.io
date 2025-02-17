class Cube{
  constructor(){
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.textureNum = -2; // default is color
    this.matrix = new Matrix4();
    this.vbuffer = null;
    this.ubuffer = null;
    this.verticies = null;
    this.uv = null;
    this.colWeight = [1,1,1,1];
    this.default = null;
    this.mapped_tex = null;

    this.generate_verticies();
    this.generate_uv();
  }

  generate_verticies(){
    this.verticies = new Float32Array([
      //front
      0,0,0,  1,1,0,  1,0,0,
      0,0,0,  0,1,0,  1,1,0,

      //top
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,0, 1,1,1,

      //bottom
      0,0,0, 0,0,1, 1,0,1,
      0,0,0, 1,0,0, 1,0,1,

      //right
      1,0,0, 1,1,0, 1,1,1,
      1,0,0, 1,0,1, 1,1,1,

      //left
      0,0,0, 0,1,0,  0,1,1,
      0,0,0,  0,0,1  ,0,1,1,

      //back
      0,0,1,  0,1,1,  1,1,1,
      0,0,1,  1,0,1,  1,1,1,
    ]);
  } 

  generate_uv(){
      this.default = new Float32Array([
      //front
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1, 

      //top
      0,0, 0,1, 1,1,
      0,0, 1,0, 1,1,

      //bottom
      0,1, 0,0, 1,0,
      0,1, 1,1, 1,0,

      //right
      0,0, 0,1, 1,1,
      0,0, 1,0, 1,1,

      //left
      1,0, 1,1, 0,1,
      1,0, 0,0, 0,1,

      //back
      1,0, 1,1, 0,1,
      1,0, 0,0, 0,1,
    ]);
    this.mapped_tex = new Float32Array([
      //front
      //u,v
      0.5,0.26, .26,.5, .26,.25,
      0.5,0.26, .5,.5, .26,.5,

      //top
      0.5,0.5, 0.5,.75, .25,.75,
      0.5,0.5, 0.25,.5, .25,.75,

      //bottom
      .5,.25, 0.5,0, .25,0,
      .5,.25, 0.25,0.25, .25,0,

      //right
      .25,0.26, 0.25,.5, 0,.5,
      .25,0.26, 0,.26, 0,.5,

      //left
      .5,.26, .5,.5, 0.75,.5,
      .5,.26, .75,.26, 0.75,.5,

      //back
      .75,.26, .75,.5, 1,.5,
      .75,.26, 1,.26, 1,.5,
    ]);
    this.uv = this.default;
  }
  updateUV(){
    if(this.textureNum == 1){
      this.uv = this.mapped_tex;
    }
    else{
      this.uv = this.default;
    }
  }
  render(){
    //console.log("rendering cube");
    var rgba = this.color;

    //pass color into fragcolor
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //sets the texture of cube
    gl.uniform1i(u_whichTexture, this.textureNum);
    
    gl.uniform4f(u_TexColorWeight, this.colWeight[0],this.colWeight[1],this.colWeight[2],this.colWeight[3]);

    //pass matrix into uniform variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    if(this.vbuffer == null){
      this.vbuffer = gl.createBuffer();
      if (!this.vbuffer) {
        console.log("Failed to create the buffer object for verticies");
        return -1;
      }
    
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuffer);
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  }
    gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);

    
    if(this.ubuffer == null){
      this.ubuffer = gl.createBuffer();
      if (!this.ubuffer) {
        console.log("Failed to create the buffer object for uv");
        return -1;
      }
    
      gl.bindBuffer(gl.ARRAY_BUFFER, this.ubuffer);
      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_UV);
    }
    gl.bufferData(gl.ARRAY_BUFFER, this.uv, gl.DYNAMIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, this.verticies.length/3);

    //front of cube
    /*
    //drawTriangle3D([-.5,-.5,-.5, -.5,.5,-.5, .5,-.5,-.5]);
    drawTriangle3DUV([-.5,-.5,-.5, -.5,.5,-.5, .5,-.5,-.5], [1,0, 0,1, 1,1]);
    //drawTriangle3D([-.5,.5,-.5, .5,-.5,-.5, .5,.5,-.5]);
    drawTriangle3DUV([-.5,.5,-.5, .5,-.5,-.5, .5,.5,-.5], [1,0, 0,1, 1,1]);
  
  
    //change color to simulate "lighting"
    //top of cube
    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    //drawTriangle3D([-0.5,.5,.5, -.5,.5,-.5, .5,.5,-.5]);
    //drawTriangle3D([-0.5,.5,.5, .5,.5,-.5, .5,.5,.5]);
    drawTriangle3DUV([-0.5,.5,.5, -.5,.5,-.5, .5,.5,-.5], [1,0, 0,1, 1,1]);
    drawTriangle3DUV([-0.5,.5,.5, .5,.5,-.5, .5,.5,.5], [1,0, 0,1, 1,1]);
    
    //bottom of cube
    gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
    //drawTriangle3D([-.5,-.5,-.5, -.5,-.5,.5, .5,-.5,-.5]);
    //drawTriangle3D([-.5,-.5,.5, .5,-.5,-.5, .5,-.5,.5]);
    drawTriangle3DUV([-.5,-.5,-.5, -.5,-.5,.5, .5,-.5,-.5], [1,0, 0,1, 1,1]);
    drawTriangle3DUV([-.5,-.5,.5, .5,-.5,-.5, .5,-.5,.5], [1,0, 0,1, 1,1]);

    //right of cube
    gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
    //drawTriangle3D([.5,.5,.5, .5,.5,-.5, .5,-.5,.5]);
    //drawTriangle3D([.5,.5,-.5, .5,-.5,.5, .5,-.5,-.5]);
    drawTriangle3DUV([.5,.5,.5, .5,.5,-.5, .5,-.5,.5], [1,0, 0,1, 1,1]);
    drawTriangle3DUV([.5,.5,-.5, .5,-.5,.5, .5,-.5,-.5], [1,0, 0,1, 1,1]);

    //left of cube
    //drawTriangle3D([-.5,-.5,.5, -.5,.5,.5, -.5,.5,-.5]);
    //drawTriangle3D([-.5,-.5,.5, -.5,-.5,-.5, -.5,.5,-.5]);
    drawTriangle3DUV([-.5,-.5,.5, -.5,.5,.5, -.5,.5,-.5], [1,0, 0,1, 1,1]);
    drawTriangle3DUV([-.5,-.5,.5, -.5,-.5,-.5, -.5,.5,-.5], [1,0, 0,1, 1,1]);
    
    //back of cube
    gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
    drawTriangle3DUV([-.5,-.5,.5, .5,.5,.5, .5,-.5,.5], [1,0, 0,1, 1,1]);
    //drawTriangle3DUV([-.5,-.5,.5, .5,.5,.5, .5,-.5,.5], [1,0, 0,1, 1,1]);
    drawTriangle3DUV([-.5,-.5,.5, -.5,.5,.5, .5,.5,.5], [1,0, 0,1, 1,1]);*/
  }
}

function drawTriangle3D(verticies){
  var n =3;

  var vertex_buffer = gl.createBuffer();
  //bind buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  //write data to buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
  //assign buffer object to a_Position variable
  //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  //enable assignment to a_position variable
  gl.enableVertexAttribArray(a_Position);
 
  //impluing there are no valid shaders in use
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(verticies, uv){
  var n =3;
  //console.log("verticies: ", verticies);
  //console.log("uv: ", uv);
  
  var vertex_buffer = gl.createBuffer();
  if(!vertex_buffer){
    console.log("Failed to create buffer object");
    return;
  }
  //bind buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  //write data to buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);

  //assign buffer object to a_Position variable
  //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
  
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  //enable assignment to a_position variable
  gl.enableVertexAttribArray(a_Position);

  //drawing using a_UV coords rather than a-Position?
  var uvBuffer = gl.createBuffer();
  if(!uvBuffer){
    console.log("Failed to create buffer object");
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  //write data to buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  //assign buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  //enable assignment to a_position variable
  gl.enableVertexAttribArray(a_UV);

  //implying no valid shader in use?
  gl.drawArrays(gl.TRIANGLES, 0, n);
  
}
