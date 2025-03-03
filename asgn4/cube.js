class Cube{
  constructor(){
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.textureNum = -2; // default is color
    this.matrix = new Matrix4();
    this.vbuffer = null;
    this.ubuffer = null;
    this.nbuffer = null;
    this.vertices = null;
    this.uv = null;
    this.normal = null;
    this.colWeight = [1,1,1,1];
    this.default = null;
    this.mapped_tex = null;

    this.generate_vertices();
    this.generate_uv();
    this.generate_normal();
    
  }

  generate_vertices(){
    this.vertices = new Float32Array([
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
  generate_normal(){
    //front normal -> [0,0,-1]
    //top normal -> [0,1,0]
    //right normal -> [1,0,0]
    //left normal -> [-1,0,0]
    //back nomal -> [0,0,1]
    //bottom normal -> [0,-1,0]
    this.normal = new Float32Array([
      0,0,-1, 0,0,-1, 0,0,-1, 
      0,0,-1, 0,0,-1, 0,0,-1, 

      0,1,0, 0,1,0, 0,1,0,
      0,1,0, 0,1,0, 0,1,0,

      0,-1,0, 0,-1,0, 0,-1,0,
      0,-1,0, 0,-1,0, 0,-1,0,

      1,0,0, 1,0,0, 1,0,0,
      1,0,0, 1,0,0, 1,0,0,

      -1,0,0, -1,0,0, -1,0,0,
      -1,0,0, -1,0,0, -1,0,0,

      0,0,1, 0,0,1, 0,0,1, 
      0,0,1, 0,0,1, 0,0,1, 
    ]);
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
        console.log("Failed to create the buffer object for vertices");
        return -1;
      }
    }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuffer);
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    
    if(this.ubuffer == null){
      this.ubuffer = gl.createBuffer();
      if (!this.ubuffer) {
        console.log("Failed to create the buffer object for uv");
        return -1;
      }
    }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.ubuffer);
      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_UV);
    
    gl.bufferData(gl.ARRAY_BUFFER, this.uv, gl.DYNAMIC_DRAW);

    if(this.nbuffer == null){
      this.nbuffer = gl.createBuffer();
      if (!this.nbuffer) {
        console.log("Failed to create the buffer object for normal");
        return -1;
      }
    }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.nbuffer);
      gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_normal);
    
    gl.bufferData(gl.ARRAY_BUFFER, this.normal, gl.DYNAMIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);
  }
}