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
    .service("$loader", ['$rootScope', function($rootScope){
        var $container = angular.element('body'),
            overlay = true,
            currentSpinner='',
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
            };

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
                if(overlay && !$container.hasClass('overlayed')){
                    $container.addClass('overlayed').prepend(angular.element('<div>',{'class':"overlay"}));
                }
                this.spinners[currentSpinner].spin($container[0]);
                return currentSpinner;
            },
            "stopSpin": function(spinnerID){
                if(overlay && $container.hasClass('overlayed')){
                    $container.removeClass('overlayed').find('.overlay').remove();
                }
                this.spinners[spinnerID].stop();
                delete this.spinners[spinnerID];
            },
            "setSpin": function($element, options, showOverlay){
                overlay = showOverlay || false;
                $container = $element;
                currentSpinner = $element.attr("ng-loadable");
                this.spinners[currentSpinner]=new window.Spinner($.extend(angular.copy(defaults), options));
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