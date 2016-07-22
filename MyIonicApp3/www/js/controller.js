/**
 * Created by rwp on 2016/7/12.
 */
angular.module('myApp.controllers', [])
  .controller('selectorController', function($scope) {
    $scope.title='请扫描户型图';

      $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        document.addEventListener("deviceready", function() {
          initConfig();
        }, false);
        initWebSQL();//初始化WebSQL
        //saveFeaturesToSessionStorage();//初始化SessionStorage
        // var taken_img =  document.getElementById("test_image");
        // taken_img.onload = function () {
        //   var c = document.getElementById("resize_image_canvas");
        //   var ctx = c.getContext("2d");
        //   ctx.drawImage(taken_img, 0, 0, 800, 800);
        // };

        $("#send_to_server").click(function () {
            console.log("send info to server");
            var this_canvas = document.getElementById("resize_image_canvas");
            TmtWebSocket.sendMsg(this_canvas.toDataURL('image/jpeg'));
        });
        $("#clear_log").click(function () {
          //$("#log").html("");
          //$location.path('/show3DController'); // working
          
        });
        $("#start_scan").click(function () {
          initCamera();
          console.log("init camera complete");
          sendImage(tmt_config.send_image_timespan);
        });
        $("#stop_scan").click(function () {
          releaseCamera();
        });
      });
      $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
          //selectImg();\
      });
      $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
          releaseCamera();
      });
  })

////////////////////////////////////////////////////////////////////////////////
  //3D显示控制
  .controller('show3DController', function($scope) {

    $scope.title='户型3D视图';
    reloadModles();
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
      startRender();
      //alert("当前户型ID: "+tmt_house_id);
      $("#house_id").html("house id: "+tmt_house_id);
      tmt_house_id;
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
      stopRender();
    });
  })

  ///////////////////////////////////////////////////////////////////////////////
  //显示细节控制
  .controller('showDetailController', function($scope) {
    $scope.title='户型细节';
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
      initConfig();
      showConfig();
      $("#change_config").click(function () {
          var server_ip = $("#server_ip_input").val();
          var send_image_timespan = $("#send_image_timespan_input").val();
          if(server_ip.length>10)
          {
            tmt_config.server_ip = server_ip;
          }
        if(send_image_timespan>0)
        {
          tmt_config.send_image_timespan = send_image_timespan;
        }
        saveConfig();
        showConfig();
      });
    });

    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
      showDt();
      initConfig();
      showConfig();
    });
  });




