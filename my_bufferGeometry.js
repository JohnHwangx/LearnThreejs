var container, stats;
var camera, scene, renderer,  mesh,n;
var controls;

init();
// animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500);
    camera.position.z = 2750; 

    // controls = new THREE.TrackballControls(camera);
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.3;
    // controls.keys = [65, 83, 68];
    // controls.addEventListener('change', render);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.add(new THREE.AmbientLight(0x444444));   
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, container);

    var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    var bufferGeometry = new THREE.BufferGeometry();
    var positions = [];
    var normals = [];
    var colors = [];
    var color = new THREE.Color();

    n=3;
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

    bufferGeometry.computeBoundingSphere();

    var material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa, specular: 0xffffff, shin: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    });

    mesh = new THREE.Mesh(bufferGeometry, material);
    scene.add(mesh);

    initGUI();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setAnimationLoop(function () {
        renderer.render(scene, camera);
    });
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);

    render();
}

function initGUI() {
    var params={
        RadialSegment:3,
    };

    var gui=new dat.GUI();
    var folder=gui.addFolder('accuracy');
    folder.add(params,'RadialSegment',3,100).step(1).onChange(function (value) {
        n=value;
        render();
    });
    folder.open();
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

    //render();
    controls.update();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}