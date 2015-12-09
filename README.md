Angular Loadable Content Module
======================

# Description
---------
###### This module provides a series of service and directives to show/hide and inject multiple spin.js instances on each wrapper element automatically using httpInterceptor.

# Installation
---------
```html
bower install ngloadablecontent
```
# Usage
---------
* import script in your page
```html
<script src="script/spin.js/spin.js"></script>
<script src="script/src/ngLoadableContent.js"></script>
```
* inject the module dependency
```js
angular.module('yourProject', ['ngLoadableContent']);
```
* override the default configuration (optional)
```js
yourProject.config(['$loaderConfigProvider',function ($loaderConfigProvider) {
    $loaderConfigProvider.setDefault({color:"#0047ab", lines:20, radius:5});
}]);
```
* include the directive on the loadable element
```html
<div id="whatever" ng-loadable="[loadable-id]" options="{color:'#360',radius:5,lines:8,overlay:[true/false]}">Content</div>
```
* inject the $loader service in your controller
```js
yourProject.controller('YourController', ['$loader', '$http', function ($loader, $http) {
    /*your methods*/
    //call the $loader service on the element you want to show
    $loader.spinElement(loadable-id, function(){ //callback });
}]);
```
- support for img tag @landing
```html
<img id="big-image" ng-src="[source for image]" ng-loadable="[loadable-id]" options="{options}"/>
```
- additional css
```css
[ng-loadable]{
    position: relative;
}
.overlay {
    position: (fixed/absolute);
    z-index: 5;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
}
```
# Example
---------
http://alexnoise79.github.io/ngLoadableContent/

# Options
---------
* overlay //display an overlay
* lines // The number of lines to draw
* length // The length of each line
* width // The line thickness
* radius // The radius of the inner circle
* scale // Scales overall size of the spinner
* corners // Corner roundness (0..1)
* color // #rgb or #rrggbb or array of colors
* opacity // Opacity of the lines
* rotate // The rotation offset
* direction // 1: clockwise, -1: counterclockwise
* speed // Rounds per second
* trail // Afterglow percentage
* fps // Frames per second when using setTimeout() as a fallback for CSS
* zIndex // The z-index (defaults to 10)
* className // The CSS class to assign to the spinner (defaults 'spinner')
* top // Top position relative to parent
* left // Left position relative to parent
* shadow // Whether to render a shadow
* hwaccel // Whether to use hardware acceleration
* position // Element positioning

# More About spin.js
----------
http://fgnass.github.io/spin.js/

this software is released under MIT license