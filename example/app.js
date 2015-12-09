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
    function round(i){return Math.floor(Math.random()*i);}
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    $httpBackend.whenGET('/email').respond(function(){return [200, false,{}]});

    $httpBackend.whenPOST('/email').respond(function(method,url,data){return [200, re.test(data),{}]});

    $httpBackend.whenGET('/items').respond(function(){return [200,[Math.random()*1,Math.random()*2, Math.random()*3],{}]});

    $httpBackend.whenGET('/graph').respond(function(){return [200,[round(160),round(160),round(160),round(160),round(160),round(160),round(160),round(160),round(160),round(160)],{}]});
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

    this.req = function (spinID, req, data) {
        req = req || '/items';
        $loader.spinElement(spinID, function(){  //<-- call the request inside
            //call the fake http provider
            if(data){
                $http.post(req,data).success(function (data) {
                    page.items = data;
                    page[spinID] = data;
                });
            }else {
                $http.get(req).success(function (data) {
                    page.items = data;
                    page[spinID] = data;
                });
            }
        });
    };

    this.customStart = function(spinID){
        if(toggle){
            $loader.spinElement(spinID, function () {
                $loader.startSpin();
            });
        }else{
            $loader.stopSpin(spinID);
        }
        toggle= !toggle;
    };

    this.reloadImage = function (spinID) {
        var $image = angular.element('[ng-loadable="'+spinID+'"]'),
            oldSrc=$image.attr('src');
        $loader.imageSpin($image);
        $image.attr("src",oldSrc.substring(0,oldSrc.length-1)+(parseInt(oldSrc.substr(-1),10)+1));
    }
}])