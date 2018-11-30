// document.write("<script language=javascript src='domElement.js'></script> ");

class DomElement {
    constructor(value) {

        this.element = document.createElement('div');
        // this.element.id = index;
        this.element.style.width = '50px';
        this.element.style.position = 'absolute';
        this.element.style.color = '#00ff00';
        this.element.innerHTML = value;
    }

    setPos(posx, posy, position3D) {
        this.element.style.visibility = 'visible';
        this.element.style.left = posx + 'px';
        this.element.style.top = posy + 'px';
        // this.worldMatrix = worldMatrix;
        this.position3D = position3D;
    }

    update(camera) {

        var vectorClone = this.position3D.clone();

        var vector = vectorClone.project(camera);
        var scr_x = (0.5 + vector.x / 2) * window.innerWidth;
        var scr_y = (0.5 - vector.y / 2) * window.innerHeight;

        this.element.style.left = scr_x + 'px';
        this.element.style.top = scr_y + 'px';
    }

    hindElement() {
        this.element.style.visibility = 'hidden';
    }
}

var camera, scene, controls, renderer, stats;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;

var container, info;
// var index;
var nodeList = new Array();
var infoList = new Array();

init();
animate();

function init() {

    // index = 0;
    container = document.createElement('div');
    document.body.appendChild(container);

    info = new DomElement('value');
    container.appendChild(info.element);

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

    // raycaster = new THREE.Raycaster();

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    controls.addEventListener('change', onControlsChanged, false);

    window.addEventListener('resize', onWindowResize, false);

    render();
}

function onControlsChanged(event) {
    // var posx = event.clientX;
    // var posy = event.clientY;

    info.update(camera);

    for (const newInfo in infoList) {
        if (infoList.hasOwnProperty(newInfo)) {
            newInfo.
        }
    }
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

        if (event.ctrlKey) {

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {

                // if (INTERSECTED != intersects[0].object) {

                // if (INTERSECTED) {

                //     INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                // }

                var newIntersected = intersects[0].object;
                newIntersected.currentHex = newIntersected.material.emissive.getHex();
                newIntersected.material.emissive.setHex(0xff0000);

                nodeList.push(newIntersected);

                // var infoWorldMatrix = newIntersected.matrixWorld;
                // var position3D = INTERSECTED.getWorldPosition();

                var realPosition = intersects[0].point;
                
                var newNode = new DomElement('value');
                container.appendChild(newNode.element);
                newNode.setPos(event.clientX, event.clientY, realPosition);

                infoList.push(newNode.element);

                // info.setPos(event.clientX, event.clientY, realPosition);
                // }
            }
            // else {

            //     if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            //     INTERSECTED = null;
            //     info.hindElement();
            // }

            render();
        }
        else {

            while (infoList.length > 0) {
                var element = infoList.shift();
                if (element != null) {
                    element.parentNode.removeChild(element);
                }
            }

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // raycaster = new THREE.Raycaster();//delete!!!!!**********************************************************************
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

                    // var infoWorldMatrix = INTERSECTED.matrixWorld;
                    // var position3D = INTERSECTED.getWorldPosition();

                    var realPosition = intersects[0].point;

                    // var vectorClone=position3D.clone();

                    info.setPos(event.clientX, event.clientY, realPosition);
                }
            }
            else {

                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

                INTERSECTED = null;
                info.hindElement();
            }

            render();
        }
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