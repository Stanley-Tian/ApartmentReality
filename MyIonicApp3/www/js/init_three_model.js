/**
 * Created by Tevil on 2016/7/12.
 */
/**
 * 用法：
 *     initControls('viewport');
 loadModel('assets/HouseModles/basic_scene.json');
 animate();
 */
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, scene, camera, renderer;
function render() {
    if ( scene !== undefined ) {
        renderer.render( scene, camera );
    }
}
function setupScene() {
    scene = new THREE.Scene();
    scene.add( new THREE.AxisHelper(5) );
    var ambientLight = new THREE.AmbientLight( 0xffffff );
    ambientLight.intensity = 0.5;
    scene.add( ambientLight );
    var directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
    directionalLight.position.set( 0.8, -1.2, 1 ).normalize();
    directionalLight.intensity = 0.8;
    directionalLight.castShadow = true;
    scene.add( directionalLight );
    scene.add( new THREE.SpotLightHelper( directionalLight ) );
    var innerLight = new THREE.SpotLight( 0xffffff );
    innerLight.position.set( 2, 0, 0 );
    innerLight.castShadow = true;
    scene.add( innerLight );
    var innerLightHelper = new THREE.SpotLightHelper( innerLight );
    scene.add( innerLightHelper );
}

function loadJsonObject(path) {
    var loader = new THREE.ObjectLoader();
    loader.load( path,
        // Function when resource is loaded
        function ( object ) {
            object.castShadow = true;
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
};
var onError =function ( xhr ) {
    console.log( 'An error happened' );
};
function initControls(element_id) {
    container = document.getElementById( element_id );
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true	} );
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    var aspect = container.offsetWidth / container.offsetHeight;
    camera = new THREE.PerspectiveCamera( 60, aspect, 0.01, 500 );
    orbit = new THREE.OrbitControls( camera, container );
    orbit.addEventListener( 'change', render );
    camera.position.z = 20;
    camera.position.x = 0;
    camera.position.y = 0;
    var target = new THREE.Vector3( 0, 1, 0 );
    camera.lookAt( target );
    orbit.target = target;
    camera.updateProjectionMatrix();
    window.addEventListener( 'resize', onWindowResize, false );
    //console.dir(container);
}
// function loadModel(model_url) {
//     setupScene();
//     loadJsonObject(model_url);
// }
function animate() {
    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animate);
    // Render the scene.
    render();
    //orbit.update();
}