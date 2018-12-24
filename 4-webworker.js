// import { PerspectiveCamera } from "three";

(function () {
    var camera, mesh, scene, renderer;
    var controls;
    var lineNum = 1000;

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

        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        let geometry = createLines();
        mesh = new THREE.Line(geometry, material);
        scene.add(mesh);

        window.addEventListener('resize', onWindowResize, false);
    })();

    (function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();

    })();

    function render() {
        renderer.render(scene,camera);
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
        let indices=[];
        let pi2 = Math.PI * 2;

        for (let i = 0; i < lineNum; i++) {
            let r = (Math.random() - 0.5) * diameter;
            let alpha = Math.random() * pi2;
            let beta = Math.random() * pi2;
            let x = r * Math.sin(alpha) * Math.cos(beta);
            let y = r * Math.sin(alpha) * Math.sin(beta);
            let z = r * Math.cos(alpha);

            positions.push(x, y, z);

            // colors

            colors.push((x / r) + 0.5);
            colors.push((y / r) + 0.5);
            colors.push((z / r) + 0.5);

            indices.push(i,i+1);
        }
        geometry.setIndex( indices );
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        return geometry;
    }
})()