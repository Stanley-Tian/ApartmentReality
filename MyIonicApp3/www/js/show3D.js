/**
 * Created by rwp on 2016/7/12.
 */
function reloadModles() {
  initControls('viewport');
  setupScene();
  AddJsonObject('assets/Models/BS_0_first.json','BS_0_first');
  AddJsonObject('assets/Models/BS_0_second.json','BS_0_second');
  AddJsonObject('assets/Models/BS_0_top.json','BS_0_top');
  //sleep(100);
  //HideObject('BS_0_first');
  requestAnimationFrame(render);
}
function show1st() {
  ShowObject('BS_0_first');
  HideObject('BS_0_second');
  HideObject('BS_0_top');
  requestAnimationFrame(render);
}
function show2nd() {
  ShowObject('BS_0_first');
  ShowObject('BS_0_second');
  HideObject('BS_0_top');
  requestAnimationFrame(render);
}
function showfull() {
  ShowObject('BS_0_first');
  ShowObject('BS_0_second');
  ShowObject('BS_0_top');
  requestAnimationFrame(render);
}
function startRender() {
  active=true;
  animate();
}
function stopRender() {
  active=false;
}