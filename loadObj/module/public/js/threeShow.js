var container;
var camera, controls, scene, renderer;
var backgroundScene, backgroundCamera;

var manager = new THREE.LoadingManager();
manager.onLoad = function () {
	$(".loading").hide();
	// document.getElementById("loaderdiv").style.display="none"
};
window.onload = function () {
	createLoadingHtml();
	// console.log("load");
	if (!Detector.webgl) {
		// alert("kk");
		$(".failure").show();
		$("body").css("background-color", '#fff');
		return;
	}
	$(".loading").show();
	init(opts);

}

var onProgress = function (xhr) {
	if (xhr.lengthComputable) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		// console.log(percentComplete);

		var num = 0.01 * percentComplete;
		console.log(Math.round(percentComplete, 2) + "%");
		//$("#bar").html(Math.round(percentComplete, 2)+ "%");

		$("#num").css("left", num * 341 - 21);
		$("#num").html(Math.round(percentComplete, 2) + "%");
		$("#left").css("left", (num - 1) * 341);
		if (Math.round(percentComplete, 2) == 100) {
			$(".loading").hide();
		}
	}
}



// 参数说明
// near 最近面距离
// position 相机位置
// modelpath 模型路径

function init(options) {

	options = options || {};
	var near = options.near || 0.001;
	var far = options.far || 10000000;
	var minDistance = options.minDistance || 10
	var maxDistance = options.maxDistance || 250
	// var positionx=options.positionx || 0;
	var positionz = options.positionz || 5;
	camera = new THREE.PerspectiveCamera(60, Width / Height, near, far);
	camera.position.set(0, 0, positionz);


	scene = new THREE.Scene();

	// light
	var ambienlLight = new THREE.AmbientLight(0xffffff);

	//ambienlLight.position.set( 0, 0, 0 );
	scene.add(ambienlLight);




	var arr = options.name.split('.'); //
	// var pathBase=data.ModelUrl.substr(0,index+1);//setPath
	// var pathBehind=data.ModelUrl.substr(index+1);
	// var filename=pathBehind.substr(0,pathBehind.lastIndexOf("."));
	// var fileExt=pathBehind.substr(pathBehind.lastIndexOf(".")+1);
	var opts = {
		filename: arr[0],
		callback: adjustSceneParam
	};
	if (arr[1] == "js") {
		binaryLoader(opts, options);
	} else {
		objLoader(opts, options);
	}
	// renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		preserveDrawingBuffer: true
	});
	renderer.setClearColor(0x4f4f4f, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container = document.getElementById('ThreeJS');
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);

	//background
	var backgroundMesh;
	backgroundScene = new THREE.Scene();
	backgroundCamera = new THREE.Camera();
	var textureloader = new THREE.TextureLoader()
	textureloader.load('images/bg.png', function (texture) {
		backgroundMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(2, 2, 0),
			new THREE.MeshBasicMaterial({
				map: texture
			}));

		backgroundMesh.material.depthTest = false;
		backgroundMesh.material.depthWrite = false;
		backgroundScene.add(backgroundCamera);
		backgroundScene.add(backgroundMesh);


	});

	if (!isMobile()) {
		// 设置高清按钮url
		var linkhref = window.location.href.replace("3DMode", "U3DMode");
		//var linkhref="http://58.214.19.236:8082/WaterMark/U3DMode/"+arr[0]+".html";
		var btndiv = document.createElement('div');
		btndiv.setAttribute("id", "btn");
		var link = document.createElement('a');
		link.setAttribute("href", linkhref);
		link.setAttribute("target", "_blank")
		btndiv.appendChild(link);
		document.body.appendChild(btndiv);
	}

	animate();

}





function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

	controls.handleResize();

}

function animate() {

	requestAnimationFrame(animate);

	if (controls) {
		controls.update();
	}
	renderer.autoClear = false;
	renderer.clear();
	renderer.render(backgroundScene, backgroundCamera);
	renderer.render(scene, camera);

}

// binary加载器
function binaryLoader(opts, param) {
	var binaryLoader = new THREE.BinaryLoader(manager);
	binaryLoader.setCrossOrigin('');
	// binaryLoader.setPath("models/")
	binaryLoader.load("models/" + opts.filename + "/" + opts.filename + ".js", function (geo, mtl) {

		var material = new THREE.MultiMaterial(mtl);
		var mesh = new THREE.Mesh(geo, material);
		if (param.rotationx) {
			mesh.rotation.x = param.rotationx * Math.PI;
		}
		if (param.rotationy) {
			object.rotation.y = param.rotationy * Math.PI;
		}
		scene.add(mesh);
		if (opts.callback) {
			opts.callback(mesh, param);
		}
	}, onProgress);
}

function objLoader(opts, param) {
	var mtlLoader = new THREE.MTLLoader(manager);
	mtlLoader.setCrossOrigin('');
	// mtlLoader.setPath("http://124.202.158.212:8001/Zjbwg/ModelUrl/ztmx/zjsb/");
	mtlLoader.setPath("models/" + opts.filename + "/");
	mtlLoader.load(opts.filename + '.mtl', function (materials) {
		materials.preload();
		var objLoader = new THREE.OBJLoader(manager);
		objLoader.setMaterials(materials);
		objLoader.setPath("models/" + opts.filename + "/");
		objLoader.load(opts.filename + '.obj', function (object) {
			if (param.side) {
				for (var i = 0; i < object.children.length; i++) {
					var child = object.children[i];
					var materials = child.material.materials;
					for (var j = 0; j < materials.length; j++) {
						materials[j].side = THREE.DoubleSide;
					}

				}
			}


			scene.add(object);
			if (param.rotationx) {
				object.rotation.x = param.rotationx * Math.PI;
			}
			if (param.rotationy) {
				object.rotation.y = param.rotationy * Math.PI;
			}
			if (opts.callback) {
				opts.callback(object, param);
			}

		}, onProgress);

	});
}

function adjustSceneParam(object, param) {
	var box3 = new THREE.Box3().setFromObject(object);
	var size = box3.size();
	var boxwidth = size.x;
	var boxheight = (window.innerHeight / window.innerWidth) * boxwidth;
	if (boxheight < size.y) {
		boxheight = size.y;
		boxheight = (window.innerWidth / window.innerHeight) * boxheight;
	}

	//var 

	//根据尺寸调整灯光位置
	var dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
	dirLight1.position.set(-size.x, size.y, size.z);
	scene.add(dirLight1);

	/*这段代码为了圆白玉写的*/
	if (opts.name == "yuanbaiyu.obj") {
		dirLight1.intensity = 0.1
	}
	/*end*/

	var dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
	dirLight2.position.set(-size.x, size.y, -size.z);
	scene.add(dirLight2);

	var dirLight3 = new THREE.DirectionalLight(0xffffff, 1);
	dirLight3.position.set(size.x, -size.y, size.z);
	scene.add(dirLight3);

	var dirLight4 = new THREE.DirectionalLight(0xffffff, 1);
	dirLight4.position.set(size.x, -size.y, -size.z);
	scene.add(dirLight4);

	var near = 0.001 * Math.min.apply(null, [size.x, size.y, size.z]);
	var far = 10 * Math.max.apply(null, [size.x, size.y, size.z]);
	camera = new THREE.PerspectiveCamera(60, Width / Height, near, far);
	camera.updateProjectionMatrix(); //更新相机
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 3.0;
	controls.zoomSpeed = 2;
	controls.panSpeed = 2;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;
	//controls.minDistance=minDistance;
	//controls.maxDistance=maxDistance;

	//根据尺寸调整相机位置
	var position = new THREE.Vector3();
	var midsize = 1.75 * Math.min.apply(null, [boxwidth, boxheight]);
	position.y = param.positiony || 0;
	position.z = param.positionz || midsize;
	if (param.hasOwnProperty("positionz")) {
		position.z = param.positionz;
	}
	if (param.hasOwnProperty("positiony")) {
		position.y = 1.75 * Math.min.apply(null, [boxwidth, boxheight]);
	}

	camera.position.copy(position);

	var max = 1,
		min = 1;
	if (param.hasOwnProperty("min")) {
		min = param.min;
	}
	if (param.hasOwnProperty("max")) {
		max = param.max;
	}

	controls.minDistance = min * 0.5 * boxheight;
	controls.maxDistance = max * 3 * boxheight;

	//camera.far=10000000;
	//camera.updateProjectionMatrix(); //更新相机

}