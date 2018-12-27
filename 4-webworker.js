// import { PerspectiveCamera } from "three";

(function () {
    var camera, mesh, scene, renderer;
    var controls;
    var lineNum = 10;
    var raycaster;
    var mouse = new THREE.Vector2();

    // var linePositions=new Array();
    var positions = [];
    var colors = [];
    // var pointPositions = [];
    // var scales = [];
    var points;
    var pointGeometry;

    (function () {
        let container = document.createElement('div');
        document.body.appendChild(container);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
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

        controls.addEventListener('change', render);
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mousedown', onMouseDown);

        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        let geometry = createLines();
        mesh = new THREE.LineSegments(geometry, material);
        scene.add(mesh);

        pointGeometry = new THREE.BufferGeometry();
        // pointGeometry = createPoints();
        let pointMaterial = new THREE.PointsMaterial({ size: 15, vertexColors: THREE.VertexColors });
        points = new THREE.Points(pointGeometry, pointMaterial);
        scene.add(points);

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

            raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            (function () {

                pointGeometry.removeAttribute('position');
                pointGeometry.removeAttribute('color');

                let ray = raycaster.ray;
                let direction = ray.direction;
                let origin = ray.origin;
                let x1 = origin.x, y1 = origin.y, z1 = origin.z;
                let a1 = direction.x, b1 = direction.y, c1 = direction.z;

                let pointPositions=[];   
                // var scales  =[];  
                let pointColors = [];

                for (let i = 0; i < positions.length; i += 6) {
                    let p1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                    let p2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
                    let lineDirection = new THREE.Vector3();
                    lineDirection.subVectors(p1, p2);
                    lineDirection.normalize();

                    let normal = new THREE.Vector3();
                    normal.crossVectors(direction, lineDirection);

                    let a2 = lineDirection.x, b2 = lineDirection.y, c2 = lineDirection.z;
                    let a3 = normal.x, b3 = normal.y, c3 = normal.z;
                    let x3 = p1.x, y3 = p1.y, z3 = p1.z;
                    let x5 = (a3 * x3 + b3 * b3 / a3 * x1 - b3 * (y1 - y3) + c3 * c3 / a3 * x1 - c3 * (z1 - z3)) / (a3 + b3 * b3 / a3 + c3 * c3 / a3);
                    let y5 = b3 / a3 * (x5 - x1) + y1;
                    let z5 = c3 / a3 * (x5 - x1) + z1;

                    let x6 = (b1 / a1 * x5 - y5 - (b2 / a2) * x3 + y3) / (b1 / a1 - b2 / a2);
                    let y6 = b1 / a1 * (x6 - x5) + y5;
                    let z6 = c1 / a1 * (x6 - x5) + z5;

                    pointPositions.push(x6, y6, z6);

                    // scales.push(8);

                    pointColors.push(1, 0, 0);
                }

                // let geometry = new THREE.BufferGeometry();
                pointGeometry.addAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
                pointGeometry.addAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));
                // points.geometry = geometry;

                // var ps=points.geometry.attributes.position.array;
                // pointGeometry.attributes.position.needsUpdate = true;
                // pointGeometry.attributes.color.needsUpdate = true;

                render();
            })()
        }

    }

    function createPoints() {
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        // geometry.addAttribute('scale', new THREE.Float32BufferAttribute(scales, 1));
        geometry.computeBoundingSphere();

        return geometry;
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

