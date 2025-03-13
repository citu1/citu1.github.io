import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
//import { shadow } from 'three/tsl';

function main() {
	var moon_posx = 15;
	var moon_posy = 15;
	var moon_posz = -5;

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	renderer.shadowMap.enabled = true;

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 5;

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	controls.update();

	const scene = new THREE.Scene();

	const rtWidth = 512;
    const rtHeight = 512;
    const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

	const rtFov = 75;
    const rtAspect = rtWidth / rtHeight;
    const rtNear = 0.1;
    const rtFar = 5;
    const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
    rtCamera.position.z = 2;
     
    const rtScene = new THREE.Scene();
    rtScene.background = new THREE.Color(0xECB05A);


	{
		const color = 0x373A85;  // white
		const near = 5;
		const far = 55;
		scene.fog = new THREE.Fog(color, near, far);
	  }

	{////light here

		const color = 0xFFFFFF;
		const intensity = 1;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set(moon_posx, moon_posy, moon_posz);
		light.target.position.set(-8, 0, -12);
		light.castShadow = true;
		light.shadow.camera.top = 30;
		light.shadow.camera.bottom = -30;
		light.shadow.camera.right = 30;
		light.shadow.camera.left = -30;
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;
		scene.add( light );
		scene.add(light.target);

		const innerlight = new THREE.AmbientLight(color, intensity);
		//create new light for rtScene bc it eats lights
		rtScene.add(innerlight);

    	const spotlightcolor = 0xFFFFFF;
		const spotlightintensity = 300;
		const spotlight = new THREE.SpotLight( spotlightcolor, spotlightintensity );
		spotlight.position.set( moon_posx, moon_posy, moon_posz );
		spotlight.target.position.set( 5, 0, -5 );
    	spotlight.angle = Math.PI/6;
		scene.add( spotlight );
		scene.add( spotlight.target );

    	const rectcolor = 0xFFFFFF;
		const rectintensity = 4;
		const width = 4.5;
		const height = 1.5;
		const rectlight = new THREE.RectAreaLight( rectcolor, rectintensity, width, height );
		rectlight.position.set( -3, -1.4, -11 );
		rectlight.rotation.x = THREE.MathUtils.degToRad( - 40 );
		scene.add( rectlight );


		//const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
		//scene.add(cameraHelper);
    	//const helper = new THREE.SpotLightHelper( spotlight );
		//scene.add( helper );
    	//const recthelper = new RectAreaLightHelper( rectlight );
		//rectlight.add( recthelper );

	}

  	const groundGeometry = new THREE.PlaneGeometry( 100, 100 );
	const groundMaterial = new THREE.MeshPhongMaterial( { color: 0x41AA2D } );
	const groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
	groundMesh.rotation.x = Math.PI * - .5;
  	groundMesh.position.y = -3;
	groundMesh.receiveShadow = true;
	scene.add( groundMesh );

	const baseGeometry = new THREE.BoxGeometry(20,4,20);
	const baseMaterial = new THREE.MeshStandardMaterial({color: 0xFED3A9});
	const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
	baseMesh.position.z = -21.5;
	baseMesh.position.y = -1;
	baseMesh.castShadow = true;
	baseMesh.recieveShadow = true;
	scene.add(baseMesh);

	const loader = new THREE.TextureLoader();
	const rooftex = loader.load('src/resources/roof.png');
	rooftex.colorSpace = THREE.SRGBColorSpace;
	rooftex.magFilter = THREE.LinearFilter;
	rooftex.minFilter = THREE.NearestMipmapNearestFilter;
	const baseroofGeometry = new THREE.ConeGeometry(15,4,4);
	const baseroofMaterial = new THREE.MeshStandardMaterial({map:rooftex});
	const baseroofMesh = new THREE.Mesh(baseroofGeometry, baseroofMaterial);

	baseroofMesh.rotation.y = (Math.PI*45)/180;
	baseroofMesh.position.y = 3;
	baseroofMesh.position.z = -21.5;
	baseroofMesh.castShadow = true;
	scene.add(baseroofMesh);

	const doorbaseGeometry = new THREE.BoxGeometry(4,3.5,2.5);
	const doorbaseMaterial = new THREE.MeshStandardMaterial({color: 0xFED3A9});
	const doorbaseMesh = new THREE.Mesh(doorbaseGeometry, doorbaseMaterial);
	doorbaseMesh.position.z = -10.5;
	doorbaseMesh.position.x = 2.1;
	doorbaseMesh.position.y = -2;
	doorbaseMesh.castShadow = true;
	doorbaseMesh.receiveShadow = true;
	scene.add(doorbaseMesh);

	const doorRoofGeometry = new THREE.ConeGeometry(2.85, 1.5, 4);
	const doorRoofMaterial = new THREE.MeshStandardMaterial({map:rooftex});
	const doorRoofMesh = new THREE.Mesh(doorRoofGeometry, doorRoofMaterial);
	doorRoofMesh.position.z = -10.9;
	doorRoofMesh.position.x = 2.1;
	doorRoofMesh.position.y = 0.48;
	doorRoofMesh.rotation.y = (Math.PI*45)/180;
	doorRoofMesh.castShadow = true;
	scene.add(doorRoofMesh);


	const doorgeo = new THREE.PlaneGeometry(2, 2);
	const doortex = loader.load('src/resources/sj0oa8xk.png')
	doortex.colorSpace = THREE.SRGBColorSpace;
	doortex.magFilter = THREE.LinearFilter;
	doortex.minFilter = THREE.NearestMipmapNearestFilter;
	
	const doormat = new THREE.MeshStandardMaterial({map:doortex});
	const door = new THREE.Mesh(doorgeo, doormat);
	scene.add(door);
	door.position.x = 2.1;
	door.position.y = -2.1;
	door.position.z = -9;


	//render window texture
	const windowgeo = new THREE.PlaneGeometry(4.5,1.5);
	const windowmat = new THREE.MeshStandardMaterial({map: renderTarget.texture});
	const window = new THREE.Mesh(windowgeo, windowmat);
	window.position.x = -3;
	window.position.y = -1.4;
	window.position.z = -11.49;
	scene.add(window);


	const pathgeo = new THREE.PlaneGeometry(2, 32);
	const pathtex = loader.load('src/resources/dirt.png');
	pathtex.colorSpace = THREE.SRGBColorSpace;
	pathtex.magFilter = THREE.LinearFilter;
	pathtex.minFilter = THREE.NearestMipmapNearestFilter;
	pathtex.wrapS = THREE.RepeatWrapping;
	pathtex.wrapT = THREE.RepeatWrapping;
	const pathmat = new THREE.MeshStandardMaterial({map: pathtex});
	const path = new THREE.Mesh(pathgeo, pathmat);
	path.rotation.x = Math.PI * - .5;
	path.position.x = 2;
	path.position.y = -2.9;
	scene.add(path);

	const treeLeavesGeometry = new THREE.TorusKnotGeometry(.5, 6.4746, 64, 8, 6, 7);
	const treeLeavesMaterial = new THREE.MeshStandardMaterial({color: 0x41AA2D});
	//treeLeaves.rotation.x = (Math.PI*45)/180;
	//treeLeaves.rotation.z = (Math.PI*45)/180;
	function maketreeleaves(geometry, mat, x, y, z)
	{
		const treeLeaves = new THREE.Mesh(geometry, mat);
		scene.add(treeLeaves);
		treeLeaves.position.x = x;
		treeLeaves.position.y = y;
		treeLeaves.position.z = z;
		treeLeaves.castShadow = true;
		treeLeaves.receiveShadow = true;
		return treeLeaves;

	}

	const moongeo = new THREE.SphereGeometry(1, 15, 16, 0, 2*Math.PI, 0, Math.PI);
	const moonmat = new THREE.MeshStandardMaterial({color: 0xFFE6BB});
	const moon = new THREE.Mesh(moongeo, moonmat);
	moon.position.x = moon_posx;
	moon.position.z = moon_posz;
	moon.position.y = moon_posy;
	scene.add(moon);

	//rendering of rtScene?
	
		const innergeometry = new THREE.BoxGeometry(1,1,1);
		const innermaterial = new THREE.MeshPhongMaterial({color: 0x835C24});
		const sphere = new THREE.Mesh(innergeometry, innermaterial);
		rtScene.add(sphere);
	

	//for loop instead of manually producing this?
	const treeleaves = [
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, -10, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, -20, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, -30, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, -40, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, -40, 0, -33),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, -40, 0, -20),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, -40, 0, -10),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, 0, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, 10, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, 20, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, 30, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, 40, 0, -45),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, 40, 0, -33),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, 40, 0, -20),
		maketreeleaves(treeLeavesGeometry, treeLeavesMaterial, 40, 0, -10),
	]

	{

		const loader = new THREE.CubeTextureLoader();
		 const texture = loader.load([
			'src/resources/px.png',
			'src/resources/nx.png',
			'src/resources/py.png',
			'src/resources/ny.png',
			'src/resources/pz.png',
			'src/resources/nz.png',
		 ])
		scene.background = texture
		


	}

	{
		const objloader = new OBJLoader();
		const mtlloader = new MTLLoader();
		mtlloader.load('src/resources/uploads_files_3639591_Grass.mtl', (mtl) => {
			mtl.preload();
			objloader.setMaterials(mtl);
			objloader.load('src/resources/uploads_files_3639591_Grass.obj',(root) => {
			root.position.y = -3;
			root.position.z = -8;
			root.position.x = -2.4;
			root.scale.set(.5,.5,.5);
			scene.add(root);
			});
			objloader.load('src/resources/uploads_files_3639591_Grass.obj',(root) => {
				root.position.y = -3;
				root.position.z = 3.1;
				root.position.x = 7.4;
				root.scale.set(.5,.5,.5);
				scene.add(root);
			});
		});
		
	}

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		//rotates the cube in rendering 
		treeleaves.forEach( ( treeleaves, ndx ) => {

			const speed = .3 + ndx * .000001;
			const rot = time * speed;
			treeleaves.rotation.x = rot;
			treeleaves.rotation.y = rot;

		} );

		sphere.rotation.x = time * .3;
		sphere.rotation.y = time * .3;

		renderer.setRenderTarget(renderTarget);
		renderer.render(rtScene, rtCamera);
		renderer.setRenderTarget(null);

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );
	//optimize this later
}

main();
