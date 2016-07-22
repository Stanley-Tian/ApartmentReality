/**
 * Created by Administrator on 2016/7/22.
 */

var textureList = {
    "Sky": 	    new THREE.TextureLoader().load( "assets/Sky/Sky.jpg" ),
    "Ground": 	new THREE.TextureLoader().load( "assets/Ground/Ground.jpg" )
};

var materialList = {
    "Sky": 	    new THREE.MeshLambertMaterial( { color: 0x2222ff, map: textureList["Sky"], side: THREE.BackSide, combine: THREE.MixOperation, reflectivity: 0.8 } ),
    "Ground": 	new THREE.MeshLambertMaterial( { color: 0x22ff22, map: textureList["Ground"], side: THREE.DoubleSide, combine: THREE.MixOperation, reflectivity: 0.8 } )
};

var objectList = {
    "Sky": {
        name:	"Sky",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: new THREE.SphereBufferGeometry( 1000, 32, 32 ),
        materials: materialList["Sky"],
        object_url:    null,
        material_url:  null
    },
    "Ground": {
        name:	"Ground",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: new THREE.CylinderGeometry( 10000, 10000, 100, 32, 1 ),
        materials: materialList["Ground"],
        object_url:    null,
        material_url:  null
    },
    1: {
        name:	"House01_1st",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House01_1st.js",
        material_url:  null
    },
    2: {
        name:	"House01_2nd",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House01_2nd.js",
        material_url:  null
    },
    3: {
        name:	"House01_3rd",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House01_3rd.js",
        material_url:  null
    },
    4: {
        name:	"House02_1st",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House02_1st.js",
        material_url:  null
    },
    5: {
        name:	"House02_2nd",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House02_2nd.js",
        material_url:  null
    },

    6: {
        name:	"House02_3rd",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House02_3rd.js",
        material_url:  null
    },

    7: {
        name:	"House03_1st",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House03_1st.js",
        material_url:  null
    },
    8: {
        name:	"House03_2nd",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House03_2nd.js",
        material_url:  null
    },
    9: {
        name:	"House03_3rd",
        rotation: [ 0, 0, 0 ],
        position: [ 0, 0, 0 ],
        scale: 1,
        object: null,
        materials: null,
        object_url:    "assets/Models/House01/House03_3rd.js",
        material_url:  null
    },
    10: {
        name: 	"Apartment01",
        init_rotation: [ 0, 0, 0 ],
        init_position: [ 0, 0, 0 ],
        scale: 1,
        object:	null,
        materials: null,
        object_url:    "assets/Models/Apartment01/Apartment01.js",
        material_url:  null
    },
    11: {
        name: 	"Dormitory01",
        init_rotation: [ 0, 0, 0 ],
        init_position: [ 0, 0, 0 ],
        scale: 1,
        object:	null,
        materials: null,
        object_url:    "assets/Models/Dormitory01/Dormitory01.js",
        material_url:  null
    }
};

var lightList = {
    "AmbientLight":       new THREE.AmbientLight( 0x2222ff,  0.5 ),
    "DirectionalLight":   new THREE.DirectionalLight( 0xb8b8b8, 1.2 )
};
lightList["DirectionalLight"].position.set( -9, 8, -12 );
lightList["DirectionalLight"].castShadow = true;
lightList["DirectionalLight"].shadow.mapSize.width = 1024;
lightList["DirectionalLight"].shadow.mapSize.height = 1024;
lightList["DirectionalLight"].shadowCameraLeft = -15;
lightList["DirectionalLight"].shadowCameraRight = 15;
lightList["DirectionalLight"].shadowCameraTop = 15;
lightList["DirectionalLight"].shadowCameraBottom = -15;
lightList["DirectionalLight"].shadowBias = false;

