start();
function start() {
    var container, tag, camera, controls, scene, renderer;
    var pickingData = [], pickingTexture, pickingScene;
    var highlightBox;

    var mouse = new THREE.Vector2();
    var offset = new THREE.Vector3(1, 1, 1);

    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        tag = document.createElement('div');
        tag.style.position = 'absolute';
        tag.style.width = '50px';
        tag.style.color = '#000000';
        container.appendChild(tag);

        camera = new THREE.PerspectiveCamera(70, window.innerHeight / window.innerHeight, 1, 1000);
        camera.position.z = 100;

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

        scene.add(new THREE.AmbientLight(0xffffff));

        let pickingMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
        let defaultMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, shininess: 0 });

        function applyVertexColor(geometry, color) {
            let position = geometry.attributes.position;
            let colors = [];

            for (let i = 0, len = position.count; i < len; i++) {
                colors.push(color.r, color.g, color.b);
            }
            geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }

        function applyVertexInfo(geometry, info) {
            let position = geometry.attributes.position;
            let infos = [];

            //info *= 0.1;
            for (let i = 0, len = position.count; i < len; i++) {
                // infos.push(info, info, info);
                infos.push(info.r, info.g, info.b);
            }
            geometry.addAttribute('color', new THREE.Float32BufferAttribute(infos, 3));
        }

        let geometriesDrawn = [];
        let geometriesPicking = [];

        let matrix = new THREE.Matrix4();
        let quaternion = new THREE.Quaternion();
        let color = new THREE.Color();

        for (let i = 0; i < 6; i++) {
            let geometry = new THREE.BoxBufferGeometry();

            let position = new THREE.Vector3();
            position.x = Math.random() * 100 - 50;
            position.y = Math.random() * 100 - 50;
            position.z = Math.random() * 100 - 50;

            let rotation = new THREE.Euler();
            rotation.x = Math.random() * 2 * Math.PI;
            rotation.y = Math.random() * 2 * Math.PI;
            rotation.z = Math.random() * 2 * Math.PI;

            let scale = new THREE.Vector3();
            scale.x = Math.random() * 20 + 10;
            scale.y = Math.random() * 20 + 10;
            scale.z = Math.random() * 20 + 10;

            quaternion.setFromEuler(rotation, false);
            matrix.compose(position, quaternion, scale);
            geometry.applyMatrix(matrix);

            applyVertexColor(geometry, color.setHex(Math.random() * 0xffffff));
            scene.add(geometry);
            geometriesDrawn.push(geometry);

            geometry = geometry.clone();

            // applyVertexInfo(geometry, i + 1);
            applyVertexInfo(geometry, color.setHex(i + 1));
            pickingScene.add(geometry);
            geometriesPicking.push(geometry);

            pickingData[i + 1] = {
                id: Math.floor((Math.random() * 10000) + 1),
                position: position,
                rotation: rotation,
                scale: scale
            };
        }

        // let objects = new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn), defaultMaterial);
        // scene.add(objects);

        // let pickingObjects = new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesPicking), pickingMaterial);
        // pickingScene.add(pickingObjects);

        highlightBox = new THREE.Mesh(
            new THREE.BoxBufferGeometry(),
            new THREE.MeshLambertMaterial({ color: 0xffff00 })
        );
        scene.add(highlightBox);

        highlightBox.visible = false;

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

        // let id = pixelBuffer[0] /255/ 0.1;
        let id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
        let maxId = (255 << 16) | (255 << 8) | (255)
        let data = pickingData[id];

        if (data) {
            if (data.position && data.rotation && data.scale) {

                highlightBox.position.copy(data.position);
                highlightBox.rotation.copy(data.rotation);
                highlightBox.scale.copy(data.scale).add(offset);
                highlightBox.visible = true;

                let pos = data.position;
                tag.innerHTML = data.id;
                tag.style.left = mouse.x + 'px';
                tag.style.top = mouse.y + 'px';
                tag.style.visibility = 'visible';

            }
        } else {
            highlightBox.visible = false;
            tag.style.visibility = 'hidden';
        }
    }

    function render() {
        controls.update();
        pick();
        renderer.render(scene, camera);
    }
}