var camera, scene, renderer, mesh;
var cintainer;

var currentIndex;//当前相机观察的物体的编号
var meshCount = 3;//模型数量

var positions = new Array();
var speed = 1;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    //camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);
    scene.add(new THREE.AmbientLight(0x444444));
    scene.add(camera);

    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    let colors = [0xff0000, 0x00ff00, 0x0000ff];
    for (let i = 0; i < meshCount; i++) {

        var material = new THREE.MeshLambertMaterial({ color:colors[i] });
        var object = new THREE.Mesh(geometry, material);

        object.position.x = Math.random() * 200 - 100;
        object.position.y = Math.random() * 200 - 100;
        object.position.z = Math.random() * 200 - 100;

        positions.push(object.position);

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        scene.add(object);
    }

    currentIndex = 1;

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

    //判断相机是否在Mesh处，设置精度为5
    let vector = positions[currentIndex].sub(camera.position);
    let distance = vector.length();

    if (distance < 100) {
        if (currentIndex == meshCount - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
    }

    let lastIndex = currentIndex - 1;
    if (currentIndex == 0) {
        lastIndex = meshCount - 1;
    }
    else if (currentIndex == meshCount - 1) {
        lastIndex = 0
    }

    let direction = new THREE.Vector3();

    //direction.sub();

    direction.subVectors(positions[currentIndex], positions[lastIndex]);
    direction.normalize();
    var moveDistance = direction.multiplyScalar(speed);
    let position = moveDistance.add(camera.position);//相机移动距离
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(positions[currentIndex]);

    // renderer.clear();

    renderer.render(scene, camera);
}