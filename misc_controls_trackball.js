if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage);
}

var camera, scene, controls, renderer, stats;
var positions = new Array();

var meshColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff];
var meshPositions = [[0, 40, 0], [-400, -40, 200], [-400, 40, -400], [0, -40, -600], [400, 40, -400], [400, -40, 200]];

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
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

    controls.addEventListener('change', render);

    //world
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    // scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    // var geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    // var material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

    // for (let i = 0; i < 50; i++) {
    //     var mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.x = (Math.random() - 0.5) * 100;
    //     mesh.position.y = (Math.random() - 0.5) * 100;
    //     mesh.position.z = (Math.random() - 0.5) * 100;
    //     mesh.updateMatrix();
    //     mesh.matrixAutoUpdate = true;
    //     scene.add(mesh);
    // }

    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    // let distance = 500;
    // let meshPositions = [[distance, 0, distance], [-distance, 0, distance], [-distance, 0, -distance], [distance, 0, -distance]]
    for (let i = 0; i < 6; i++) {

        var material = new THREE.MeshBasicMaterial({ color: meshColors[i] });
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

    let planematerial = new THREE.MeshPhongMaterial({
        color: 0xffffff, specular: 0xffffff, shin: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    });
    //planematerial=new THREE.MeshBasicMaterial({color:0xffffff});
    let planeGeometry = createPlane();
    let planeMesh = new THREE.Mesh(planeGeometry, planematerial);
    scene.add(planeMesh);

    // camera.position.set(positions[0].x, positions[0].y, positions[0].z);//设置相机初始位置在第一个cube处
    // camera.lookAt(positions[1]);

    //light
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    var light = new THREE.DirectionalLight(0xff0000);
    light.position.set(-1, -1, -1);
    scene.add(light);

    var light = new THREE.AmbientLight(0xffffff);
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

function createPlane() {
    let planeGeometry = new THREE.BufferGeometry();
    let positions = [];
    positions.push(meshPositions[0][0],meshPositions[0][1]-10,meshPositions[0][2]);
    positions.push(meshPositions[1][0],meshPositions[1][1]-10,meshPositions[1][2]);
    positions.push(meshPositions[2][0],meshPositions[2][1]-10,meshPositions[2][2]);

    positions.push(meshPositions[0][0],meshPositions[0][1]-10,meshPositions[0][2]);
    positions.push(meshPositions[2][0],meshPositions[2][1]-10,meshPositions[2][2]);
    positions.push(meshPositions[3][0],meshPositions[3][1]-10,meshPositions[3][2]);

    positions.push(meshPositions[0][0],meshPositions[0][1]-10,meshPositions[0][2]);
    positions.push(meshPositions[3][0],meshPositions[3][1]-10,meshPositions[3][2]);
    positions.push(meshPositions[4][0],meshPositions[4][1]-10,meshPositions[4][2]);

    positions.push(meshPositions[0][0],meshPositions[0][1]-10,meshPositions[0][2]);
    positions.push(meshPositions[4][0],meshPositions[4][1]-10,meshPositions[4][2]);
    positions.push(meshPositions[5][0],meshPositions[5][1]-10,meshPositions[5][2]);

    let planeColors=new Array();
    for (let i = 0; i < meshColors.length; i++) {
        
        let color=new THREE.Color(meshColors[i]);
        planeColors.push(color);
        
    }
    let colors = [];    
    colors.push(planeColors[0].r, planeColors[0].g, planeColors[0].b);
    colors.push(planeColors[1].r, planeColors[1].g, planeColors[1].b);
    colors.push(planeColors[2].r, planeColors[2].g, planeColors[2].b);

    colors.push(planeColors[0].r, planeColors[0].g, planeColors[0].b);
    colors.push(planeColors[2].r, planeColors[2].g, planeColors[2].b);
    colors.push(planeColors[3].r, planeColors[3].g, planeColors[3].b);

    colors.push(planeColors[0].r, planeColors[0].g, planeColors[0].b);
    colors.push(planeColors[3].r, planeColors[3].g, planeColors[3].b);
    colors.push(planeColors[4].r, planeColors[4].g, planeColors[4].b);

    colors.push(planeColors[0].r, planeColors[0].g, planeColors[0].b);
    colors.push(planeColors[4].r, planeColors[4].g, planeColors[4].b);
    colors.push(planeColors[5].r, planeColors[5].g, planeColors[5].b);

    planeGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    planeGeometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return planeGeometry;
}
