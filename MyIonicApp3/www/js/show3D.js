/**
 * Created by rwp on 2016/7/12.
 */
var scenesLoading=false;
var scenesIndex=0;
var scenes = [
    {
        index:      0 ,//default object
        models:[
            {
                name: 'House01_1st',
                path: 'assets/Models/House01/',
                obj:  'House01_1st_blender.obj',
                mtl:  'House01_1st_blender.mtl'
            },
            {
                name: 'House01_2nd',
                path: 'assets/Models/House01/',
                obj:  'House01_2nd_blender.obj',
                mtl:  'House01_2nd_blender.mtl'
            },
            {
                name: 'House01_3rd',
                path: 'assets/Models/House01/',
                obj:  'House01_3rd_blender.obj',
                mtl:  'House01_3rd_blender.mtl'
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 || this.index>2){
                this.index=0;
            }else{
                this.index=this.index+1;
            }
            this.onIndex(this.index);
        },
        // switch object showed in circular sequence
        onIndex:  function(index){
            if (index<0 || index>2){
                index=0;
            }
            this.index=index;
            switch(this.index){
                case 0:
                    ShowObject('House01_1st');
                    ShowObject('House01_2nd');
                    ShowObject('House01_3rd');
                    break;
                case 1:
                    ShowObject('House01_1st');
                    ShowObject('House01_2nd');
                    HideObject('House01_3rd');
                    break;
                case 2:
                    ShowObject('House01_1st');
                    HideObject('House01_2nd');
                    HideObject('House01_3rd');
                    break;
                default:
                    ShowObject('House01_1st');
                    ShowObject('House01_2nd');
                    ShowObject('House01_3rd');
                    break;
            }
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'A1_real',
                path: 'assets/Models/A1/',
                obj:  'A1_real.obj',
                mtl:  'A1_real.mtl'
            },
            {
                name: 'A1_transport',
                path: 'assets/Models/A1/',
                obj:  'A1_transport.obj',
                mtl:  'A1_transport.mtl'
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 ||this.index>1){
                this.index=0;
            }else{
                this.index=this.index+1;
            }
            this.onIndex(this.index);
        },
        // switch object showed in circular sequence
        onIndex:  function(index){
            if (index<0 || index>1){
                index=0;
            }
            this.index=index;
            switch(this.index){
                case 0:
                    ShowObject('A1_real');
                    HideObject('A1_transport');
                    break;
                case 1:
                    HideObject('A1_real');
                    ShowObject('A1_transport');
                    break;
                default:
                    ShowObject('A1_real');
                    HideObject('A1_transport');
                    break;
            }
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'A2_real',
                path: 'assets/Models/A2/',
                obj:  'A2_real.obj',
                mtl:  'A2_real.mtl'
            },
            {
                name: 'A2_transport',
                path: 'assets/Models/A2/',
                obj:  'A2_transport.obj',
                mtl:  'A2_transport.mtl'
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 ||this.index>1){
                this.index=0;
            }else{
                this.index=this.index+1;
            }
            this.onIndex(this.index);
        },
        // switch object showed in circular sequence
        onIndex:  function(index){
            if (index<0 || index>1){
                index=0;
            }
            this.index=index;
            switch(this.index){
                case 0:
                    ShowObject('A2_real');
                    HideObject('A2_transport');
                    break;
                case 1:
                    HideObject('A2_real');
                    ShowObject('A2_transport');
                    break;
                default:
                    ShowObject('A2_real');
                    HideObject('A2_transport');
                    break;
            }
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'A3_all',
                path: 'assets/Models/A3/',
                obj:  'A3_all.obj',
                mtl:  'A3_all.mtl'
            },
            {
                name: 'A3_center',
                path: 'assets/Models/A3/',
                obj:  'A3_center.obj',
                mtl:  'A3_center.mtl'
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 ||this.index>1){
                this.index=0;
            }else{
                this.index=this.index+1;
            }
            this.onIndex(this.index);
        },
        // switch object showed in circular sequence
        onIndex:  function(index){
            if (index<0 || index>1){
                index=0;
            }
            this.index=index;
            switch(this.index){
                case 0:
                    ShowObject('A3_all');
                    ShowObject('A3_center');
                    break;
                case 1:
                    HideObject('A3_all');
                    ShowObject('A3_center');
                    break;
                default:
                    ShowObject('A3_all');
                    ShowObject('A3_center');
                    break;
            }
        }
    }
];

var modelsNum=0;
var modelsLoaded=0;
function reloadModles(scIndex,onLoaded) {
    if(scenesLoading){
        console.log('Unfinished loading(>_<)');
        return;
    }
    scenesLoading=true;
    initControls('viewport');
    setupScene();
    ClearObject();
    var scenesNum=0;
    scenesIndex=0;
    if(scenes[scIndex]!=undefined){
        scenesIndex=scIndex;
    }
    modelsNum=0;
    modelsLoaded=0;
    for(var j in scenes[scenesIndex].models){
        modelsNum=modelsNum+1;
    }
    for(var i in scenes[scenesIndex].models){
        AddOBJMTLObject(scenes[scenesIndex].models[i].name,
            scenes[scenesIndex].models[i].path,
            scenes[scenesIndex].models[i].obj,
            scenes[scenesIndex].models[i].mtl,
            function(){
                //onLoading();
                modelsLoaded=modelsLoaded+1;
                if(modelsLoaded==modelsNum){
                    scenesLoading=false;
                    console.log('Load models completed(^_^)');
                    scenes[scenesIndex].onIndex(0);
                    //requestAnimationFrame(render);
                    onLoaded();
                }
            }
        );
    }
}
function switchTo() {
    if(scenesLoading){
        console.log('Unfinished loading(>_<)');
        return;
    }
    scenes[scenesIndex].onSwitch();
    requestAnimationFrame(render);
}
// function show2nd() {
//     ShowObject('House01_1st');
//     ShowObject('House01_2nd');
//     HideObject('House01_3rd');
//     requestAnimationFrame(render);
// }
// function showfull() {
//     ShowObject('House01_1st');
//     ShowObject('House01_2nd');
//     ShowObject('House01_3rd');
//     requestAnimationFrame(render);
// }
function startRender() {
    active=true;
    animate();
}
function stopRender() {
    active=false;
}