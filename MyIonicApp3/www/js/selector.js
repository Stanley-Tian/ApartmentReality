/**
 * Created by rwp on 2016/7/12.
 */
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
}
function releaseCamera() {
  cordova.plugins.camerapreview.stopCamera();
}
function detectImage() {
      var taken_img_400 = document.getElementById("test_image");
        function onSuccess(result) {
          console.log(result);
        }
        function onFailed() {
          console.log("failed");
        }
        console.log("width: "+taken_img_400.naturalWidth);
        console.log("height: "+taken_img_400.naturalHeight);

        matchFeaturesFromSessionStorage(taken_img_400,onSuccess,onFailed);
}

function detectImage2() {
    var taken_img = document.getElementById("taken_image");

  taken_img.onload = function () {
    console.log("Origin width: "+taken_img.naturalWidth);
    console.log("Origin height: "+taken_img.naturalHeight);
    var c=document.getElementById("resize_image_canvas");
    var ctx=c.getContext("2d");
    ctx.drawImage(taken_img,0,0,800,800*(taken_img.naturalHeight/taken_img.naturalWidth));
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
}
function getImage(){
  navigator.camera.getPicture(onSuccess, onFail, { quality: 100,
    destinationType: Camera.DestinationType.FILE_URI,
    correctOrientation:true
  });

  function onSuccess(imageURI) {
    var image = document.getElementById('taken_image');
    image.src = imageURI;
  }

  function onFail(message) {
    alert('Failed because: ' + message);
  }
}
//official sample of cordova-camera
function setOptions(srcType) {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true  //Corrects Android orientation quirks
  }
  return options;
}
function displayImage(imgUri) {

  var elem = document.getElementById('taken_image');
  elem.src = imgUri;
}
function openCamera(selection) {

  var srcType = Camera.PictureSourceType.CAMERA;
  var options = setOptions(srcType);
  //var func = createNewFileEntry;

  navigator.camera.getPicture(function cameraSuccess(imageUri) {

    displayImage(imageUri);
    // You may choose to copy the picture, save it somewhere, or upload.
    //func(imageUri);

  }, function cameraError(error) {
    console.debug("Unable to obtain picture: " + error, "app");

  }, options);
}
//--end

function sendImage(send_image_timespan) {
  //cordova.plugins.camerapreview.takePicture({maxWidth:640, maxHeight:640});
    cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result){
      console.log("开始处理拍到的照片");
      document.getElementById('originalPicture').src = result[0]; //originalPicturePath;
      //document.getElementById('previewPicture').src = result[1]; //previewPicturePath;

      document.getElementById("originalPicture").onload = function() {
        //TmtWebSocket.sendMsg("sending origin image..");
        var origin_data = getImageDataURL("originalPicture","canvas_original");
        TmtWebSocket.sendMsg(origin_data);
        //console.log(origin_data);
      };


      // TmtWebSocket.sendMsg("sending preview image..");
      // var preview_data = getImageDataURL("previewPicture","canvas_preview")
      // TmtWebSocket.sendMsg(preview_data);

      console.log("照片处理结束");
    });
  setInterval(function(){
    cordova.plugins.camerapreview.takePicture();
  },send_image_timespan);
}