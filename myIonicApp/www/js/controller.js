/**
 * Created by rwp on 2016/7/12.
 */
angular.module('myApp.controllers', [])

  .controller('selectorController', function($scope) {
    $scope.title='请扫描户型图';
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
      selectImg();
    });
  })
  .controller('show3DController', function($scope) {

    $scope.title='户型3D视图';
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
      show3D();
    });
  })
  .controller('showDetailController', function($scope) {
    $scope.title='户型细节';
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
      showDt();
    });
  });




