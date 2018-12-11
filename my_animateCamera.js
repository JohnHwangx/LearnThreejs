var camera, scene, renderer, mesh;
var cintainer;

var positions = new Array();

init();

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
    for (let i = 0; i < 3; i++) {

        var material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff, wireframe: true });
        var object = new THREE.Mesh(geometry)

        object.position.x = Math.random() * 200 - 100;
        object.position.y = Math.random() * 200 - 100;
        object.position.z = Math.random() * 200 - 100;

        positions.push(object.position);

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        scene.add(object);
    }

    camera.position = positions[0];//设置相机初始位置在第一个cube处
    camera.lookAt(positions[1]);

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function animate() {

    requestAnimationFrame(animate);



    render();
}

function render() {

    let r = Date.now() * 0.0005;
    let speed = 5;
    let distance = camera.position.distanceTo(positions[1]);

    let direction=new THREE.Vector3();
    direction.subVectors(positions[1],positions[0]);
    direction.normalize();
    var moveDistance =direction.multiplyScalar(speed);
    let position=moveDistance.add(camera.position);//相机移动距离
    camera.position=position;
}