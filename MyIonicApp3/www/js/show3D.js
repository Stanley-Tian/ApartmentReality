/**
 * Created by rwp on 2016/7/12.
 */

function reloadModles() {
    initControls('viewport');
    setupScene();
    AddOBJMTL('assets/Models/House01/','House01_1st_blender.obj','House01_1st_blender.mtl','House01_1st');
    AddOBJMTL('assets/Models/House01/','House01_2nd_blender.obj','House01_2nd_blender.mtl','House01_2nd');
    AddOBJMTL('assets/Models/House01/','House01_3rd_blender.obj','House01_3rd_blender.mtl','House01_3rd');
    //sleep(100);
    //HideObject('BS_0_first');
    requestAnimationFrame(render);
}
function show1st() {
    ShowObject('House01_1st');
    HideObject('House01_2nd');
    HideObject('House01_3rd');
    requestAnimationFrame(render);
}
function show2nd() {
    ShowObject('House01_1st');
    ShowObject('House01_2nd');
    HideObject('House01_3rd');
    requestAnimationFrame(render);
}
function showfull() {
    ShowObject('House01_1st');
    ShowObject('House01_2nd');
    ShowObject('House01_3rd');
    requestAnimationFrame(render);
}
function startRender() {
    active=true;
    animate();
}
function stopRender() {
    active=false;
}