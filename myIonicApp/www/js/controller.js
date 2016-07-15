/**
 * Created by rwp on 2016/7/12.
 */
angular.module('myApp.controllers', [])



  .controller('selectorController', function($scope) {
    $scope.title='请扫描户型图';

      $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        // $("#mCv").css("z-index","999");
        // drawWindow();
        initWebSQL();//初始化WebSQL
        saveFeaturesToSessionStorage();//初始化SessionStorage
        $("#take_pic").click(function () {
          detectImage();
        });
      });
      $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
          //selectImg();\
          initCamera();

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




