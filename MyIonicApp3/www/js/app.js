// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','myApp.controllers']);

app.run(function($ionicPlatform){
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $stateProvider
    .state('tab', {
      url: "/tab",
      abstract:true,
      templateUrl: "tabs.html"
    })
    .state("tab.selector",{
      url: '/selector',
      views:
      {
        'tab-view-selector':{
          templateUrl:"selector.html",
          controller:'selectorController'
        }
      }
    })
    .state("tab.show3D",{
      url: '/show3D',
      views:
        {
          'tab-view-show3D':{
            templateUrl:"show3D.html",
            controller:'show3DController'
          }
        }
    })
    .state("tab.showDetail",{
      url: '/showDetail',
      views:
      {
        'tab-view-showDetail':{
          templateUrl:"showDetail.html",
          controller:'showDetailController'
        }
      }

    });
  $urlRouterProvider.otherwise('/tab/selector');
  $ionicConfigProvider.tabs.position("bottom");
});

app.constant('$ionicLoadingConfig', {
  template: '<ion-spinner icon="android"></ion-spinner>'
});

