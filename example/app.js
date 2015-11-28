/**
 * Created by AlexNoise on 28/04/2015.
 */

'use strict';

var app = angular.module('app',['ngLoadableContent','ngMockE2E']);//<<-- you have to import only ngLoadableContent

/*  =========================================
    JUST THIS EXAMPLE
    ========================================= */
//Fake XML HTTP REQUEST delayed require ngMockE2E !!!DO NOT IMPORT!!! in your projects as dependency
app.run(function($httpBackend){
    $httpBackend.whenGET('/items').respond(function(){
        return [200,[Math.random()*1,Math.random()*2, Math.random()*3],{}]
    });

    function round(i){
        return Math.floor(Math.random()*i);
    }

    $httpBackend.whenGET('/graph').respond(function(){
        return [200,[round(160),round(160),round(160),round(160),round(160),round(160),round(160),round(160),round(160),round(160)],{}]
    });
});
//Fake HTTP provider
app.config(function($provide){$provide.decorator('$httpBackend',function($delegate){var p=function(m,u,d,c,h){var i=function(){var _this=this,_arguments=arguments;setTimeout(function(){c.apply(_this,_arguments);},(Math.random()*2e3)+1e3);};return $delegate.call(this,m,u,d,i,h);};for(var key in $delegate){p[key]=$delegate[key];}return p;});})
/*  ========================================= */

/*  =========================================
     DEFAULT CONFIGURATION FOR YOUR PROJECT (override the default)
    ========================================= */

app.config(['$loaderConfigProvider',function ($loaderConfigProvider) {
    $loaderConfigProvider.setDefault({color:"#0047ab"});
}]);

/*  =========================================
     YOUR CONTROLLER EXAMPLE
    ========================================= */

app.controller('PageController', ['$loader', '$http', function ($loader, $http) {
    var page=this, toggle=true;

    this.req = function (obj, req) {
        req = req || '/items';
        $loader.spinElement(obj, function(){  //<-- call the request inside
            //call the fake http provider
            $http.get(req).success(function (data) {
                page.items = data;
                //angular.element('[ng-loadable="'+obj+'"]').html(data);
                page[obj]=data;
            });
        });
    };

    this.customStart = function(obj){
        if(toggle){
            $loader.spinElement(obj, function () {
                $loader.startSpin();
            });
        }else{
            $loader.stopSpin(obj);
        }
        toggle= !toggle;
    }
}])