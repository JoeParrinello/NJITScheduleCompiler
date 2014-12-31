/**
 * Created by taevis on 12/31/14.
 */
angular.module('MainCtrl', []).controller('mainController',['$location','$scope',function($location, $scope){
    "use strict";
    $scope.availableClasses = [{catalogCode:"ACCT 117"},{catalogCode:"ACCT 118"}];
    $scope.classes= {};
}]);