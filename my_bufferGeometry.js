var container, stats;
var camera, scene, renderer, mesh;
var bufferGeometry;
var controls;
var material;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500);
    camera.position.z = 2750;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.add(new THREE.AmbientLight(0x444444));
    scene.add(camera);

    //scene.remove()

    controls = new THREE.OrbitControls(camera, container);

    var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    bufferGeometry = createGeometry(3);

    material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa, specular: 0xffffff, shin: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    });

    mesh = new THREE.Mesh(bufferGeometry, material);
    // mesh.name='mesh';    
    scene.add(mesh);

    let planeGeometry = createPlane();
    let planeMesh = new THREE.Mesh(planeGeometry,material);
    scene.add(planeMesh);

    initGUI();

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;

    // renderer.setAnimationLoop(function () {
    //     renderer.render(scene, camera);
    // });
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);

    // render();
}

function createPlane() {
    let planeGeometry = new THREE.BufferGeometry();
    let positions = [];
    positions.push(500, 0, 500);
    positions.push(-500, 0, 500);
    positions.push(-500, 0, -500);
    positions.push(-500, 0, -500);
    positions.push(500, 0, 500);
    positions.push(500, 0, -500);

    var color = new THREE.Color();
    color.setRGB(Math.random(), Math.random(), Math.random());
    let colors = [];
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);

    planeGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    planeGeometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return planeGeometry;
}

function createGeometry(n) {

    var bufferGeometry = new THREE.BufferGeometry();
    var positions = [];
    var normals = [];
    var colors = [];
    var color = new THREE.Color();

    var height = 300, radius = 200;
    var angle = Math.PI * 2 / n;

    var nextx, nexty, nextz;
    var startx, starty, startz;

    //缓存圆锥斜面的三个顶点
    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();

    var ca = new THREE.Vector3();
    var cb = new THREE.Vector3();

    for (let i = 0; i < n; i++) {
        //绘制底部圆形
        let currentx, currenty, currentz;
        if (i == 0) {
            startx = radius * Math.sin(i * angle);
            starty = 0;
            startz = radius * Math.cos(i * angle);

            currentx = startx;
            currenty = starty;
            currentz = startz;
        } else {
            currentx = nextx;
            currenty = nexty;
            currentz = nextz;
        }

        if (i == n - 1) {
            nextx = startx;
            nexty = starty;
            nextz = startz;
        } else {
            nextx = radius * Math.sin((i + 1) * angle);
            nexty = 0;
            nextz = radius * Math.cos((i + 1) * angle);
        }

        positions.push(currentx, currenty, currentz);
        positions.push(nextx, nexty, nextz);
        positions.push(0, 0, 0);

        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);

        color.setRGB(Math.random(), Math.random(), Math.random());
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);

        //绘制顶部圆锥
        positions.push(currentx, currenty, currentz);
        positions.push(nextx, nexty, nextz);
        positions.push(0, height, 0);

        pA.set(currentx, currenty, currentz);
        pB.set(nextx, nexty, nextz);
        pC.set(0, height, 0);

        ca.subVectors(pA, pC);
        cb.subVectors(pB, pC);
        ca.cross(cb);
        ca.normalize();
        normals.push(ca.x, ca.y, ca.z);
        normals.push(ca.x, ca.y, ca.z);
        normals.push(ca.x, ca.y, ca.z);

        color.setRGB(Math.random(), Math.random(), Math.random());
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
    }

    bufferGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    bufferGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    bufferGeometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // bufferGeometry.computeBoundingSphere();
    return bufferGeometry;
}

function initGUI() {
    var params = {
        RadialSegment: 3,
    };

    var gui = new dat.GUI();
    var folder = gui.addFolder('accuracy');
    folder.add(params, 'RadialSegment', 3, 100).step(1).onChange(function (value) {

        //n = value;
        bufferGeometry = createGeometry(value);
        //mesh = new THREE.Mesh(bufferGeometry, material);
        mesh.geometry=bufferGeometry;

        // var allChildren = scene.children;
        // var lastObject = allChildren[allChildren.length - 1];
        // if (lastObject instanceof THREE.Mesh) {
        //     scene.remove(lastObject);
        //     scene.add(mesh);
        // }
        render();
    });
    folder.open();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    // controls.handleResize();
    // render();
}

function animate() {
    requestAnimationFrame(animate);

    render();
    controls.update();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}