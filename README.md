Angular Loadable Content Module
======================

# Description
---------
####This module provides a series of service and directives to show/hide and inject multiple spin.js instances on each wrapper element automatically using httpInterceptor.

#Installation
---------
bower install ngloadablecontent

#Usage
---------
- import script in your page
```html
<script src="script/spin.js/spin.js"></script>
<script src="script/src/ngLoadableContent.js"></script>
```
- inject the module dependency
```js
angular.module('yourProject', ['ngLoadableContent']);
```
- include the directive on the loadable element 
```html
<div id="whatever" ng-loadable="[loadable-id]" options="{color:'#360',radius:5,lines:8,overlay:[true/false]}">Content</div>
```
- inject the $loader service in your controller 
```js
yourProject.controller('YourController', ['$loader', '$http', function ($loader, $http) {
/*your methods*/
}]);
```
- call the $loader service on the element you want to show
```js
$loader.spinElement(loadable-id, function(){ //callback });
```
- additional css 
```css
[ng-loadable]{
    position: relative;
}
.overlay {
    position: [fixed/absolute];
    z-index: 5;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
}
```

Example
---------
TO be defined


More About spin.js
----------
http://fgnass.github.io/spin.js/