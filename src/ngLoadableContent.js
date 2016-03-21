/**
 * @author Alex Vitari.
 * @revision 02-12-2015
 * @update support img tag
 */

'use strict';

angular.module('ngLoadableContent',[])
    .config(['$httpProvider',function($httpProvider){
        $httpProvider.interceptors.push('httpInterceptor');
    }])
    .provider('$loaderConfig', function () {
        var defaults = {
            overlay: true,
            color: '#f60',
            radius: 15,
            width: 5,
            length: 15,
            lines: 13,
            zIndex: 10,
            speed: 1.5,
            shadow: true,
            top: '50%',
            left: '50%'
        };

        return {
            setDefault: function (conf) {
                defaults = $.extend(defaults, conf);
            },
            $get: function () {
                return  defaults;
            }
        };
    })
    .factory('httpInterceptor', ['$q', '$loader', function($q, $loader){
        return {
            'request': function(config){
                if ($loader.spinners.length > 0) {
                    config.headers.spinner = $loader.startSpin();//set the name of the spin
                }
                return config || $q.when(config);
            },
            'response': function(response){
                if ($loader.spinners.length > 0) {
                    $loader.stopSpin(response.config.headers.spinner);
                }
                return response || $q.when(response);
            },
            'requestError': function(rejection){
                if ($loader.spinners.length > 0) {
                    $loader.stopSpin(rejection.config.headers.spinner);
                }
                return $q.reject(rejection);
            },
            'responseError': function(rejection){
                if ($loader.spinners.length > 0) {
                    $loader.stopSpin(rejection.config.headers.spinner);
                }
                return $q.reject(rejection);
            }
        };
    }])
    .service("$loader", ['$rootScope','$loaderConfig', function($rootScope, $loaderConfig){
        var currentSpinner='';

        return {
            "spinners" : [],
            "spinElement": function(element, cb){
                if(this.spinners.hasOwnProperty(element)){
                    return false;
                }else{
                    $rootScope.$broadcast('loader.update', element);
                    return cb();
                }
            },
            "startSpin": function(){
                var $container=this.spinners[currentSpinner].element;
                if(this.spinners[currentSpinner].spinner.opts.overlay){
                    $container.addClass('overlayed').prepend(angular.element('<div>',{'class':"overlay"}));
                }
                this.spinners[currentSpinner].spinner.spin($container[0]);
                return currentSpinner;
            },
            "stopSpin": function(spinnerID){
                if(this.spinners[spinnerID].spinner.opts.overlay){
                    var element=this.spinners[spinnerID].element;

                    element.removeClass('overlayed');
                    if(element[0].tagName.toLowerCase()==='img'){
                        element.prev('.overlay').remove();
                    }else{
                        element.children('.overlay').remove();
                    }
                }
                this.spinners[spinnerID].spinner.stop();
                delete this.spinners[spinnerID];
            },
            "setSpin": function($element, options){
                currentSpinner = $element.attr("ng-loadable");
                this.spinners[currentSpinner]={ element: $element, spinner: new window.Spinner($.extend(angular.copy($loaderConfig), options))};
            },
            "imageSpin" : function($element, options){
                var loader = this,
                    spinID = $element.attr("ng-loadable"),
                    options = options || JSON.parse(JSON.stringify(eval('('+$element.attr("options")+')')));

                if(this.spinners.hasOwnProperty(spinID)){
                    return false;
                }
                this.setSpin($element, options);

                $element.wrap('<span class="imageWrapper"></span>');
                if(this.spinners[spinID].spinner.opts.overlay){
                    $element.addClass('overlayed').before(angular.element('<div>',{'class':"overlay"}));
                }
                this.spinners[spinID].spinner.spin(this.spinners[spinID].element.parent()[0]);
                $element[0].onload=function(){
                    loader.stopSpin(spinID);
                    $element.unwrap();
                }
            }
        };
    }])
    .directive('ngLoadable', ['$loader', function($loader){
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            controller: function($scope, $element, $attrs){
                $scope.$on('loader.update', function(event, name){
                    if(name === $attrs.ngLoadable){
                        $loader.setSpin($element, $scope.options);
                    }
                });

                if($element[0].tagName.toLowerCase()==="img"){
                    $loader.imageSpin($element,$scope.options);
                }
            }
        };
    }]);