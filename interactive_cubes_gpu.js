start();
function start() {
    var container, camera, controls, scene, renderer;
    var pickingData = [], pickingTexture, pickingScene;
    var highlightBox;

    var mouse = new THREE.Vector2();
    var offset = new THREE.Vector3(1, 1, 1);

    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        controls = new THREE.TrackballControls(camera);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        pickingScene = new THREE.Scene();
        pickingTexture = new THREE.WebGLRenderTarget(1, 1);

        scene.add(new THREE.AmbientLight(0x555555));

        var light = new THREE.SpotLight(0xffffff, 1.5);
        light.position.set(0, 500, 2000);
        scene.add(light);

        var pickingMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
        var defaultMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, shininess: 0 });

        function applyVertexColors(geometry, color) {
            var position = geometry.attributes.position;
            var colors = [];

            for (let i = 0, len = position.count; i < len; i++) {
                colors.push(color.r, color.g, color.b);
            }
            geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        }

        let geometriesDrawn = [];
        let geometriesPicking = [];

        let matrix = new THREE.Matrix4();
        let quaternion = new THREE.Quaternion();
        let color = new THREE.Color();

        for (let i = 0; i < 5000; i++) {
            let geometry = new THREE.BoxBufferGeometry();

            let position = new THREE.Vector3();
            position.x = Math.random() * 10000 - 5000;
            position.y = Math.random() * 10000 - 5000;
            position.z = Math.random() * 10000 - 5000;

            let rotation = new THREE.Euler();
            rotation.x = Math.random() * 2 * Math.PI;
            rotation.y = Math.random() * 2 * Math.PI;
            rotation.z = Math.random() * 2 * Math.PI;

            let scale = new THREE.Vector3();
            scale.x = Math.random() * 200 + 100;
            scale.y = Math.random() * 200 + 100;
            scale.z = Math.random() * 200 + 100;

            quaternion.setFromEuler(rotation, false);
            matrix.compose(position, quaternion, scale);

            geometry.applyMatrix(matrix);

            applyVertexColors(geometry, color.setHex(Math.random() * 0xffffff));
            geometriesDrawn.push(geometry);

            geometry = geometry.clone();

            applyVertexColors(geometry, color.setHex(i));

            geometriesPicking.push(geometry);

            pickingData[i] = {
                position: position,
                rotation: rotation,
                scale: scale
            };
        }

        let objects = new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn), defaultMaterial);
        scene.add(objects);

        pickingScene.add(new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesPicking), pickingMaterial));

        highlightBox = new THREE.Mesh(
            new THREE.BoxBufferGeometry(),
            new THREE.MeshLambertMaterial({ color: 0xffff00 })
        );
        scene.add(highlightBox);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        renderer.domElement.addEventListener('mousemove', onMouseMove);
    }

    function onMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    function animate() {
        requestAnimationFrame(animate);

        render();

    }

    function pick() {
        camera.setViewOffset(renderer.domElement.width, renderer.domElement.height, mouse.x * window.devicePixelRatio | 0, mouse.y * window.devicePixelRatio | 0, 1, 1);
        renderer.render(pickingScene, camera, pickingTexture);

        camera.clearViewOffset();

        let pixelBuffer = new Uint8Array(4);

        renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, pixelBuffer);

        let id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
        let data = pickingData[id];

        if (data) {
            if (data.position && data.rotation && data.scale) {
                highlightBox.position.copy(data.position);
                highlightBox.rotation.copy(data.rotation);
                highlightBox.scale.copy(data.scale).add(offset);
                highlightBox.visible = true;
            }
        } else {
            highlightBox.visible = false;
        }
    }

    function render() {
        controls.update();
        pick();
        renderer.render(scene, camera);
    }
}