"use strict"; 
const GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 

  this.ahead = new Vec3(0.0, 0.0, 1.0); 
  this.right = new Vec3(1.0, 0.0, 0.0); 
  this.speed = 50; 

  this.modelMatrix = new Mat4(); 
};

GameObject.prototype.updateModelMatrix =
                              function(){ 
// TODO: set the game object’s model matrix property according to the position, orientation, and scale
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation).
    translate(this.position);
};

GameObject.prototype.draw = function(camera){ 

  this.updateModelMatrix();
// TODO: Set the uniform modelViewProjMatrix (reflected in the material) from the modelMatrix property of GameObject (no camera yet). Operator = cannot be used. Use Mat4’s methods set() and/or mul().
  Uniforms.gameObject.modelMatrix.set(this.modelMatrix);
  Uniforms.gameObject.modelMatrixInverse.set(this.modelMatrix.clone().invert());
  Uniforms.gameObject.animScale.set(1, 1);
  Uniforms.gameObject.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  this.mesh.draw(); 
};

GameObject.prototype.move = function(dt, keysPressed) { 
 if(keysPressed.DOWN) { 
    this.position.addScaled(this.speed * dt, this.ahead); 
  } 
  if(keysPressed.UP) { 
    this.position.addScaled(-this.speed * dt, this.ahead); 
  } 
  if(keysPressed.RIGHT) { 
    this.position.addScaled(this.speed * dt, this.right);
  } 
  if(keysPressed.LEFT) { 
    this.position.addScaled(-this.speed * dt, this.right); 
  }
  
  this.updateModelMatrix(); 
}; 

GameObject.prototype.drawShadow = function(material, camera, lightPos) {
  var sheer = new Mat4 (
    1,0,0,0,
    -lightPos.x/lightPos.y,0,-lightPos.z/lightPos.y,0,
    0,0,1,0,
    0,0,0,1,
  ); 
  this.updateModelMatrix();
  Uniforms.gameObject.modelMatrix.set(this.modelMatrix);
  Uniforms.gameObject.modelMatrixInverse.set(this.modelMatrix.clone().invert());
  Uniforms.gameObject.animScale.set(1, 1);
  Uniforms.gameObject.modelViewProjMatrix.set(this.modelMatrix).mul(sheer).scale(1.0, 0.0, 1.0).translate(0.0, 0.01, 0.0).mul(camera.viewProjMatrix);
  this.mesh.drawShadow(material);

}
