//classes of all the shapes used
class Point{
    constructor(){
      this.type = 'point';
      this.position = [0,0,0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
  
    render(){
      var xy = this.position;//g_points[i];
      var rgba =this.color;//g_colors[i];
      var size = this.size;//g_sizes[i];
      gl.disableVertexAttribArray(a_Position);
      // Pass the position of a point to a_Position variable
      gl.vertexAttrib4f(a_Position, xy[0], xy[1], 0.0, 1.0);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
      // Draw
      gl.uniform1f(u_Size, size);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }

class Triangle{
  constructor(){
    this.type = 'triangle';
    this.position = [0,0,0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render(){
    var xy = this.position;
      var rgba =this.color;
      var size = this.size;
      // Pass the color of a point to u_Color variable
      gl.uniform4f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform1f(u_Size, size);

      var d = this.size/200.0;
      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], (xy[0]+(xy[0]+d))/2, xy[1]+d]);
  }
}
class Rectangle{
  constructor(){
    this.type = 'rectangle';
    this.position = [0,0,0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render(){
      var xy = this.position;
      var rgba =this.color;
      var size = this.size;
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
      // Draw
      gl.uniform1f(u_Size, size);

      var d = this.size/200.0;

      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
      drawTriangle([xy[0]+d, xy[1]+d, xy[0]+d, xy[1], xy[0], xy[1]+d]);
  }
}

class Circle{
  constructor(){
    this.type = 'circle';
    this.position = [0,0,0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5;
    this.segment = 10;
  }

  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    gl.uniform4f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
    var d = this.size/200.0;

    //draw the amount of triangles in the proper position to create the circle with the proper segments
    let angleStep = 360/this.segment;
    for(var angle = 0; angle < 360; angle = angle+angleStep){
      let centerpt = [xy[0], xy[1]];
      let angle1 = angle;
      let angle2 = angle+angleStep;
      let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
      let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
      let p1 = [centerpt[0]+vec1[0], centerpt[1]+vec1[1]];
      let p2 = [centerpt[0]+vec2[0], centerpt[1]+vec2[1]];

      drawTriangle([xy[0], xy[1], p1[0], p1[1], p2[0], p2[1]]);
    }
  }
}
class Picture{
  constructor(){
    this.type = 'picture';
    this.position = [0,0,0,0,0,0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render(){
      var xy = this.position;
      var rgba =this.color;
      var size = this.size;
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
      // Draw
      gl.uniform1f(u_Size, size);

      drawTriangle([xy[0]/10, xy[1]/10, xy[2]/10, xy[3]/10, xy[4]/10, xy[5]/10]);
  }
}
function drawTriangle(verticies){
  var n =3;
  let vertexBuffer = gl.createBuffer();
 
  //bind buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //write data to buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
  //assign buffer object to a_Position variable
  //2nd value is amount of verticies registered -> 2 for x,y -> 3 for x,y,z
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  //enable assignment to a_position variable
  gl.enableVertexAttribArray(a_Position);
 
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
