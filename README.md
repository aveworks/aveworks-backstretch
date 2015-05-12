# aveworks-backstretch

A native Angular directive derived from the jQuery Backstretch plugin (http://srobbin.com/jquery-plugins/backstretch) original implementation from (https://github.com/rprovost/ng-backstretch)

## Installation

Download the project with Bower:

```javascript
bower install aveworks-backstretch
```

Include aveworks-backstretch in your project:

```html
<script src="bower_components/aveworks-backstretch/dist/aveworks-backstretch.min.js"></script>
```

Inject the `aveworks.backstretch` module into your Angular project:

```javascript
angular.module('myApp', ['aveworks.backstretch']);
```


## Usage
Add the required attributes to any DOM element.

### A single image:
```html
<div aveworks-backstretch aveworks-backstretch-images="'http://placehold.it/1600x1600'"></div>
```

### An array of images:
```javascript
angular.module('myAPP')
.controller('myController', function($scope){
  $scope.images = [
    'http://dl.dropbox.com/u/515046/www/garfield-interior.jpg',
    'http://dl.dropbox.com/u/515046/www/outside.jpg',
    'http://dl.dropbox.com/u/515046/www/cheers.jpg'
  ];
});
```

```html
<div aveworks-backstretch aveworks-backstretch-images="images"></div>
```

### Slideshow Attributes
A slideshow duration and fade period can be specified through additional directive attributes.

```html
<div aveworks-backstretch aveworks-backstretch-images="images" aveworks-backstretch-duration="5000" aveworks-backstretch-fade="1"></div>  
```

`aveworks-backstretch-duration` is specified in milliseconds and defaults to `5000` if none is specified.
`aveworks-backstretch-fade` is specified in seconds and defaults to `1` if none is specified.
