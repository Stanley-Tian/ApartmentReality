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
var container, scene, camera, renderer,ambientLight,directionalLight;
function render() {
    if ( scene !== undefined ) {
        renderer.render( scene, camera );
    }
}
function setupScene() {
    scene = new THREE.Scene();
    scene.add( new THREE.AxisHelper(5) );
    ambientLight = new THREE.AmbientLight( 0xffffff );
    ambientLight.intensity = 0.6;
    scene.add( ambientLight );
    directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
    directionalLight.position.set( -5, 10, -5 );
    directionalLight.intensity = 1.2;
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadowCameraLeft = -20;
    directionalLight.shadowCameraRight = 20;
    directionalLight.shadowCameraTop = 20;
    directionalLight.shadowCameraBottom = -20;
    directionalLight.shadowBias = false;
    scene.add( directionalLight );
    scene.add( new THREE.DirectionalLightHelper( directionalLight ) );
    objectList = new Array();
    // innerLight = new THREE.PointLight( 0xffffff,5);
    // innerLight.position.set( 0, 0, 0);
    // innerLight.distance = 0;
    // // innerLight.decay = 2;
    // // innerLight.castShadow = true;
    // // innerLight.shadow.mapSize.width = 1024;
    // // innerLight.shadow.mapSize.height = 1024;
    // scene.add( innerLight);
    // scene.add( new THREE.PointLightHelper( innerLight ) );


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
    render();
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
    render();
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
    render();
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
    renderer.shadowMapEnabled=true;
    renderer.shadowMapType=THREE.PCFShadowMap;
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    var aspect = container.offsetWidth / container.offsetHeight;
    camera = new THREE.PerspectiveCamera( 60, aspect, 0.01, 500 );
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
    //console.dir(container);
}
// function loadModel(model_url) {
//     setupScene();
//     AddJsonObject(model_url);
// }
function animate() {
    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animate);
    // Render the scene.
    render();
    //orbit.update();
}