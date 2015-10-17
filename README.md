# angular-threejs

Angular service that implements THREE.js - see http://threejs.org/

## Usage

Require the 'threejs' module in your app and inject the 'THREEService' into a directive.

Example:

``` javascript
// add the 'threejs' module to your app
myapp = angular.module('myapp', ['threejs']);

// inject THREEService into your directive
(function() {
	'use strict';
	angular
		.module('myapp')
		.directive('myScene', myScene);

	function myScene($rootScope, THREEService) {
		return {
			restrict: 'EA',
			link: function(scope, element, attrs) {
				THREEService.load().then(function(THREE) {

						var container, viewsize, camera, scene;
						var geometry, material, torus;
						var renderer = THREEService.getRenderer();
						var animation;

						scope.init = function() {
							container =  element[0];
							viewsize = container.clientWidth;

							renderer.setSize( viewsize, viewsize );
							container.appendChild( renderer.domElement );

							scene = new THREE.Scene();

							camera = new THREE.PerspectiveCamera( 50, 1, 150, 650 );
							camera.position.z = 500;
							scene.add(camera);

							geometry = new THREE.TorusKnotGeometry( 100, 30, 100, 16 );

							material = new THREE.MeshDepthMaterial({
								color: 0x666666,
								wireframe: true,
								wireframeLinewidth: 1
							});

							torus = new THREE.Mesh( geometry, material );
							torus.name = "Torus";
							scene.add(torus);

						};

						// -----------------------------------
						// Event listeners
						// -----------------------------------
						// Cancel animation when view route or state changes
						// eg. watch for state change when using ui-router:
						$rootScope.$on('$stateChangeStart', function() {
							cancelAnimationFrame( animation );
						});

						// -----------------------------------
						// Draw and Animate
						// -----------------------------------
						scope.animate = function() {
							animation = requestAnimationFrame( scope.animate );
							scope.render();
						};

						scope.render = function() {
							torus.rotation.x += 0.006;
							torus.rotation.y += 0.006;
							renderer.render( scene, camera, null, true ); // forceClear == true
						};

						scope.init();
						scope.animate();

				});
			}
		};
	}
})();
```
