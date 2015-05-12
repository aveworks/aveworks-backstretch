/*!
 * ng-backstretch
 * https://github.com/rprovost/ng-backstretch
 *
 * Copyright (c) 2014-2015 Ryan Provost
 * Licensed under the MIT license.
 */
angular.module('aveworks.directives', []).

directive('aveworksBackstretch', ['$window', '$timeout', function($window, $timeout) {
	return {
		restrict: 'A',
		scope: {
			aveworksBackstretchImages: '=',
			aveworksBackstretchDuration: '=',
			aveworksBackstretchFade: '='
		},
		link: function(scope, element, attributes) {
			var images = [];
			var duration = 5000;
			var fade = 1;

			var transitionOnResize = false;

			/* STYLES
			 * 
			 * Baked-in styles that we'll apply to our elements.
			 * In an effort to keep the plugin simple, these are not exposed as options.
			 * That said, anyone can override these in their own stylesheet.
			 * ========================= */
			var styles = {
				wrapper: {
					left: 0,
					top: 0,
					overflow: 'hidden',
					margin: 0,
					padding: 0,
					height: '100%',
					width: '100%',
					zIndex: -999998,
					position: 'absolute',
				},
				image: {
					position: 'absolute',
					opacity: 0,
					margin: 0,
					padding: 0,
					border: 'none',
					width: 'auto',
					height: 'auto',
					maxHeight: 'none',
					maxWidth: 'none',
					zIndex: -999999,
					transition: 'all '+fade+'s'
				}
			};

			// create the scope.wrapper element
			scope.wrapper = angular.element('<div class="aveworks-backstretch"></div>');
			scope.wrapper.css(styles.wrapper);
			element.append(scope.wrapper);

			scope.$watch('aveworksBackstretchImages', function(newValue, oldValue) {
				if (newValue && newValue.length) {
					scope.refreshImages();
				} else {
					scope.removeImageElements(true);
				}
			}, true);

			scope.$watch('aveworksBackstretchDuration', function(newValue, oldValue) {
				if (typeof scope.aveworksBackstretchDuration == 'number' || typeof scope.aveworksBackstretchDuration == 'string' ) {
					duration = scope.aveworksBackstretchDuration | 0;
				}else{
					duration = 5000;
				}
			});

			scope.$watch('aveworksBackstretchFade', function(newValue, oldValue) {
				if (typeof scope.aveworksBackstretchFade == 'number' || typeof scope.aveworksBackstretchFade == 'string' ) {
						fade = scope.aveworksBackstretchFade | 0;
				}else{
						fade = 1;
				}

				styles.image.transition = 'all ' + fade + 's';
				scope.wrapper.find("img").css('transition', styles.image.transition);
				
			});

			scope.index = 0;


			scope.removeImageElements = function (hideWrapper) {
				scope.wrapper.find("img").remove();
				if (hideWrapper) {
					scope.wrapper.css("display", "none");
				}
			};

			scope.refreshImages = function() {
				images = scope.aveworksBackstretchImages;

				images = Array.isArray(images) ? images : [images];
				duration = duration || 5000;


				if (images.length === 0) {
					return false;
				}

				/// remove all previous images
				scope.removeImageElements();

				scope.wrapper.css("display", "block");

				images.forEach(function(element, index, array) {
					scope.image = angular.element('<img>');
					scope.image[0].src = element;
					scope.image.css(styles.image);

					// append these images to the wrapper
					scope.wrapper.append(scope.image);

					// Set the first image
					scope.index = 0;

					// don't do anything until the image has finished loading
					scope.image.bind('load', scope.load);

				});
			};

			scope.load = function(e) {
				// figure out what the width:height ratio is
				scope.ratio = this.width / this.height;

				// perform an initial sizing
				scope.resize();

				// display the first image
				scope.show();
			};

			scope.resize = function(e) {
				// set some default css
				var background_css = {
					left: 0,
					top: 0,
					width: 'auto',
					height: 'auto',
				};

				//styles.image.transition = 'all ' + fade + 's';
				if(!transitionOnResize){
					scope.wrapper.find("img").css('transition', 'all 0s');
				}

				// set some initial calculations
				var root_width = element[0].offsetWidth,
					background_width = root_width,

					root_height = element[0].offsetHeight,
					background_height = background_width / scope.ratio,

					background_offset;

				// make adjustments based on image ratio
				if (background_height >= root_height) {
					background_offset = (background_height - root_height) / 2;
					background_css.top = '-' + background_offset + 'px';

				} else {
					background_height = root_height;
					background_width = background_height * scope.ratio;
					background_offset = (background_width - root_width) / 2;

					background_css.left = '-' + background_offset + 'px';
				}

				// set the css for the width and height
				background_css.width = background_width + 'px';
				background_css.height = background_height + 'px';

				// apply the appropriate styles to the wrapper and image
				scope.wrapper.css({
					width: root_width,
					height: root_height
				});

				for (var i = 0; i < scope.wrapper.children().length; i++) {
				//	var img = angular.element(scope.wrapper.children()[i]);
				//	img.css(background_css);
				}

				scope.wrapper.find("img").css(background_css);

				if(!transitionOnResize){
					$timeout(function(){
						scope.wrapper.find("img").css('transition' , 'all ' + fade + 's');
					});
				}


			};

			var timeoutId = null;
			scope.show = function() {
				if(timeoutId)return;

				var element = scope.wrapper.children()[scope.index];
				scope.image = angular.element(element);

				// only one image
				if (images.length === 1) {
					scope.image.css({
						opacity: 1
					});
					return;
				}


				// show the image since it's finished loading
				scope.image.css({
					opacity: 1
				});

				// hide it once the duration has been reached
				timeoutId = $timeout(function() {
					timeoutId = null;

					scope.image.css({
						opacity: 0
					});

					scope.index++;
					// bring things back around once we've hit the end
					if (scope.index >= images.length) {
						scope.index = 0;
					}

					scope.show();
				}, duration);

			};

			if (images && images.length) {
				scope.refreshImages();
			}
			angular.element($window).bind('resize', scope.resize);
		}
	};
}]);