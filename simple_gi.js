start();
function start() {
    THREE.Mesh.prototype.clone = function () {
        let newMaterial = (this.material.isMaterial) ? this.material.clone() : this.material.slice();
        return new this.constructor(this.geometry.clone(), newMaterial).copy(this);
    };

    var SimpleGI = function (renderer, scene) {
        let SIZE = 1, SIZE2 = SIZE * SIZE;
        let camera = new THREE.PerspectiveCamera();
        scene.updateMatrixWorld(true);

        let clone = scene.clone();
        clone.autoUpdate = false;

        // let rt = new THREE.WebGLRenderTarget(SIZE, SIZE, {
        //     wrapS: THREE.ClampToEdgeWrapping,
        //     wrapT: THREE.ClampToEdgeWrapping,
        //     stencilBuffer: false,
        //     depthBuffer: true
        // });
        let rt = new THREE.WebGLRenderTarget(SIZE, SIZE);
        let normalMatrix = new THREE.Matrix3();

        let position = new THREE.Vector3();
        let normal = new THREE.Vector3();

        // let bounces = 0;
        let currentVertex = 0;

        let color = new Float32Array(3);
        let buffer = new Uint8Array(SIZE2 * 4);

        // if (bounces === 3) return;

        let object = scene.children[0];
        let geometry = object.geometry;

        let attributes = geometry.attributes;
        let positions = attributes.position.array;
        let normals = attributes.normal.array;

        if (attributes.color === undefined) {
            let colors = new Float32Array(positions.length);
            geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));

        }

        let colors = attributes.color.array;
        let totalVertex = positions.length / 3;

        function compute() {

            let startVertex = currentVertex;

            // for (let i = 0; i < 1; i++) {
            // if (currentVertex >= totalVertex)
            //     break;

            position.fromArray(positions, currentVertex * 3);
            position.applyMatrix4(object.matrixWorld);

            normal.fromArray(normals, currentVertex * 3);
            normal.applyMatrix3(normalMatrix.getNormalMatrix(object.matrixWorld)).normalize();

            camera.position.copy(position);
            camera.lookAt(position.add(normal));

            renderer.render(clone, camera, rt);
            renderer.readRenderTargetPixels(rt, 0, 0, SIZE, SIZE, buffer);

            color[0] = 0;
            color[1] = 0;
            color[2] = 0;

            for (let k = 0, kl = buffer.length; k < kl; k += 4) {
                color[0] += buffer[k + 0];
                color[1] += buffer[k + 1];
                color[2] += buffer[k + 2];

            }
            colors[currentVertex * 3 + 0] = color[0] / (SIZE2 * 255);
            colors[currentVertex * 3 + 1] = color[1] / (SIZE2 * 255);
            colors[currentVertex * 3 + 2] = color[2] / (SIZE2 * 255);

            currentVertex++;
            // }

            attributes.color.updateRange.offset = startVertex * 3;
            attributes.color.updateRange.count = (currentVertex - startVertex) * 3;
            attributes.color.needsUpdate = true;

            if (currentVertex >= totalVertex) {
                // clone = scene.clone();
                // clone.autoUpdate = false;

                // bounces++;
                // currentVertex = 0;
                return;
            }

            requestAnimationFrame(compute);
        }
        requestAnimationFrame(compute);
    };

    var camera, scene, renderer;

    init();
    animate();

    function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 4;

        scene = new THREE.Scene();

        //创建圆环结
        // let geometry = new THREE.TorusKnotBufferGeometry(0.75, 0.3, 128, 32, 1);
        let geometry = new THREE.SphereBufferGeometry(1, 4, 2);
        let material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        //创建方块
        let materials = [];

        for (let i = 0; i < 6; i++) {
            materials.push(new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, side: THREE.BackSide }));
        }

        geometry = new THREE.BoxBufferGeometry(3, 3, 3);
        mesh = new THREE.Mesh(geometry, materials);
        scene.add(mesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        new SimpleGI(renderer, scene);

        let controls = new THREE.OrbitControls(camera);

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}