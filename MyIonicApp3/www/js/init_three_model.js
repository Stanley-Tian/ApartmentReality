/**
 * Created by Tevil on 2016/7/12.
 */
/**
 * 用法：
 *     initControls('viewport');
 loadModel('assets/Models/basic_scene.json');
 animate();
 */
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var orbit, container, scene, camera, renderer,ambientLight,directionalLight,planeMesh,skyMesh;
var olddom =null;
//var sky, sunSphere;
var active = false;
function render() {
    if ( scene !== undefined ) {
        renderer.render( scene, camera );
    }
}

function setupScene() {
    scene = new THREE.Scene();
    //scene.add( new THREE.AxisHelper(5) );

    //light
    ambientLight = new THREE.AmbientLight( 0xffffff );
    ambientLight.intensity = 0.5;
    scene.add( ambientLight );
    directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
    directionalLight.position.set( -9, 8, -12 );
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
    //scene.add( new THREE.DirectionalLightHelper( directionalLight ) );

    //ground
    var planeGeometry = new THREE.CylinderGeometry( 10000, 10000, 100, 32, 1 );
    //planeGeometry.rotateX( - Math.PI / 2 );
    planeGeometry.translate(0,-53.01,0);
    //var planeTexture = new THREE.TextureLoader().load( "assets/Models/ground.jpg" ); , map: planeTexture} 
    var planeMaterial = new THREE.MeshLambertMaterial( { color: 0x009900, side: THREE.DoubleSide });
    planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
    planeMesh.receiveShadow=true;
    scene.add( planeMesh );

    //sky
    // method 1
    var skyGeometry = new THREE.SphereBufferGeometry( 1000, 32, 32 );
    skyGeometry.translate(0,-3,0);
    var skyTexture = new THREE.TextureLoader().load( "assets/Textures/sky.jpg" );
    var skyMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, map: skyTexture , side: THREE.BackSide} );
    skyMesh = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add( skyMesh);
    // method 2
    // var textureCube = new THREE.CubeTextureLoader()
    //     .setPath( 'assets/Textures/cube/Bridge2/')
    //     .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
    // scene.background = textureCube;
    // method 3
    // var sky = new THREE.Sky();
    // scene.add( sky.mesh );
    
    //meshList
    objectList = new Array();
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
            //add object and name into meshList
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
function AddOBJMTLObject(nameStr,path, obj, mtl,onLoaded) {
    //find object, if exist do nothing
    for (var i = 0; i < objectList.length; i++) {
        if (objectList[i].Name == nameStr) {
            return;
        }
    }
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( path );
    mtlLoader.load( mtl, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( path );
        objLoader.load( obj, function ( object ) {
            object.castShadow = true;
            object.receiveShadow=true;
            objectList.push(
                {
                    Name: nameStr,
                    Object: object,
                    IsHide: false
                }
            );
            scene.add( object );
            onLoaded();
        }, onProgress, onError );

    });
}
function ClearObject(){
    objectList = new Array();
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
    //hide object from scene and meshList
    if(index>=0) {
        if(objectList[index].IsHide == false){
            //scene;
            //scene.removeObject(meshList[index].Object);
            //meshList[index].Object.position.x=40;
            objectList[index].Object.visible=false;
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
    //show object from scene and meshList
    if(index>=0) {
        if(objectList[index].IsHide == true){
            //scene;
            //scene.add(meshList[index].Object);
            //meshList[index].Object.position.x=0;
            objectList[index].Object.visible=true;
            objectList[index].IsHide = false;
        }
    }
}
function ShowAllObject() {
    //find object, if exist do nothing
    for (var i = 0; i < objectList.length; i++) {
        if (objectList[i].Name == nameStr) {
            if(objectList[i].IsHide == true){
                //scene.add(meshList[index].Object);
                // meshList[index].Object.position.x=0;
                objectList[index].Object.visible=true;
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
    if(olddom!=null){
        container.removeChild(olddom);
    }
    container = document.getElementById( element_id );
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true	} );
    renderer.shadowMapEnabled=true;
    renderer.shadowMapType=THREE.PCFSoftShadowMap;
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    olddom = renderer.domElement;
    var aspect = container.offsetWidth / container.offsetHeight;
    camera = new THREE.PerspectiveCamera( 60, aspect );
    orbit = new THREE.OrbitControls( camera, container );
    orbit.maxPolarAngle = Math.PI/2;
    orbit.minDistance = 8;
    orbit.maxDistance = 100;
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