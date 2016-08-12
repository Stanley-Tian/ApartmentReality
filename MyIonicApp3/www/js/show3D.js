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
                mtl:  'House01_1st_blender.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
            },
            {
                name: 'House01_2nd',
                path: 'assets/Models/House01/',
                obj:  'House01_2nd_blender.obj',
                mtl:  'House01_2nd_blender.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
            },
            {
                name: 'House01_3rd',
                path: 'assets/Models/House01/',
                obj:  'House01_3rd_blender.obj',
                mtl:  'House01_3rd_blender.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 || this.index>1){
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
                name: 'A1',
                path: 'assets/Models/A1/',
                obj:  'A1.obj',
                mtl:  'A1.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
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
            ShowObject('A1');
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'A2',
                path: 'assets/Models/A2/',
                obj:  'A2.obj',
                mtl:  'A2.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
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
            ShowObject('A2');
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'A3_all',
                path: 'assets/Models/A3_all/',
                obj:  'A3_all.obj',
                mtl:  'A3_all.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [0.5,0.5,0.5]
            },
            {
                name: 'A3_center',
                path: 'assets/Models/A3_all/',
                obj:  'A3_center.obj',
                mtl:  'A3_center.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [0.5,0.5,0.5]
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 ||this.index>0){
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
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'A4',
                path: 'assets/Models/A4/',
                obj:  'A4.obj',
                mtl:  'A4.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
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
            ShowObject('A4');
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'A5',
                path: 'assets/Models/A5/',
                obj:  'A5.obj',
                mtl:  'A5.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 ||this.index>0){
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
            ShowObject('A5');
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'B1',
                path: 'assets/Models/B1/',
                obj:  'B1.obj',
                mtl:  'B1.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 ||this.index>0){
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
            ShowObject('B1');
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'B2',
                path: 'assets/Models/B2/',
                obj:  'B2.obj',
                mtl:  'B2.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 ||this.index>0){
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
            ShowObject('B2');
        }
    },
    {
        index:       0,//default object
        models:[
            {
                name: 'D1',
                path: 'assets/Models/D1/',
                obj:  'D1.obj',
                mtl:  'D1.mtl',
                initPosition: [0, 0, 0], initRotation: [0, 0, 0], initScale: [1,1,1]
            }
        ],
        // switch object showed in circular sequence
        onSwitch:  function(){
            if(this.index<0 ||this.index>0){
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
            ShowObject('D1');
        }
    }
];

var modelsNum=0;
var modelsLoaded=0;
function reloadModels(scIndex,onLoaded,onError) {
    var scIndexInter = 0;
    if(scIndex<0 || scIndex>7){
        scIndexInter=0;
    }else{
        scIndexInter=scIndex+1;
    }
    
    if(scenesLoading){
        console.log('Unfinished loading(>_<)');
        return;
    }
    scenesLoading=true;
    initControls('viewport');
    setupScene();
    ClearObject();
    var scenesNum=0;
    scenesIndex=scIndexInter;
    if(scenes[scIndexInter]!=undefined){
        scenesIndex=scIndexInter;
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
            scenes[scenesIndex].models[i].initPosition,
            scenes[scenesIndex].models[i].initRotation,
            scenes[scenesIndex].models[i].initScale,
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
            },
          function ()
          {
            onError();
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
function startRender() {
    active=true;
    requestAnimationFrame(render);
}
function stopRender() {
    active=false;
}
function onChangeModel(){
   // alert("tmt_house_id: "+tmt_house_id);
  $LoadCtrl.show({
    
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 600,
    showDelay: 0
  });
  reloadModels(tmt_house_id,
    function(){
      startRender();
      $LoadCtrl.hide();
    },
    function() {
      $LoadCtrl.hide();
      alert("load error!");
    }
  );
}
