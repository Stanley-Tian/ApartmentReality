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
function drawWindow() {
  var c=document.getElementById("mCv");
  var cxt=c.getContext("2d");
  cxt.moveTo(10,10);
  cxt.lineTo(200,10);
  cxt.lineTo(200,200);
  cxt.lineTo(10,200);
  cxt.lineTo(10,10);
  cxt.stroke();
}
function initCamera() {
  var content_offset = $("#selector-content").offset();
  var content_width = $("#selector-content").width();
  var content_height = $("#selector-content").height();

  var showed_cam ={};
  showed_cam.width = content_width*(3/4);
  showed_cam.height = showed_cam.width;
  showed_cam.x = content_offset.left+(content_width - showed_cam.width)/2;
  showed_cam.y = content_offset.top + (content_height - showed_cam.height)/2;

  cordova.plugins.camerapreview.startCamera(
      { x: showed_cam.x,
        y: showed_cam.y,
        width: showed_cam.width,
        height: showed_cam.height,
        camera: "back",
        tapPhoto: true,
        previewDrag: true,
        toBack: false});
  cordova.plugins.camerapreview.show();
  cordova.plugins.camerapreview.focus();
}
function releaseCamera() {
  cordova.plugins.camerapreview.stopCamera();
}
function detectImage() {
  //take a pic
  cordova.plugins.camerapreview.takePicture({maxWidth: 500, maxHeight:500});
  //handle the pic
  cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result){
    //var img = document.getElementById('originalPicture');
    var taken_img = document.getElementById("taken_image");
    taken_img.src = result[1];
    taken_img.onload = function () {
      var c=document.getElementById("resize_image_canvas");
      var ctx=c.getContext("2d");
      ctx.drawImage(taken_img,0,0,400,400);
      var dataurl = c.toDataURL();

      var taken_img_400 = document.getElementById("small_image");
      taken_img_400.src = dataurl;
      
      taken_img_400.onload = function () {
        console.dir("result: "+taken_img_400);
        function onSuccess(result) {
          console.log(result);
        }
        function onFailed() {
          console.log("failed");
        }
        console.log("width: "+taken_img_400.naturalWidth);
        console.log("height: "+taken_img_400.naturalHeight);

        matchFeaturesFromSessionStorage(taken_img_400,onSuccess,onFailed);
      };
    };

    // var img = new Image();
    // //console.log("img: "+img);
    // //var canvas = document.getElementById("myCanvas");
    //
    //
    // img.onload = function () {
    //   var canvas = document.createElement('canvas');
    //   canvas.height = img.height;
    //   canvas.width = img.width;
    //   var ctx = canvas.getContext("2d");
    //   ctx.drawImage(this, 0, 0);
    //   var base64Img = canvas.toDataURL();
    //   cordova.base64ToGallery(
    //       base64Img,
    //       'originalImg_',
    //       function(msg) {
    //         alert("Base64 success: " + msg);
    //       },
    //       function(err) {
    //         alert("Base64 error: " + err);
    //       }
    //   );
    // }
    //
    // img.src = result[0];//originalPicturePath;

    //document.getElementById('previewPicture').src = result[1];//previewPicturePath;
  });
}
