/**
 * Created by AlexNoise on 28/04/2015.
 */

'use strict';

var app = angular.module('app',['ngLoadableContent','ngMockE2E']);//<<-- you have to import only ngLoadableContent

/*  =========================================
    JUST THIS EXAMPLE
    ========================================= */
//Fake XML HTTP REQUEST delayed require ngMockE2E !!!DO NOT IMPORT!!! in your projects as dependency
app.run(function($httpBackend){$httpBackend.whenGET('/items').respond(function(){return[200,{foo:[1,2,3]},{}]})});
//Fake HTTP provider
app.config(function($provide){$provide.decorator('$httpBackend',function($delegate){var p=function(m,u,d,c,h){var i=function(){setTimeout(function(){c.apply(this,arguments)},(Math.random()*2e3)+1e3)};return $delegate.call(this,m,u,d,i,h)};for(var k in $delegate){p[k]=$delegate[k]}return p})});
/*  ========================================= */


/*  =========================================
    YOUR CONTROLLER EXAMPLE
    ========================================= */

app.controller('PageController', ['$loader', '$http', function ($loader, $http) {
    this.req = function (obj) {
        $loader.spinElement(obj); //<-- call before the request

        //call the fake http provider
        $http.get('/items').success(function (data) {
            $scope.items = data;
        });
    };
}])