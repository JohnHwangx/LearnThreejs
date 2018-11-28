var container, stats;
var raycaster, camera, scene, renderer;

var mouse = new THREE.Vector2(), INTERSCTED;
var radius = 100, theta = 0;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    // var info = document.createElement('div');
    // info.style.position = 'absolute';
    // info.style.top = '10px';
    // info.style.width = '100%';
    // info.style.textAlign = 'center';
    // info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - interactive cubes';
    // container.appendChild(info);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    for (let i = 0; i < 2000; i++) {
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ));

        object.position.x = Math.random() * 800 - 400;
        object.position.y = Math.random() * 800 - 400;
        object.position.z = Math.random() * 800 - 400;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;

        scene.add(object);
    }

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // stats = new Stats();
    // container.appendChild(stats.dom);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {

    requestAnimationFrame(animate);

    render();
    // stats.update();
}

function render() {
    theta += 0.1;

    camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
    camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
    camera.lookAt(scene.position);

    camera.updateMatrixWorld();

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {

        if (INTERSCTED != intersects[0].object) {

            if(INTERSCTED) INTERSCTED.material.emissive.setHex(INTERSCTED.currentHex);

            INTERSCTED = intersects[0].object;
            INTERSCTED.currentHex = INTERSCTED.material.emissive.getHex();
            INTERSCTED.material.emissive.setHex(0xff0000);

        } else {

            if (INTERSCTED) INTERSCTED.material.emissive.setHex(INTERSCTED.currentHex);

            INTERSCTED = null;

        }

        renderer.render(scene, camera);
    }
}