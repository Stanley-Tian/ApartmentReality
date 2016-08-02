/**
 * Created by rwp on 2016/7/12.
 */
var $LoadCtrl;
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

        $("#stop_scan").hide();
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
          $("#start_scan").hide();
          initCamera();
          $("#stop_scan").show();
          console.log("init camera complete");
          sendImage(tmt_config.send_image_timespan);
        });
        $("#stop_scan").click(function () {
          releaseCamera();
          $(this).hide();
          $("#start_scan").show();
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
    tmt_house_id=1;

    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
      onChangeModel();
      $("#switchTo").click(function () {
        switchTo();
      });
    });
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
      //alert("当前户型ID: "+tmt_house_id);
      // $("#show2nd").click(function () {
      //   show2nd();
      // });
      // $("#showfull").click(function () {
      //   showfull();
      // });
      $("#house_id").html("house id: "+tmt_house_id);

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
        //alert("changing config");
        changeConfig();
        saveConfig();
        showConfig();
      });
    });

    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
      showDt();
      initConfig();
      showConfig();
    });
  })

  //加载条
  .controller('show3DContentCtrl', function($scope, $timeout, $ionicLoading) {
    // Setup the loader
    $LoadCtrl = $ionicLoading;
    // $ionicLoading.show({
    //   content: 'Loading',
    //   animation: 'fade-in',
    //   showBackdrop: true,
    //   maxWidth: 200,
    //   showDelay: 0
    // });
    //
    // // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
    // $timeout(function () {
    //   $ionicLoading.hide();
    //   $scope.stooges = [{name: 'Moe'}, {name: 'Larry'}, {name: 'Curly'}];
    // }, 2000);

  });




