/**
 * Created by rwp on 2016/7/12.
 */
function show3D() {
  alert("show3D Model");
}
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, scene, camera, renderer;
function render() {
  if ( scene !== undefined ) {
    renderer.render( scene, camera );
  }
}
function setupLight() {
  var ambientLight = new THREE.AmbientLight( 0x222222 );
  ambientLight.intensity = 1.0;
  scene.add( ambientLight );
  var directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
  directionalLight.position.set( 0.8, -1.2, 1 ).normalize();
  directionalLight.intensity = 1.5;
  directionalLight.castShadow = true;
  scene.add( directionalLight );
  scene.add( new THREE.SpotLightHelper( directionalLight ) );
}
function setupScene() {
  scene = new THREE.Scene();
  scene.add( new THREE.GridHelper( 10, 2.5 ) );
  //scene.add( new THREE.AxisHelper( 10 ) );
  setupLight();
  render();
}
function loadJsonAll(path) {
  var loader = new THREE.ObjectLoader();
  loader.load( path,
    // Function when resource is loaded
    function ( object ) {
      scene.add( new THREE.GridHelper( 10, 2.5 ) );
      scene.add( object );
    },onProgress,onError
  );
}
function loadJsonObject(path) {
  var loader = new THREE.ObjectLoader();
  loader.load( path,
    // Function when resource is loaded
    function ( object ) {
      scene.add( new THREE.GridHelper( 10, 2.5 ) );
      scene.add( object );
    },onProgress,onError
  );
}
function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  render();
}
var onProgress =function ( xhr ) {
  console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
};
var onError =function ( xhr ) {
  console.log( 'An error happened' );
};
function init() {
  container = document.getElementById( 'viewport' );
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true	} );
  renderer.setClearColor( 0x000000, 0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  var aspect = container.offsetWidth / container.offsetHeight;
  camera = new THREE.PerspectiveCamera( 60, aspect, 0.01, 50 );
  orbit = new THREE.OrbitControls( camera, container );
  orbit.addEventListener( 'change', render );
  camera.position.z = 5;
  camera.position.x = 5;
  camera.position.y = 5;
  var target = new THREE.Vector3( 0, 1, 0 );
  camera.lookAt( target );
  orbit.target = target;
  camera.updateProjectionMatrix();
  window.addEventListener( 'resize', onWindowResize, false );
  setupScene();
  loadJsonObject('assets/HouseModles/basic_scene.json');
  render();
  //console.dir(container);
}
