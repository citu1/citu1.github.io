class Camera{
    constructor(cw, ch){
        this.fov = 60;
        this.eye = new Vector3([16,0,0]);
        this.at = new Vector3([0,0,0]);
        this.up = new Vector3([0,1,0]);
        this.viewMat = new Matrix4();
        this.projMat = new Matrix4();
        this.f = new Vector3();
  
        this.viewMat.setLookAt(
        this.eye.elements[0],this.eye.elements[1],this.eye.elements[2], 
        this.at.elements[0],this.at.elements[1],this.at.elements[2],
        this.up.elements[0],this.up.elements[1],this.up.elements[2]
        );

        this.projMat.setPerspective(this.fov, cw/ch, 0.1, 1000);//near plane: .1, far plane: 1000
        //console.log("Eye location: "+this.eye.elements);
        //console.log("at location: "+this.at.elements);
    }

    //double check how this math works
    forward(){
        this.f.set(this.at);
        this.f.sub(this.eye);
        this.f.normalize();
        this.at.add(this.f);
        this.eye.add(this.f);
        //console.log("Eye location: "+this.eye.elements);
        //console.log("at location: "+this.at.elements);
    }
    back(){
        this.f.set(this.eye);
        this.f.sub(this.at);
        this.f.normalize()
        this.at.add(this.f);
        this.eye.add(this.f);
        //console.log("Eye location: "+this.eye.elements);
        //console.log("at location: "+this.at.elements);
    }
    left(){
        this.f.set(this.at);
        this.f.sub(this.eye);
        //f.div(f.elements.length);
        var s = Vector3.cross(this.up,this.f);
        s.normalize();
        this.at.add(s);
        this.eye.add(s);
        //console.log("Eye location: "+this.eye.elements);
        //console.log("at location: "+this.at.elements);
    }
    right(){
        this.f.set(this.at);
        this.f.sub(this.eye);
        //f.div(f.elements.length);
        var s = Vector3.cross(this.f,this.up);
        s.normalize();
        this.at.add(s);
        this.eye.add(s);
        //console.log("Eye location: "+this.eye.elements);
        //console.log("at location: "+this.at.elements);
    }
    panl(angle =5){
        this.f.set(this.at);
        this.f.sub(this.eye);
        var rotMat = new Matrix4();
        rotMat.setRotate(angle, this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        var f_prime = rotMat.multiplyVector3(this.f);
        f_prime.add(this.eye);
        this.at.set(f_prime);
    }
    panr(angle = -5){
        this.f.set(this.at);
        this.f.sub(this.eye);
        var rotMat = new Matrix4();
        rotMat.setRotate(angle, this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        var f_prime = rotMat.multiplyVector3(this.f);
        f_prime.add(this.eye);
        this.at.set(f_prime);
    }
}