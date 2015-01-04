/**
 * Created by taevis on 12/31/14.
 */
angular.module('MainCtrl', []).controller('mainController',['$location','$scope','$http',function($location, $scope, $http){
    "use strict";
    $scope.availableClasses = [];
    $http.get('/courses').
        success(function(data) {
            $scope.availableClasses=data;
        }).
        error(function(data) {
            console.log(data);
        });
    $scope.classes= {};

    $scope.sectionSelected = {};
}]);