var camera, scene, renderer, mesh;
var container;

var targetIndex;//当前相机观察的物体的编号
var meshCount = 4;//模型数量

var positions = new Array();
var speed = 50;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    //camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);
    scene.add(new THREE.AmbientLight(0x444444));
    scene.add(camera);

    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    let colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];

    let distance=500;
    let meshPositions = [[distance, 0, distance], [-distance, 0, distance], [-distance, 0, -distance], [distance, 0, -distance]]
    for (let i = 0; i < meshCount; i++) {

        var material = new THREE.MeshLambertMaterial({ color: colors[i] });
        var object = new THREE.Mesh(geometry, material);

        object.position.x = meshPositions[i][0];
        object.position.y = meshPositions[i][1];
        object.position.z = meshPositions[i][2];

        positions.push(object.position);

        // object.rotation.x = Math.random() * 2 * Math.PI;
        // object.rotation.y = Math.random() * 2 * Math.PI;
        // object.rotation.z = Math.random() * 2 * Math.PI;

        scene.add(object);
    }

    targetIndex = 1;

    camera.position.set(positions[0].x, positions[0].y, positions[0].z);//设置相机初始位置在第一个cube处
    camera.lookAt(positions[1]);

    var equal = camera.position.equals(positions[0]);

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    requestAnimationFrame(animate);

    render();
}

function render() {

    let targetPosition=positions[targetIndex].clone();
    //判断相机是否在Mesh处，设置精度为5
    targetPosition.sub(camera.position);
    let distance = targetPosition.length();

    if (distance== 0) {
        if (targetIndex == meshCount - 1) {
            targetIndex = 0;
        } else {
            targetIndex++;
        }
    }

    let originIndex = targetIndex - 1;
    if (targetIndex == 0) {
        originIndex = meshCount - 1;
    }
    else if (targetIndex == meshCount - 1) {
        originIndex = 0
    }

    let direction = new THREE.Vector3();

    //direction.clone();

    direction.subVectors(positions[targetIndex], positions[originIndex]);
    direction.normalize();
    var moveDistance = direction.multiplyScalar(speed);
    let position = moveDistance.add(camera.position);//相机移动距离
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(positions[targetIndex]);

    // renderer.clear();

    renderer.render(scene, camera);
}