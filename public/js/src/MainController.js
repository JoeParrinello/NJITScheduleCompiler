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
    $scope.fetchedClassesAfterSelect = [];

    $scope.onSelect = function($item, $model){
        $http.get('/courses/'+$item.catalogCode)
            .success(function(data){
                $scope.fetchedClassesAfterSelect.push(data);
            })
            .error(function(data){
               console.log(data);
            });
    };

    $scope.onRemove = function($item,$model){
        for(var i = 0; i<$scope.fetchedClassesAfterSelect.length; i++){
            if($scope.fetchedClassesAfterSelect[i].catalogCode==$item.catalogCode){
                $scope.fetchedClassesAfterSelect.splice(i,1);
                return;
            }
        }
    };


}]);