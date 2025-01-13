// DrawRectangle.js
function main() {
     // Retrieve <canvas> element <- (1)
    canvas = document.getElementById('cnv1');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
     // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');

    // Draw a blue rectangle <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
 
    /*let v1 = new Vector3([2.25, 2.25, 0]);
    console.log(v1);
    drawVector(v1, 'red');*/

}

function drawVector(v, color){
    ctx.strokeStyle = color;
    let cx = canvas.width/2;
    let cy = canvas.height/2;

    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx + v.elements[0]*20, cy - v.elements[1]*20);
    ctx.stroke();
}

function handleDrawEvent(){
    let v1 = document.getElementById("val1").value;
    //console.log(v1);
    let v2 = document.getElementById("val2").value;
    //console.log(v2);
    let v3 = document.getElementById("val3").value;
    //console.log(v3);
    let v4 = document.getElementById("val4").value;
    //console.log(v4);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    vec = new Vector3([v1, v2, 0]);
    drawVector(vec, 'red');
    vec2 = new Vector3([v3, v4, 0]);
    drawVector(vec2, 'blue');

    /*ctx.strokeStyle = 'red';

    let cx = canvas.width/2;
    let cy = canvas.height/2;

    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx + 75, cy + 50);
    ctx.stroke();*/
}

function handleDrawOperationEvent(){
    //console.log("clicked operation button")
    handleDrawEvent();
    vec3 = new Vector3();
    vec3.set(vec);
    //console.log(vec3);
    let op = document.getElementById("operation").value;
    if(op === "add")
    {
        vec3.add(vec2);
        //console.log(vec3);
        drawVector(vec3, 'green');
    }
    else if(op === "sub")
    {
        vec3.sub(vec2);
        //console.log(vec3);
        drawVector(vec3, 'green');
    }
    else if(op === "mul")
    {
        let scale = document.getElementById("scale").value;
        vec4 = new Vector3();
        vec4.set(vec2);
        vec3.mul(scale);
        vec4.mul(scale);
        drawVector(vec3, 'green');
        drawVector(vec4, 'green');
    }
    else if(op === "div")
    {
        let scale = document.getElementById("scale").value;
        vec4 = new Vector3();
        vec4.set(vec2);
        vec3.div(scale);
        vec4.div(scale);
        drawVector(vec3, 'green');
        drawVector(vec4, 'green');
    }
    else if(op === "angle")
    {
        console.log("Angle: "+ angleBetween(vec, vec2));
    }
    else if(op === "area")
    {
        console.log("Area: " + areaTriangle(vec, vec2));
    }
    else if(op === "mag")
    {
        let m = vec.magnitude();
        let n = vec2.magnitude();
        console.log("Magnitude v1: " + m);
        console.log("Magnitude v2: " +n);
    }
    else if(op == "norm")
    {
        vec.normalize();
        vec2.normalize();
        drawVector(vec, 'green');
        drawVector(vec2, 'green');
    }
}

function angleBetween(v1, v2){
    let dot = Vector3.dot(v1, v2);
    let v1mag = v1.magnitude();
    let v2mag = v2.magnitude();
    let angle = Math.acos(dot/(v1mag*v2mag));
    angle = angle * (180/Math.PI);
    return angle;
}

function areaTriangle(v1, v2)
{
    let v3 = Vector3.cross(v1, v2);
    let area = v3.magnitude();
    area = area/2;
    return area;
}