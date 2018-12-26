// import { PerspectiveCamera } from "three";

(function () {
    var camera, mesh, scene, renderer;
    var controls;
    var lineNum = 10;

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
        scene.background = new THREE.Color(0x000000);
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

        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        let geometry = createLines();
        mesh = new THREE.LineSegments(geometry, material);
        scene.add(mesh);

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

    function createLines() {
        let diameter = 1000;
        let geometry = new THREE.BufferGeometry();
        let positions = [];
        let colors = [];
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

            let x1=(Math.random() - 0.5) * diameter
            let y1=(Math.random() - 0.5) * diameter
            let z1=(Math.random() - 0.5) * diameter

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
            // }
        }
        geometry.setIndex(indices);
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        return geometry;
    }
})()