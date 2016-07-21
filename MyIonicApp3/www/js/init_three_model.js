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
var container, scene, camera, renderer,ambientLight,directionalLight,planeMesh,skyMesh;
var sky, sunSphere;
var active = false;
function render() {
    if ( scene !== undefined ) {
        renderer.render( scene, camera );
    }
}

function setupScene() {
    scene = new THREE.Scene();
    scene.add( new THREE.AxisHelper(5) );

    //light
    ambientLight = new THREE.AmbientLight( 0xffffff );
    ambientLight.intensity = 0.5;
    scene.add( ambientLight );
    directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
    directionalLight.position.set( -10, 5, -10 );
    directionalLight.intensity = 1.2;
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadowCameraLeft = -15;
    directionalLight.shadowCameraRight = 15;
    directionalLight.shadowCameraTop = 15;
    directionalLight.shadowCameraBottom = -15;
    directionalLight.shadowBias = false;
    scene.add( directionalLight );
    scene.add( new THREE.DirectionalLightHelper( directionalLight ) );

    //ground
    var planeGeometry = new THREE.CylinderGeometry( 1000, 1000, 1000, 32, 1 );
    //planeGeometry.rotateX( - Math.PI / 2 );
    planeGeometry.translate(0,-503.01,0);
    //var planeTexture = new THREE.TextureLoader().load( "assets/HouseModles/ground.jpg" ); , map: planeTexture} 
    var planeMaterial = new THREE.MeshLambertMaterial( { color: 0x009900, side: THREE.DoubleSide });
    planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
    planeMesh.receiveShadow=true;
    scene.add( planeMesh );

    //sky
    // method 1
    // var skyGeometry = new THREE.SphereBufferGeometry( 1000, 32, 32 );
    // skyGeometry.translate(0,-3,0);
    // var skyTexture = new THREE.TextureLoader().load( "assets/HouseModles/blue.jpg" );
    // var skyMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff , map: skyTexture} );
    // skyMesh = new THREE.Mesh( skyGeometry, skyMaterial );
    // method 2
    var textureCube = new THREE.CubeTextureLoader()
        .setPath( 'assets/Textures/cube/Bridge2/')
        .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
    scene.background = textureCube;
    // method 3
    //initSky();

    //objectList
    objectList = new Array();

    // innerLight = new THREE.SpotLight( 0xffffff);
    // innerLight.intensity = 10.0;
    // innerLight.position.set( -2, 0.5, 1 );
    // innerLight.shadow.mapSize.width = 1024;
    // innerLight.shadow.mapSize.height = 1024;
    // innerLight.distance=0;
    // innerLight.shadow.camera.near = 0;
    // innerLight.shadow.camera.far = 2;
    // innerLight.angle = Math.PI/4;
    // innerLight.castShadow = true;
    // var innerLighttarget = new THREE.Object3D();
    // innerLighttarget.position=new THREE.Vector3( -2, -10, 0 );
    // scene.add( innerLighttarget);
    // innerLight.target=innerLighttarget;
    // scene.add( innerLight);
    // scene.add( new THREE.SpotLightHelper( innerLight ) );
}
var objectList;
function AddJsonObject(path, nameStr) {
    //find object, if exist do nothing
    for (var i = 0; i < objectList.length; i++) {
        if (objectList[i].Name == nameStr) {
            return;
        }
    }
    var loader = new THREE.ObjectLoader();
    var object3D = loader.load( path,
        // Function when resource is loaded
        function ( object3D ) {
            object3D.castShadow = true;
            object3D.receiveShadow=true;
            //console.log("onLoadJson");
            //add object and name into objectList
            objectList.push(
                {
                    Name: nameStr,
                    Object: object3D,
                    IsHide: false
                }
            );
            scene.add(object3D);
            //object3D.setVisible(true);
        } ,onProgress,onError
    );
}
function HideObject(nameStr) {
    var index=-1;
    //find object, if exist do nothing
    for (var i = 0; i < objectList.length; i++) {
        if (objectList[i].Name == nameStr) {
            index=i;
            break;
        }
    }
    //hide object from scene and objectList
    if(index>=0) {
        if(objectList[index].IsHide == false){
            //scene;
            //scene.removeObject(objectList[index].Object);
            objectList[index].Object.position.x=40;
            objectList[index].IsHide = true;
        }
    }
}
function ShowObject(nameStr) {
    var index=-1;
    //find object, if exist do nothing
    for (var i = 0; i < objectList.length; i++) {
        if (objectList[i].Name == nameStr) {
            index=i;
            break;
        }
    }
    //show object from scene and objectList
    if(index>=0) {
        if(objectList[index].IsHide == true){
            //scene;
            //scene.add(objectList[index].Object);
            objectList[index].Object.position.x=0;
            objectList[index].IsHide = false;
        }
    }
}
function ShowAllObject() {
    //find object, if exist do nothing
    for (var i = 0; i < objectList.length; i++) {
        if (objectList[i].Name == nameStr) {
            if(objectList[i].IsHide == true){
                //scene.add(objectList[index].Object);
                objectList[index].Object.position.x=0;
                objectList[index].IsHide = false;
            }
        }
    }
}
function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    if(active){
        render();
    }
}
var onProgress =function ( xhr ) {
};
var onError =function ( xhr ) {
    console.log( 'An error happened' );
};
function initControls(element_id) {
    container = document.getElementById( element_id );
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true	} );
    renderer.shadowMapEnabled=true;
    renderer.shadowMapType=THREE.PCFSoftShadowMap;
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    var aspect = container.offsetWidth / container.offsetHeight;
    camera = new THREE.PerspectiveCamera( 60, aspect, 0.01, 5000 );
    orbit = new THREE.OrbitControls( camera, container );
    orbit.addEventListener( 'change', render );
    camera.position.z = -20;
    camera.position.x = 0;
    camera.position.y = 0;
    var target = new THREE.Vector3( 0, 1, 0 );
    camera.lookAt( target );
    orbit.target = target;
    camera.updateProjectionMatrix();
    window.addEventListener( 'resize', onWindowResize, false );
}
function animate() {
    if(active){
        // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestAnimationFrame(animate);
        // Render the scene.
        render();
        //orbit.update();
    }
}