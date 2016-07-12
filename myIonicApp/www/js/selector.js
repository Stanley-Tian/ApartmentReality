/**
 * Created by rwp on 2016/7/12.
 */
function OnClick() {
  console.log("haha");
}
function selectImg() {
  var cv  = document.getElementById('mCv');
  var cans = cv.getContext('2d');
  cans.moveTo(20,30);//第一个起点
  cans.lineTo(120,90);//第二个点
  cans.lineTo(220,60);//第三个点（以第二个点为起点）
  cans.lineWidth=3;
  cans.strokeStyle = 'red';
  cans.stroke();
  //cv.textContent("aa");
}
