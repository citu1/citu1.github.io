class Sphere{
    constructor(){
      this.type = 'sphere';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.textureNum = -2; // default is color
      this.matrix = new Matrix4();
      this.colWeight = [1,1,1,1];
      this.vbuffer = null;
      this.ubuffer = null;
      this.nbuffer = null;
      this.verticies = null;
      this.uv = null;
      this.normal = null;

      this.generatevals();
    }
  
    generatevals(){
      var d = Math.PI/10;
      var dd = Math.PI/10;
      var hv = [];
      var huv = [];
      for(var t = 0; t < Math.PI; t += d){
        for(var r = 0; r < (2*Math.PI); r+= d){
          hv.push(Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t));//p1
          hv.push(Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd));//p2
          hv.push(Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd));//p4
          huv.push(t/Math.PI, r/(2*Math.PI));//u1
          huv.push((t+dd)/Math.PI, r/(2*Math.PI));//u2
          huv.push((t+dd)/Math.PI, (r+dd)/(2*Math.PI));//u4

          hv.push(Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t));//p1
          hv.push(Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd));//p4
          hv.push(Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t));
          huv.push(t/Math.PI, r/(2*Math.PI));//u1
          huv.push((t+dd)/Math.PI, (r+dd)/(2*Math.PI));//u4
          huv.push(t/Math.PI, (r+dd)/(2*Math.PI));//u3
        }    
      }
      //needs to be the numbers not the list...
      this.verticies = new Float32Array(hv);
      this.uv = new Float32Array(huv);
      this.normal = new Float32Array(hv);
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
  
      /*var d = Math.PI/10;
      var dd = Math.PI/10;
      var v = [];
      var uv = [];
        for(var t = 0; t < Math.PI; t += d){
            for(var r = 0; r < (2*Math.PI); r+= d){
                var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];

                var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
                var p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
                var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

                v = [];
                uv = [];
                
                v = v.concat(p1); uv = uv.concat([0,0]);
                v = v.concat(p2); uv = uv.concat([0,0]);
                v = v.concat(p4); uv = uv.concat([0,0]);
                gl.uniform4f(u_FragColor, 1,1,1,1);
                drawTriangle3D(v,uv,v);

                v = [];
                uv = [];

                v = v.concat(p1); uv = uv.concat([0,0]);
                v = v.concat(p4); uv = uv.concat([0,0]);
                v = v.concat(p3); uv = uv.concat([0,0]);
                gl.uniform4f(u_FragColor, 1,0,0,1);
                drawTriangle3D(v,uv,v);
            }    
        }*/
            if(this.vbuffer == null){
              this.vbuffer = gl.createBuffer();
              if (!this.vbuffer) {
                console.log("Failed to create the buffer object for verticies");
                return -1;
              }
            }
              gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuffer);
              gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
              gl.enableVertexAttribArray(a_Position);
          
            gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);
        
            
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

            gl.drawArrays(gl.TRIANGLES, 0, this.verticies.length/3);
    }
  }

  var vertexBuffer = null;
  var uvbuffer = null;
  var normalbuffer = null;
  
  function drawTriangle3D(verticies, uv, normal){
    var n = 3;
    if(vertexBuffer == null){
      vertexBuffer = gl.createBuffer();
    }
      //bind buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      //assign buffer object to a_Position variable
      //write data to buffer object
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verticies), gl.DYNAMIC_DRAW);
      //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      //enable assignment to a_position variable
      gl.enableVertexAttribArray(a_Position);
    
    
    

    if(uvbuffer == null){
      uvbuffer = gl.createBuffer();
      }
      //bind buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, uvbuffer);
      //assign buffer object to a_Position variable
      //write data to buffer object
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
      //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
      //enable assignment to a_position variable
      gl.enableVertexAttribArray(a_UV);
    


    if(normalbuffer == null){
      normalbuffer = gl.createBuffer();
    }
      //bind buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, normalbuffer);
      //assign buffer object to a_Position variable
      //write data to buffer object
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.DYNAMIC_DRAW);
      //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
      gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);
      //enable assignment to a_position variable
      gl.enableVertexAttribArray(a_normal);

    gl.drawArrays(gl.TRIANGLES, 0, n);
  }