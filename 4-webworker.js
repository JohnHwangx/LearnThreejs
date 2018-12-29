// import { PerspectiveCamera } from "three";

(function () {
    var camera, mesh, scene, renderer, container, svgContainer;
    var controls;
    var lineNum = 1000;
    var raycaster;
    var mouse = new THREE.Vector2();

    var positions = [];
    var colors = [];
    let pointPositions = [];
    var points;
    var pointGeometry;
    var worker = new Worker('4-webworker_worker.js');

    (function () {
        container = document.createElement('div');
        //container.id = 'drawing';
        document.body.appendChild(container);

        svgContainer = document.createElement('div');
        svgContainer.style.position = 'absolute';
        svgContainer.style.width = '100%';
        svgContainer.style.height = '100%';
        svgContainer.id = 'drawing';
        container.appendChild(svgContainer);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        //  camera = new THREE.OrthographicCamera(-1000,1000,1000,-1000,1,3000);
        camera.position.z = 2000;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        scene.add(camera);

        controls = new THREE.TrackballControls(camera, container);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];

        controls.addEventListener('change', onControlChanged);
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mousedown', onMouseDown);

        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        let geometry = createLines();
        mesh = new THREE.LineSegments(geometry, material);
        scene.add(mesh);

        // pointGeometry = new THREE.BufferGeometry();
        // // pointGeometry = createPoints();
        // let pointMaterial = new THREE.PointsMaterial({ size: 15, vertexColors: THREE.VertexColors });
        // points = new THREE.Points(pointGeometry, pointMaterial);
        // scene.add(points);

        window.addEventListener('resize', onWindowResize, false);
    })();

    (function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();

    })();

    function render() {
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    var lastMouse = new THREE.Vector2();

    function onMouseDown(event) {
        event.preventDefault();

        lastMouse.x = event.clientX;
        lastMouse.y = event.clientY;
    }

    function onMouseUp(event) {
        event.preventDefault();
        // alert("hahaha");
        if (lastMouse.x === event.clientX && lastMouse.y === event.clientY) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            svgContainer.innerHTML = '';

            raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            (function () {

                // pointGeometry.removeAttribute('position');
                // pointGeometry.removeAttribute('color');


                let ray = raycaster.ray;
                let direction = ray.direction;
                let origin = ray.origin;

                let param = {
                    'rayDirection': direction,
                    'rayOrigin': origin,
                    'linePositions': positions
                }

                worker.postMessage(param);

                // let pointPositions = [];
                let pointColors = [];

                worker.onmessage = function (e) {
                    let data = e.data;
                    pointPositions = data.pointPositions;
                    pointColors = data.pointColors;

                    let draw = SVG('drawing').size('100%', '100%').style({ position: 'absolute' });

                    for (let i = 0; i < pointPositions.length; i += 3) {
                        let vector3 = new THREE.Vector3(pointPositions[i], pointPositions[i + 1], pointPositions[i + 2]);
                        let vector2 = tramsformVector3(vector3);
                        // let vector2 = pointToScreen(vector3);

                        let rect = draw.rect(10, 10).fill('#0f6').move(vector2.x, vector2.y);
                    }

                    // pointGeometry.addAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
                    // pointGeometry.addAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));

                    //render();
                }
            })()
        }

    }

    function onControlChanged() {
        svgContainer.innerHTML = '';

        let draw = SVG('drawing').size('100%', '100%').style({ position: 'absolute' });
        for (let i = 0; i < pointPositions.length; i += 3) {
            let vector3 = new THREE.Vector3(pointPositions[i], pointPositions[i + 1], pointPositions[i + 2]);
            let vector2 = tramsformVector3(vector3);
            // let vector2 = pointToScreen(vector3);

            let rect = draw.rect(10, 10).fill('#0f6').move(vector2.x, vector2.y);
        }
    }

    function tramsformVector3(vector3) {
        var vector = vector3.project(camera);
        var scr_x = (0.5 + vector.x / 2) * window.innerWidth;
        var scr_y = (0.5 - vector.y / 2) * window.innerHeight;

        // let scr_x = vector3.x + window.innerWidth / 2;
        // let scr_y = window.innerHeight / 2 - vector3.y;

        return new THREE.Vector2(scr_x, scr_y);
    }

    function pointToScreen(vector3) {
        let p = new THREE.Vector4();

        p.x = vector3.x;
        p.y = vector3.y;
        p.z = vector3.z;
        p.w = 1;

        camera.matrixAutoUpdate = true
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();


        p.applyMatrix4(camera.matrixWorldInverse);
        p.applyMatrix4(camera.projectionMatrix);

        let point = normalToCurrent(p.x, p.y);
        point.x = Math.floor(point.x) + 0.5;
        point.y = Math.floor(point.y) + 0.5;

        return point;
    }

    function normalToCurrent(x, y) {
        let width = container.clientWidth;
        let height = container.clientHeight;

        return new THREE.Vector2((x + 1) / 2 * width, (1 - y) / 2 * height);
    }

    function createLines() {
        let diameter = 1000;
        let geometry = new THREE.BufferGeometry();
        let indices = [];
        let pi2 = Math.PI * 2;
        let lineLength = 300;

        for (let i = 0; i < lineNum; i++) {

            // // for (let j = 0; j < 2; j++) {
            // let r = (Math.random() - 0.5) * diameter*2;
            // let alpha = Math.random() * pi2;
            // // let beta = Math.random() * pi2;
            // // let alpha = pi2 / lineNum * i;
            // let beta = pi2 / lineNum * i;
            // let x1 = r * Math.sin(alpha) * Math.cos(beta);
            // let y1 = r * Math.sin(alpha) * Math.sin(beta);
            // let z1 = r * Math.cos(alpha);

            let x1 = (Math.random() - 0.5) * diameter
            let y1 = (Math.random() - 0.5) * diameter
            let z1 = (Math.random() - 0.5) * diameter

            positions.push(x1, y1, z1);

            alpha = Math.random() * pi2;
            beta = Math.random() * pi2;
            // let x2 = x1 + lineLength * Math.sin(beta) * Math.cos(alpha);
            // let y2 = y1 + lineLength * Math.sin(beta) * Math.sin(alpha);
            // let z2 = z1 + lineLength * Math.cos(beta);

            let x2 = x1 + lineLength * Math.sin(beta) * Math.sin(alpha);
            let y2 = y1 + lineLength * Math.sin(beta) * Math.cos(alpha);
            let z2 = z1 + lineLength * Math.cos(beta);

            positions.push(x2, y2, z2);

            // colors

            colors.push((x1 / diameter) + 0.5);
            colors.push((y1 / diameter) + 0.5);
            colors.push((z1 / diameter) + 0.5);
            colors.push((x2 / diameter) + 0.5);
            colors.push((y2 / diameter) + 0.5);
            colors.push((z2 / diameter) + 0.5);
            
            // colors.push(1);
            // colors.push(0);
            // colors.push(0);
            // colors.push(0);
            // colors.push(0);
            // colors.push(1);

            indices.push(i * 2, 2 * i + 1);

            // pointPositions.push(x1, y1, z1, x2, y2, z2);
            // scales.push(8, 8);
            // }
        }
        geometry.setIndex(indices);
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        return geometry;
    }
})()

