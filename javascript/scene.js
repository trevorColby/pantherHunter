
import * as THREE from '/javascript/three.module.js';
import { OBJLoader } from '/javascript/OBJLoader.js';
var container;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var object;
var spotLight;
init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 60;
	// scene
	scene = new THREE.Scene();
	//var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	//scene.add( ambientLight );
	//pointLight = new THREE.PointLight( 0xffffff, 1, 100);
	//camera.add( pointLight );
	var color = 0xb8c8ff;
	var intensity = 1;
	var distance = 0;
	var angle = 0.1;
	var penumbra = 0.5;
	var decay = 2; 
	spotLight = new THREE.SpotLight( color, intensity, distance, angle, penumbra, decay);
	spotLight.position.set( 0, 0, 100 );

	spotLight.castShadow = true;

/*				spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 30;
*/
	scene.add( spotLight );
	scene.add( camera );
	// manager
	function loadModel() {
		object.traverse( function ( child ) {
			if ( child.isMesh ) child.material.map = texture;
		} );
		object.position.y = 0;
		object.position.x = -15;
		object.rotation.x = -Math.PI / 2;
		object.rotation.y = Math.PI / 2;
		scene.add( object );
	}
	var manager = new THREE.LoadingManager( loadModel );
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};
	// texture
	var textureLoader = new THREE.TextureLoader( manager );
	var texture = textureLoader.load( 'models/pantherHunter/qq-exported01.jpg' );
	// model
	function onProgress( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
		}
	}
	function onError() {}
	var loader = new OBJLoader( manager );
	loader.load( 'models/pantherHunter/qq-exported.obj', function ( obj ) {
		object = obj;
	}, onProgress, onError );
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}
//
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	//-40 x , 15 y is mouse left position
	//40 x , 50 
	//as we move across the page parametrize our statue position to a point along this,
	//will also eventually adjust point light source to coordinate with this
	//I think I probably want to use an orthographic camera and move the object instead of moving the camera.
	//This will allow me to keep my spotlight fixed to my plane and shine where I intend it to.
	camera.position.x = mouseX * (160 / window.innerWidth);
	camera.position.y = (-mouseY * (70 / window.innerHeight)) + 32.5 ;
	spotLight.position.set(mouseX, mouseY, 100);
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}
