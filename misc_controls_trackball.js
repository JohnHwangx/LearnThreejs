if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage);
}

var camera, scene, controls, renderer, stats;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;

    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [65, 83, 68];

    controls.addEventListener('change', render)

    //world
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    // scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    var geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

    for (let i = 0; i < 50; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 100;
        mesh.position.y = (Math.random() - 0.5) * 100;
        mesh.position.z = (Math.random() - 0.5) * 100;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = true;
        scene.add(mesh);
    }
    //light
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    var light = new THREE.DirectionalLight(0xff0000);
    light.position.set(-1, -1, -1);
    scene.add(light);

    var light = new THREE.AmbientLight(0x0000ff);
    scene.add(light);

    //render
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);

    render();

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();

    render();
}

function animate() {

    requestAnimationFrame(animate);
    controls.update();
}

function render() {
    renderer.render(scene, camera);
    stats.update();
}
