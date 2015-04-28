/**
 * Created by AlexNoise on 28/04/2015.
 */


'use strict';

angular.module('ngLoadableContent',[])
    .config(['$httpProvider',function($httpProvider){
        $httpProvider.interceptors.push('httpInterceptor');
    }])
    .factory('httpInterceptor', ['$q', '$loader', function($q, $loader){
        return {
            'request': function(config){
                $loader.startSpin();
                return config || $q.when(config);
            },
            'response': function(response){
                $loader.stopSpin();
                return response || $q.when(response);
            },
            'requestError': function(rejection){
                $loader.stopSpin();
                return $q.reject(rejection);
            },
            'responseError': function(rejection){
                $loader.stopSpin();
                return $q.reject(rejection);
            }
        };
    }])
    .service("$loader", ['$rootScope', function($rootScope){
        var $container = angular.element('body'),
            defaultContainer = $container,
            overlay = true,
            defaults = {
                color: '#f60',
                radius: 15,
                width: 5,
                length: 15,
                lines: 13,
                zIndex: 6,
                speed: 1.5,
                shadow: true,
                top: '50%',
                left: '50%'
            },
            spinner = new window.Spinner(angular.copy(defaults));

        return {
            "spinElement": function(element){
                $rootScope.$broadcast('loader.update', element);
            },
            "startSpin": function(){
                if(overlay && !$container.hasClass('overlayed')){
                    $container.addClass('overlayed').prepend('<div class="overlay"></div>');
                }
                spinner.spin($container[0]);
            },
            "stopSpin": function(){
                if(overlay && $container.hasClass('overlayed')){
                    $container.removeClass('overlayed').find('.overlay').remove();
                }
                spinner.stop();
                this.setSpin(defaultContainer, defaults, true);
            },
            "setSpin": function($element, options, showOverlay){
                overlay = showOverlay || false;
                $container = $element;
                $.extend(spinner.opts, options);
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
                        $loader.setSpin($element, $scope.options, $scope.overlay);
                    }
                });
            }
        };
    }]);