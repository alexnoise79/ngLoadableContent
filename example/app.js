/**
 * Created by AlexNoise on 28/04/2015.
 */

'use strict';

var app = angular.module('app',['ngLoadableContent','ngMockE2E']);//<<-- you have to import only ngLoadableContent

/*  =========================================
    JUST THIS EXAMPLE
    ========================================= */
//Fake XML HTTP REQUEST delayed require ngMockE2E !!!DO NOT IMPORT!!! in your projects as dependency
app.run(function($httpBackend){$httpBackend.whenGET('/items').respond(function(){return [200,{foo:[1,2,3]},{}]})});
//Fake HTTP provider
app.config(function($provide){$provide.decorator('$httpBackend',function($delegate){var p=function(m,u,d,c,h){var i=function(){var _this=this,_arguments=arguments;setTimeout(function(){c.apply(_this,_arguments);},(Math.random()*2e3)+1e3);};return $delegate.call(this,m,u,d,i,h);};for(var key in $delegate){p[key]=$delegate[key];}return p;});})
/*  ========================================= */


/*  =========================================
    YOUR CONTROLLER EXAMPLE
    ========================================= */

app.controller('PageController', ['$loader', '$http', function ($loader, $http) {
    var page=this;

    this.req = function (obj) {
        $loader.spinElement(obj, function(){  //<-- call the request inside
            //call the fake http provider
            $http.get('/items').success(function (data) {
                page.items = data;
            });
        });
    };
}])