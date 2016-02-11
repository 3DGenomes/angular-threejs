/**!
 * THREEjs Angular module implmenting
 * THREEjs https://github.com/mrdoob/three.js/
 * see http://threejs.org by mrdoob
 * @author  Mike Goodstadt  <mikegoodstadt@gmail.com>
 * @version 1.0.0
 */
(function() {
	'use strict';
	angular.module('threejs', []);

	angular
		.module('threejs')
		.factory('THREEService', THREEService);

	function THREEService($log, $document, $q, $rootScope) {
		var deferred = $q.defer();

		// RENDER VARIABLES
		var renderer;
			
		function setRenderer() {
			if (window.WebGLRenderingContext) {
				renderer = new THREE.WebGLRenderer({
					alpha: true,
					antialias: true
				});
			} else {
				renderer = new THREE.CanvasRenderer({
					alpha: true
				});					
			}
			renderer.setPixelRatio( window.devicePixelRatio );
			// var clearColor = "0x000000";
			// 	renderer.setClearColor( clearColor, 0.0 ); // defaults: 0x000000, 0.0
			// renderer.setSize( 100, 100 );
			// renderer.autoClear = false; // To allow render overlay on top of sprited sphere
		}

		function onScriptLoad() {
			if (!renderer) setRenderer();
			$log.log("THREE.js loaded OK!");
			$rootScope.$apply(function() {
				deferred.resolve(window.THREE);
			});
		}

		// Create a script tag with ThreeJS as the source
		// and call our onScriptLoad callback when it
		// has been loaded
		var scriptTag = $document[0].createElement('script');
		scriptTag.type = 'text/javascript';
		scriptTag.async = true;
		var online = false;
		if (online) {
			scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.min.js';
		} else {
			scriptTag.src = 'assets/js/three.min.js';
		}
		scriptTag.onreadystatechange = function () {
			if (this.readyState == 'complete') {
				onScriptLoad();	
			}
		};
		scriptTag.onload = onScriptLoad;

		var s = $document[0].getElementsByTagName('body')[0];
		s.appendChild(scriptTag);

		function resetRenderer() {
			// Reset when switching between views, routes or states (with ui-router	module).
			// Use of renderer.setSize in a directive resets the viewport to full size.
			// No view independent reset availible for scissor so can only set ScissorTest to false
			renderer.enableScissorTest ( false );
			renderer.setClearColor( 0x000000, 0.0 );
		}

		return {
			load: function() {
				$log.log("THREE.js loading...");
				return deferred.promise;
			},
			getRenderer: function() {
				resetRenderer();
				return renderer;
			}
		};
	}
})();