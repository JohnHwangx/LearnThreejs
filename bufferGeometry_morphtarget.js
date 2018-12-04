var container, camera, renderer, mesh;

var scene = new THREE.Scene();

init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    scene.add(new THREE.AmbientLight(0x0f0f0f, 0.4));

    //container = document.getElementById('container');
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20);
    camera.position.z = 8;
    scene.add(camera);

    var controls = new THREE.OrbitControls(camera, container);

    var pointLight = new THREE.PointLight(0xffffff, 1);
    camera.add(pointLight);

    var geometry = createGeometry();

    var material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        flatShading: true,
        morphTargets: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    initGUI();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setAnimationLoop(function () {
        renderer.render(scene, camera);
    });

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function createGeometry() {


    var geometry = new THREE.BoxBufferGeometry(2, 2, 2, 32, 32, 32);

    geometry.morphAttributes.position = [];

    var positions = geometry.attributes.position.array;

    var spherePositions = [];

    var twistPositions = [];

    var direction = new THREE.Vector3(1, 0, 0).normalize();
    var vertex = new THREE.Vector3();

    for (let i = 0; i < positions.length; i += 3) {

        let x = positions[i];
        let y = positions[i + 1];
        let z = positions[i + 2];

        spherePositions.push(
            x * Math.sqrt(1 - (y * y / 2) - (z * z / 2)),
            y * Math.sqrt(1 - (z * z / 2) - (x * x / 2) + (z * z * x * x / 3)),
            z * Math.sqrt(1 - (x * x / 2) - (y * y / 2) + (x * x * y * y / 3))
        );

        vertex.set(x * 2, y, z);

        vertex.applyAxisAngle(direction, Math.PI * x / 2).toArray(twistPositions, twistPositions.length);

    }
    geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);
    geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(twistPositions, 3);

    return geometry;
}

function initGUI() {
    var params = {
        Spherify: 0,
        Twist: 0
    };

    var gui = new dat.GUI();
    var folder = gui.addFolder('Morph Targets');

    folder.add(params, 'Spherify', 0, 1).step(0.01).onChange(function (value) {

        mesh.morphTargetInfluences[0] = value;

    });
    folder.add(params, 'Twist', 0, 1).step(0.01).onChange(function (value) {

        mesh.morphTargetInfluences[1] = value;

    });

    folder.open();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}