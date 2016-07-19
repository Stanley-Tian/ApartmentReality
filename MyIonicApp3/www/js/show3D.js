/**
 * Created by rwp on 2016/7/12.
 */
function show3D() {
  initControls('viewport');
  setupScene();
  loadJsonObject('assets/HouseModles/basic_scene.json');
  animate();
}
