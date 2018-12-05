var container, stats;
var camera, scene, renderer, controls;
var mesh;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500);
    camera.position.z = 2750;

    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [65, 83, 68];
    controls.addEventListener('change', render);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.add(new THREE.AmbientLight(0x444444));

    var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    var triangles = 1600;

    var bufferGeometry = new THREE.BufferGeometry();

    var positions = [];
    var normals = [];
    var colors = [];

    var color = new THREE.Color();

    var radius=200,height=300,radialSegments=3;

    // var n = 400;
    var n1=300,n2=600,n3=800;
    var d = 80;

    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();

    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();

    for (let i = 0; i < triangles; i++) {
        var x = (Math.random() - 0.5) * n1;
        var y = (Math.random() - 0.5) * n2;
        var z = (Math.random() - 0.5) * n3;

        var ax = x + (Math.random() - 0.5) * d;
        var ay = y + (Math.random() - 0.5) * d;
        var az = z + (Math.random() - 0.5) * d;

        var bx = x + (Math.random() - 0.5) * d;
        var by = y + (Math.random() - 0.5) * d;
        var bz = z + (Math.random() - 0.5) * d;

        var cx = x + (Math.random() - 0.5) * d;
        var cy = y + (Math.random() - 0.5) * d;
        var cz = z + (Math.random() - 0.5) * d;

        positions.push(ax, ay, az);
        positions.push(bx, by, bz);
        positions.push(cx, cy, cz);

        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        cb.normalize();

        var nx = cb.x;
        var ny = cb.y;
        var nz = cb.z;

        normals.push(nx, ny, nz);
        normals.push(nx, ny, nz);
        normals.push(nx, ny, nz);

        var vx = (x / n1) + 0.5;
        var vy = (y / n2) + 0.5;
        var vz = (z / n3) + 0.5;

        color.setRGB(vx, vy, vz);

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

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

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

    //render();
    controls.update();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}