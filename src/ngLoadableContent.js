/**
 * @author Alex Vitari.
 * @revision 23-11-2015
 * @update support multiple spinners
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
                config.headers.spinner=$loader.startSpin();//set the name of the spin
                return config || $q.when(config);
            },
            'response': function(response){
                $loader.stopSpin(response.config.headers.spinner);
                return response || $q.when(response);
            },
            'requestError': function(rejection){
                $loader.stopSpin(rejection.config.headers.spinner);
                return $q.reject(rejection);
            },
            'responseError': function(rejection){
                $loader.stopSpin(rejection.config.headers.spinner);
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
                var $container=angular.element('[ng-loadable="'+currentSpinner+'"]');
                if(this.spinners[currentSpinner].opts.overlay){
                    $container.addClass('overlayed').prepend(angular.element('<div>',{'class':"overlay"}));
                }
                this.spinners[currentSpinner].spin($container[0]);
                return currentSpinner;
            },
            "stopSpin": function(spinnerID){
                if(this.spinners[spinnerID].opts.overlay){
                    angular.element('[ng-loadable="'+spinnerID+'"]').removeClass('overlayed').find('.overlay').remove();
                }
                this.spinners[spinnerID].stop();
                delete this.spinners[spinnerID];
            },
            "setSpin": function($element, options){
                currentSpinner = $element.attr("ng-loadable");
                this.spinners[currentSpinner]=new window.Spinner($.extend(angular.copy($loaderConfig), options));
            },
            "imageSpin" : function($element){
                /*var loader=this;
                $element.wrap('<span class="imageWrapper"></span>');
                this.spinners[currentSpinner].spin($element.parent()[0]);
                $element[0].onload=function(){
                    loader.stopSpin(currentSpinner);
                }*/
            }
        };
    }])
    .directive('ngLoadable', ['$loader', function($loader){
        return {
            restrict: 'A',
            scope: {
                options: '=',
                overlay: '='
            },
            controller: function($scope, $element, $attrs){
                $scope.$on('loader.update', function(event, name){
                    if(name === $attrs.ngLoadable){
                        $loader.setSpin($element, $scope.options);
                    }
                });

                /*if($element[0].tagName.toLowerCase()==="img"){
                    $loader.setSpin($element, $scope.options);
                    $loader.imageSpin($element);
                }*/
            }
        };
    }]);