"use strict";
const Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);

  this.vsTrafo = new Shader(gl, gl.VERTEX_SHADER, "trafo_vs.essl");
  this.vsGround = new Shader(gl, gl.VERTEX_SHADER, "ground_vs.essl");
  this.fsSpotlight = new Shader(gl, gl.FRAGMENT_SHADER, "spotlight_fs.essl");
  this.fsSunshine = new Shader(gl, gl.FRAGMENT_SHADER, "sunshine_fs.essl");
  this.fsGround = new Shader(gl, gl.FRAGMENT_SHADER, "ground_fs.essl");
  this.spotlightProgram = new TexturedProgram(gl, this.vsTrafo, this.fsSpotlight);
  this.sunshineProgram = new TexturedProgram(gl, this.vsTrafo, this.fsSunshine);
  this.infiniteQuadProgram = new TexturedProgram(gl, this.vsGround, this.fsGround);  
  this.infiniteQuad = new InfiniteQuadGeometry(gl)

  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.slowpokeMaterials = [
    new Material(gl, this.spotlightProgram),
    new Material(gl, this.spotlightProgram),
    ];
  this.sunpokeMaterials = [
    new Material(gl, this.sunshineProgram),
    new Material(gl, this.sunshineProgram),
    ];
  this.groundMaterial = new Material(gl, this.infiniteQuadProgram);
  this.shadowMaterial = new Material(gl, this.solidProgram);
  this.shadowMaterial.solidColor.set(0.0, 0.0, 0.0, 0.9);


  this.slowpokeMaterials[0].colorTexture.set(
    new Texture2D(gl, 'media/slowpoke/YadonDh.png'));
  this.slowpokeMaterials[1].colorTexture.set(
    new Texture2D(gl, 'media/slowpoke/YadonEyeDh.png')); 
  this.sunpokeMaterials[0].colorTexture.set(
    new Texture2D(gl, 'media/slowpoke/YadonDh.png'));
  this.sunpokeMaterials[1].colorTexture.set(
    new Texture2D(gl, 'media/slowpoke/YadonEyeDh.png'));  
  this.groundMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"));


  this.slowpokeMesh = new MultiMesh(
    gl,
    'media/slowpoke/Slowpoke.json',
    this.slowpokeMaterials
    );
  this.sunpokeMesh = new MultiMesh(
    gl,
    'media/slowpoke/Slowpoke.json',
    this.sunpokeMaterials
    );

  this.groundMesh = new Mesh(this.infiniteQuad, this.groundMaterial);
  this.groundObject = new GameObject(this.groundMesh);
  this.groundObject.drawShadow = function(material, camera){}



  this.gameObjects = [];
  this.gameObjects.push(new GameObject(this.slowpokeMesh));
  this.gameObjects.push(new GameObject(this.sunpokeMesh));
  this.gameObjects.push(this.groundObject);
  this.gameObjects[0].position.set(10, 0, 0);
  this.gameObjects[1].position.set(-10, 0, 0);

  this.camera = new PerspectiveCamera();

  gl.enable(gl.DEPTH_TEST);

  this.rand1 = Math.random()*3.0;
  this.rand2 = Math.random()*3.0;
  this.rand3 = Math.random()*3.0;
  this.rand4 = Math.random()*3.0;
  this.rand5 = Math.random();
  this.rand6 = Math.random();
  this.rand7 = Math.random();
  this.rand8 = Math.random();
  this.rand9 = Math.random();
  this.rand0 = Math.random();

};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.1, 0.5, 0.9, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.camera.move(dt, keysPressed);
  this.gameObjects[0].move(dt, keysPressed);
  Uniforms.camera.position.set(this.camera.position);

  for(let i=0; i<this.gameObjects.length; i++){
    this.gameObjects[i].draw(this.camera);
    this.gameObjects[i].drawShadow(this.shadowMaterial, this.camera, new Vec3(10, 10, 0));

  }

  Uniforms.lighting.position.at(0).set(5, 5, 5, 1);  //spotlight location
  Uniforms.lighting.powerDensity.at(0).set(0.9, 0.3, 0.3, 0.5);  //spotlight color

  Uniforms.lighting.position.at(1).set(10, 10, 0, 0);   //sun direction
  Uniforms.lighting.powerDensity.at(1).set(0.2, 0.2, 0.2, 0.2) //sun color

  Uniforms.wood.colorA.at(0).set(this.rand5, this.rand6, this.rand7);
  Uniforms.wood.colorB.at(0).set(this.rand8, this.rand9, this.rand0);
  Uniforms.wood.freq.at(0).set(this.rand1);
  Uniforms.wood.noiseFreq.at(0).set(this.rand2);
  Uniforms.wood.noiseExp.at(0).set(this.rand3);
  Uniforms.wood.noiseAmp.at(0).set(this.rand4);

  Uniforms.material.shininess.at(1).set(20.0)
  Uniforms.material.color.at(1).set(0.9, 0.9, 0.9, 0.9);
};


