Angular Loadable Content Module
======================

# Description
---------
###This module provides a series of

#Installation
---------
TO be defined

#Usage
---------
- import script in your page
```html
<script src="src/ngLoadableContent.js"></script>
```
- inject the module dependency
```js
angular.module('yourProject', ['ngLoadableContent']);
```
- include the directive on the loadable element 
```html
<div id="whatever" ng-loadable="[loadable-id]" overlay="[true/false]" options="{color:'#360',radius:5,lines:8}">Content</div>
```
- inject the $loader service in your controller 
```js
yourProject.controller('YourController', ['$loader', '$http', function ($loader, $http) { /*your methods*/ }]);
```
- call the $loader service on the element you want to show
```js
$loader.spinElement(loadable-id);
```
- additional css 
```css
.overlay {
    position: fixed;
    z-index: 5;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
}
[ng-loadable]{
    position: relative;
}
```

Example
---------
TO be defined