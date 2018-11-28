var camera, scene, controls, renderer, stats;

var raycaster, mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;

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

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    // var material=new THREE.MeshPhongMaterial({color:0xf0f0f0,flatShading:true});

    for (var i = 0; i < 500; i++) {

        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xf0f0f0 }));

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

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    // document.addEventListener('click', onDocumentClick, false);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    //document.addEventListener('dblclick')

    window.addEventListener('resize', onWindowResize, false);

    render();
}

var lastMouse = new THREE.Vector2();

function onDocumentMouseDown(event) {
    event.preventDefault();

    lastMouse.x = event.clientX;
    lastMouse.y = event.clientY;
}

function onDocumentMouseUp(event) {
    event.preventDefault();

    if (lastMouse.x === event.clientX && lastMouse.y === event.clientY) {

        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {

            if (INTERSECTED != intersects[0].object) {

                if (INTERSECTED) {

                    INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                }

                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0xff0000);
            }
        }
        else {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = null;
        }

        render();
    }
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

}