/**
 * Created by rwp on 2016/7/12.
 */
angular.module('myApp.controllers', [])
    .controller('selectorController', function($scope) {
    $scope.title='请扫描户型图';

      $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        //save log to html
        // (function () {
        //   if (!console) {
        //     console = {};
        //   }
        //   var old = console.log;
        //   var logger = document.getElementById('log');
        //   console.log = function (message) {
        //     if (typeof message == 'object') {
        //       logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
        //     } else {
        //       logger.innerHTML += message + '<br />';
        //     }
        //   }
        // })();
        initWebSQL();//初始化WebSQL
        //saveFeaturesToSessionStorage();//初始化SessionStorage
        // var taken_img =  document.getElementById("test_image");
        // taken_img.onload = function () {
        //   var c = document.getElementById("resize_image_canvas");
        //   var ctx = c.getContext("2d");
        //   ctx.drawImage(taken_img, 0, 0, 800, 800);
        // };

        TmtWebSocket.Http("222.28.39.64:9002");
        $("#send_to_server").click(function () {
            console.log("send info to server");
            var this_canvas = document.getElementById("resize_image_canvas");
            TmtWebSocket.sendMsg(this_canvas.toDataURL('image/jpeg'));
        });
        $("#clear_log").click(function () {
          $("#log").html("");
        });
        $("#init_camera").click(function () {
          initCamera();
          console.log("init camera complete");
          sendImage();
        });
        $("#start_scan").click(function () {
          sendImage();
        });
      });
      $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
          //selectImg();\
      });
      $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
          releaseCamera();
      });
  })
  .controller('show3DController', function($scope) {

    $scope.title='户型3D视图';
    show3D();
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {

    });
  })
  .controller('showDetailController', function($scope) {
    $scope.title='户型细节';
      
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
      showDt();
    });
  });




