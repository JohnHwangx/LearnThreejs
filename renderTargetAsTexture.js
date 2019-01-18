start();
function start() {
    var camera, scene,renderer, container,box,rtscene,rendertarget;

    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        rendertarget = new THREE.WebGLRenderTarget(300, 300);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.x = 2;
        camera.position.y = 2;
        camera.position.z = 2;
        camera.lookAt(0, 0, 0);

        //创建场景
        rtscene = new THREE.Scene();
        //向场景添加灯光
        let rtlight = new THREE.DirectionalLight(0xfffff, 1.5);
        rtlight.position.set(0,1,1).normalize();
        rtscene.add(rtlight);
        //向场景添加环面
        let geometryTorus=new THREE.TorusGeometry(10,2,16,100);
        //使用红色材质
        let materialTorus=new THREE.LineBasicMaterial({color:0xff0000});
        let torus=new THREE.Mesh(geometryTorus,materialTorus);
        torus.scale.set(0.05,0.05,0.05);
        rtscene.add(torus);

        scene=new THREE.Scene();
        let ambientLight=new THREE.AmbientLight(0xffffff,1.5);
        scene.add(ambientLight);

        let light =new THREE.DirectionalLight(0xffffff,1.5);
        light.position.set(0,1,1).normalize();
        scene.add(light);
        //向场景添加立方体
        let geometryBox=new THREE.BoxBufferGeometry(1,1,1);
        let materialBox=new THREE.MeshStandardMaterial({
            color:0xff9300,
            map:rendertarget.texture//使用rtscene作为贴图
        });
        box=new THREE.Mesh(geometryBox,materialBox);
        scene.add(box);

        renderer=new THREE.WebGLRenderer({
            antialias:true
        });
        renderer.setClearColor(0xffffff,1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth,window.innerHeight);
        container.appendChild(renderer.domElement);

        renderer.render(rtscene,camera,rendertarget);
        renderer.render(scene,camera);
    }

    function animate() {
        renderer.clear();
        box.rotation.y+=0.01;

        renderer.render(rtscene,camera,rendertarget);
        renderer.render(scene,camera);

        requestAnimationFrame(animate);
    }
}