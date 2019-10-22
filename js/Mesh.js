"use strict"; 
const Mesh = function(geometry, material) {
  this.geometry = geometry;
  this.material = material;
};

Mesh.prototype.draw = function(){
  this.material.commit();
  this.geometry.draw();
};

Mesh.prototype.drawShadow = function(material) {
	material.commit();
	this.geometry.draw();
}