"use strict";

const canvas_width  = 720;
const canvas_height = 540;
const camera_default = {
	position: { x: 1, y: 2, z: 0 },
	lookAt: { x: 0, y: 0, z: -5 }
}
const photon_speed = 0.1;
let photons = [];
let camera;
let time = 0;
let theta = 0;
let gear_tooth_num = 8;
let rotation_time = 0;
let gear;
let scene;
let orbitControl;

function create_gear(tooth_num, size1_1 = 0.7, size1_2 = 0.2, size2_1 = 1, size2_2 = 0.1, color1 = 0xc8521f, color2 = 0xb7410e){
	const gear = new THREE.Group();
	const cylinder = new THREE.Mesh(
		new THREE.CylinderGeometry(size1_1, size1_1, size1_2, 64),
		new THREE.MeshPhongMaterial({ color: color1 })
	);
	for(let i=0; i<tooth_num; i++){
		gear.add(new THREE.Mesh(
			new THREE.CylinderGeometry(size2_1, size2_1, size2_2, 64, 1, false, Math.PI * i * 2 / tooth_num, Math.PI / tooth_num),
			new THREE.MeshPhongMaterial({ color: color2 })
		));
		const side1 = new THREE.Mesh(
			new THREE.PlaneGeometry(size2_2, size2_1 * 2),
			new THREE.MeshPhongMaterial({ color: color2 })
		)
		side1.rotation.y = Math.PI * i * 2 / tooth_num;
		side1.rotation.z = Math.PI / 2;
		gear.add(side1);
		const side2 = new THREE.Mesh(
			new THREE.PlaneGeometry(size2_2, size2_1 * 2),
			new THREE.MeshPhongMaterial({ color: color2 })
		)
		side2.rotation.y = Math.PI * (i * 2 + 1) / tooth_num;
		side2.rotation.z = Math.PI / 2;
		gear.add(side2);
	}
	gear.add(cylinder);
	gear.tooth_num = tooth_num;
	
	return gear;
}

const init = function(){
	// レンダラーの設定
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(canvas_width, canvas_height);
	let form = document.getElementById("form");
	form.parentNode.insertBefore(renderer.domElement, form);
	
	// シーンを作成
	scene = new THREE.Scene();
	
	// カメラの設定
	camera = new THREE.PerspectiveCamera(50, canvas_width / canvas_height, 1, 1000);
	camera.position.set(camera_default.position.x, camera_default.position.y, camera_default.position.z);
	camera.lookAt(camera_default.lookAt);
//	orbitControl = new THREE.OrbitControls(camera);
	
	// 歯車を作成
	reset_gear();
	
	// 鏡を作成
	const mirror = new THREE.Mesh(
			new THREE.BoxGeometry(5, 5, 0.1),
			new THREE.MeshPhongMaterial({ color: 0xccffff })
		);
	mirror.position.set(0, 0, -10);
	scene.add(mirror);
	
	// 光を作成
	const default_photon = new THREE.Mesh(
			new THREE.SphereGeometry(0.04),
			new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true })
		);
	default_photon.position.set(0, 0.75, 0);
	default_photon.vz = -photon_speed;
	default_photon.living = true;
	
	// 光源を生成
	const light1 = new THREE.DirectionalLight(0xcccccc);
	light1.position.set(1, 1, 1);
	scene.add(light1);
	const light2 = new THREE.AmbientLight(0x333333);
	scene.add(light2);
	
	document.getElementById("gear_tooth_num").addEventListener("change", reset_gear);
	document.getElementById("rotation_time").addEventListener("change", function(){
		theta = gear.rotation.y;
		time = 0;
		rotation_time  = parseInt(document.getElementById("rotation_time").value);
	});
	
	// フレーム毎の更新処理
	var update = function(){
		requestAnimationFrame(update);
//		orbitControl.update();
		
		time++;
		if (time % 3 == 0){
			var photon = default_photon.clone();
			photon.vz = -photon_speed;
			photon.living = true;
			photons.push(photon);
			scene.add(photon);
		}
		
		if (rotation_time != 0) gear.rotation.y = 2 * time * Math.PI / 161 / rotation_time + theta;
		
		photons.forEach(function(photon){
			photon.position.z += photon.vz;
			photon.position.y += 0.001;
			
			if (photon.position.z <= -10){
				photon.vz = -photon.vz;
				photon.position.z = -10;
			}
			if (photon.position.z > 0) photon.living = false;
			
			if (photon.position.z <= -1.95 && photon.position.z >= -2.05){
				if (((Math.ceil(gear.rotation.y * gear.tooth_num / Math.PI)) % 2) == 0) photon.living = false;
			}
			if (!photon.living) scene.remove(photon);
		});
		photons = photons.filter(function(photon){ return photon.living });
		// 描画
		renderer.render(scene, camera);
	};
	update();
}
window.addEventListener("DOMContentLoaded", init);

function reset_gear(){
	if (gear) scene.remove(gear);
	gear_tooth_num = parseInt(document.getElementById("gear_tooth_num").value);
	rotation_time  = parseInt(document.getElementById("rotation_time").value);
	
	// 歯車を作成
	gear = create_gear(gear_tooth_num);
	gear.rotation.x = Math.PI / 2;
	theta = Math.PI / 2 + Math.PI / gear.tooth_num / 2 + (gear_tooth_num == 2 ? Math.PI / 2 : 0);
	gear.rotation.y = theta;
	gear.position.z = -2;
	scene.add(gear);
	photons.forEach(function(photon){ scene.remove(photon) });
	photons = [];
}
