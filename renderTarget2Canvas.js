start();
function start() {
    var camera, scene, renderer, container, rtscene, rendertarget;
    var RT_SIZE = 300;
    var ctx, buffer, clamped;
    var box, torus;
    var preview;

    init();
    animate();

    function init() {
        preview = document.createElement('canvas');
        preview.style.width = '150px';
        preview.style.height = '150px';
        preview.style.position='absolute';
        // preview.style.left = '0px';
        // preview.style.top = '0px';
        document.body.appendChild(preview)

        container = document.createElement('div');
        document.body.appendChild(container);
        // container.appendChild(preview);

        rendertarget = new THREE.WebGLRenderTarget(RT_SIZE, RT_SIZE);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.x = 2;
        camera.position.y = 2;
        camera.position.z = 2;
        camera.lookAt(0, 0, 0);

        //创建场景
        rtscene = new THREE.Scene();
        //向场景添加灯光
        let rtlight = new THREE.DirectionalLight(0xffffff, 1.5);
        rtlight.position.set(0, 1, 1).normalize();
        rtscene.add(rtlight);
        //向场景添加环面
        let geometryTorus = new THREE.TorusGeometry(10, 3, 16, 100);
        //使用红色材质
        let materialTorus = new THREE.LineBasicMaterial({ color: 0xff0000 });
        torus = new THREE.Mesh(geometryTorus, materialTorus);
        torus.scale.set(0.05, 0.05, 0.05);
        rtscene.add(torus);

        scene = new THREE.Scene();
        let ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        let light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(0, 1, 1).normalize();
        scene.add(light);
        //向场景添加立方体
        let geometryBox = new THREE.BoxBufferGeometry(1, 1, 1);
        let materialBox = new THREE.MeshStandardMaterial({
            color: 0xff9300,
            map: rendertarget.texture//使用rtscene作为贴图
        });
        box = new THREE.Mesh(geometryBox, materialBox);
        scene.add(box);

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setClearColor(0xffffff, 1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        ctx = preview.getContext('2d');
        buffer = new Uint8Array(4 * RT_SIZE * RT_SIZE);
        clamped = new Uint8ClampedArray(buffer.buffer);

        // renderer.render(rtscene, camera, rendertarget);
        // renderer.render(scene, camera);
    }

    function animate() {
        renderer.clear();
        box.rotation.y += 0.01;
        torus.rotation.y += 0.01;

        renderer.render(rtscene, camera, rendertarget);
        renderer.render(scene, camera);

        renderer.readRenderTargetPixels(rendertarget, 0, 0, RT_SIZE, RT_SIZE, buffer);
        let imageData = new ImageData(clamped, RT_SIZE, RT_SIZE);
        ctx.putImageData(imageData, 0, 0);

        requestAnimationFrame(animate);
    }
}