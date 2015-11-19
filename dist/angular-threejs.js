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

	function THREEService($document, $q, $rootScope) {
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
			$rootScope.$apply(function() { deferred.resolve(window.THREE); });
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
				return deferred.promise;
			},
			getRenderer: function() {
				resetRenderer();
				return renderer;
			}
		};
	}
})();
/**!
 * THREEjs Plugins Service for
 * THREEjs Angular module implmenting
 * THREEjs https://github.com/mrdoob/three.js/
 * see http://threejs.org by mrdoob
 * @author  Mike Goodstadt  <mikegoodstadt@gmail.com>
 * @version 1.0.0
 */
 
 (function() {
	'use strict';
	angular
		.module('threejs')
		.factory('THREEPlugins', THREEPlugins);

	function THREEPlugins($document, $q, $rootScope) {
		var plugins = {
			loaded: []
		};

		return {
			load: function(filenames) {
				var self = this;
				var pluginsToLoad = []; // push async functions into list for subsequent processing
				angular.forEach(filenames, function(filename, key) {
					var newPlugin = true;
					for (var i = plugins.loaded.length - 1; i >= 0; i--) {
						if (plugins.loaded[key] == filename) newPlugin = false;
					}
					if (newPlugin) {
						var loadPlugin = self.add(filename);
						pluginsToLoad.push(loadPlugin);
					}
				});
				return $q.all(pluginsToLoad)
				.then(function(results) {
					if (results.length > 0) console.log("THREE.js plugins loaded: " + results);
					return window.THREE;
				});
			},
			add: function(filename) {
				var deferred = $q.defer();

				function onScriptLoad() {
					$rootScope.$apply(function() {
						plugins.loaded.push(filename);
						// console.log(plugins.loaded);
						deferred.resolve(filename);
					});
				}

				var pluginTag = $document[0].createElement('script');
					pluginTag.type = 'text/javascript';
					pluginTag.src = 'assets/js/' + filename + '.js';
					pluginTag.async = true;
					pluginTag.onreadystatechange = function () {
						if (this.readyState == 'complete') {
							onScriptLoad();
						}
					};
					pluginTag.onload = onScriptLoad;

				var t = $document[0].getElementsByTagName('body')[0];
					t.appendChild(pluginTag);

				return deferred.promise;
			},
			remove: function(filename) {
				angular.forEach(plugins.loaded, function(plugin, key) {
					if (plugin == filename) {
						plugins.loaded[key].pop();
						// REMOVE DOM ELEMENT?
						console.log("THREE.js plugin " + filename + " removed.");
					}
				});
			}
		};
	}
})();
/**!
 * THREEjs Textures Service for
 * THREEjs Angular module implmenting
 * THREEjs https://github.com/mrdoob/three.js/
 * see http://threejs.org by mrdoob
 * @author  Mike Goodstadt  <mikegoodstadt@gmail.com>
 * @version 1.0.0
 */
 
 (function() {
	'use strict';
	angular
		.module('threejs')
		.factory('THREETextures', THREETextures);

	function THREETextures(THREEService, $document, $q, $rootScope) {
		// TODO: check if texture already loaded - add and remove from array
		var textures = {
			loaded: []
		};

		return {
			load: function(filenames) {
				console.log(filenames);

				var self = this;
				var imagesToLoad = []; // push async functions into list for subsequent processing
				angular.forEach(filenames, function(filename, key) {
					var newImage = true;
					for (var i = textures.loaded.length - 1; i >= 0; i--) {
						if (textures.loaded[key] == filename) newImage = false;
					}
					if (newImage) {
						var loadImage = self.add(filename);
						imagesToLoad.push(loadImage);
					}
				});
				return $q.all(imagesToLoad)
				.then(function(results) {
					if (results.length > 0) console.log("Images loaded: " + results);
					return window.THREE;
				});
			},
			add: function(filename) {
				var deferred = $q.defer();

				// Create Manager
				var textureManager = new THREE.LoadingManager();
				textureManager.onProgress = function ( item, loaded, total ) {
					// this gets called after any item has been loaded
					console.log( item, loaded, total );
				};
				textureManager.onLoad = function () {
					// all textures are loaded
					$rootScope.$apply(function() {
						console.log(textures.loaded);
						deferred.resolve(filename);
					});
				};

				// Create New Texture
				var newTexture = new THREE.Texture();
				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};
				textures.loaded.push( newTexture );

				// Load Image to Texture
				var imageLoader = new THREE.ImageLoader( textureManager );
				imageLoader.load( filename, function ( image ) {
					newTexture.image = image;
				}, onProgress, onError );

				return deferred.promise;
			},
			remove: function(filename) {
				angular.forEach(textures.loaded, function(texture, key) {
					if (texture == filename) {
						textures.loaded[key].pop();
						// REMOVE DOM ELEMENT?
						console.log("Image " + filename + " removed.");
					}
				});
			}
		};
	}
})();