/**
 * @author Alex Vitari.
 * @revision 02-12-2015
 * @update no-jquery, uglifyable
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
                defaults = angular.extend(defaults, conf);
            },
            $get: function () {
                return  defaults;
            }
        };
    })
    .factory('httpInterceptor', ['$q', '$loader', function($q, $loader){
        return {
            'request': function(config){
                if (Object.keys($loader.spinners).length) {
                    config.spinner = $loader.startSpin();//set the name of the spin
                }
                return config || $q.when(config);
            },
            'response': function(response){
                if (Object.keys($loader.spinners).length) {
                    $loader.stopSpin(response.config.spinner);
                }
                return response || $q.when(response);
            },
            'requestError': function(rejection){
                if (Object.keys($loader.spinners).length) {
                    $loader.stopSpin(rejection.config.spinner);
                }
                return $q.reject(rejection);
            },
            'responseError': function(rejection){
                if (Object.keys($loader.spinners).length) {
                    $loader.stopSpin(rejection.config.spinner);
                }
                return $q.reject(rejection);
            }
        };
    }])
    .service('$loader', ['$rootScope','$loaderConfig', function($rootScope, $loaderConfig){
        var currentSpinner='';

        return {
            "spinners" : {},
            "spinElement": function(element, cb){
                if(this.spinners.hasOwnProperty(element)){
                    return false;
                }else{
                    $rootScope.$broadcast('loader.update', element);
                    return cb();
                }
            },
            "startSpin": function(){
                if(!this.spinners[currentSpinner]){
                    this.spinners = {};
                    return "";
                }
                var $container=this.spinners[currentSpinner].element;
                if(this.spinners[currentSpinner].spinner.opts.overlay){
                    $container.addClass('overlayed').prepend(angular.element('<div>',{'class':"overlay"}));
                }
                this.spinners[currentSpinner].spinner.spin($container[0]);
                return currentSpinner;
            },
            "stopSpin": function(spinnerID){
                if(!this.spinners[spinnerID]) return;
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
                this.spinners[currentSpinner]={ element: $element, spinner: new window.Spinner(angular.extend(angular.copy($loaderConfig), options))};
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
                options: '=',
                name: '@ngLoadable'
            },
            link: function($scope, $element, $attrs){
                $scope.$on('loader.update', function(event, name){
                    if(name === $scope.name){
                        $loader.setSpin($element, $scope.options);
                    }
                });

                if($element[0].tagName.toLowerCase()==="img"){
                    $loader.imageSpin($element,$scope.options);
                }
            }
        };
    }]);