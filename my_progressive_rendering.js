start();
function start() {

    var camera, scene, renderer;
    var container, stats;
    var controls;

    var geometries = new Array();
    var materials = new Array();

    var meshs = new Array();//存放所有的mesh

    var tag;//当前要渲染的mesh的标记，0代表渲染0-99号mesh

    var renderCount = 100;//每帧渲染100个mesh

    var group;

    init();
    animate();

    function init() {

        container = document.createElement('div');
        document.body.appendChild(container);

        renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClearColor = false;
        renderer.autoClearDepth = false;
        container.appendChild(renderer.domElement);

        tag = 0;

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 2000;

        controls = new THREE.OrbitControls(camera, container);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcccccc);

        createMesh(1000);//初始1000个mesh
        //scene.add(group);

        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);

        let ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);

        group = new THREE.Group();
        scene.add(group);

        initGUI();

        stats = new Stats();
        container.appendChild(stats.dom);

        controls.addEventListener('change', onControlsChanged, false);

        window.addEventListener('resize', onWindowResize, false);

        // renderer.clear();
    }

    //创建500个形状、大小和方向不同的geometry
    function createGeometry() {
        for (let i = 0; i < 100; i++) {
            let width = Math.random() * 20 + 10;
            let sphere = new THREE.SphereBufferGeometry(width, 20, 10);
            let box = new THREE.BoxBufferGeometry(width, width, width);
            let cylinder = new THREE.CylinderBufferGeometry(width, width, 2 * width, 20);
            let cone = new THREE.CylinderBufferGeometry(0, width, 2 * width, 20);
            let tetrahedron = new THREE.CylinderBufferGeometry(0, width, width, 3);

            geometries.push(sphere);
            geometries.push(box);
            geometries.push(cylinder);
            geometries.push(cone);
            geometries.push(tetrahedron);

            let material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() });
            materials.push(material);
        }
    }

    function createMesh(meshCount) {
        createGeometry();

        let typeCount = meshCount / (geometries.length);//5000个mesh
        // let group = new THREE.Group();
        for (let i = 0; i < materials.length; i++) {
            for (let j = 0; j < typeCount; j++) {
                for (let k = 0; k < 5; k++) {

                    let mesh = new THREE.Mesh(geometries[i + k], materials[i]);
                    mesh.position.x = Math.random() * 4000 - 2000;//-2000 ~ +2000
                    mesh.position.y = Math.random() * 4000 - 2000;//-2000 ~ +2000
                    mesh.position.z = Math.random() * 4000 - 2000;//-2000 ~ +2000

                    mesh.rotation.x = Math.random() * 2 * Math.PI;
                    mesh.rotation.y = Math.random() * 2 * Math.PI;

                    meshs.push(mesh);

                    // group.add(mesh);
                }
            }
        }

        // return group;
    }

    function initGUI() {
        var params = {
            FragmentRate: 30,
            MeshCount: 1000,
        };

        var gui = new dat.GUI();
        var folder = gui.addFolder('Adjuster');
        folder.add(params, 'FragmentRate', 20, 60).step(10).onChange(function (value) {

        });
        folder.add(params, 'MeshCount', 1000, 50000).step(500).onChange(function (value) {

            let changeMeshsCount = value - meshs.length;//需要增加或减少的mesh数量
            if (changeMeshsCount > 0) {//增加mesh
                // if (value == 4000) {
                createMesh(changeMeshsCount);
                // }
            } else if (changeMeshsCount < 0) {//减少mesh
                meshs.splice(value);
                renderer.clear();
                tag = 0;
            }
            render();
        });
        folder.open();
    }

    function onControlsChanged() {
        tag = 0;
        //scene.children.splice(2);//??如何判断scene中的节点为group
        //group.length=0
        renderer.clear();
        //group=new THREE.Group();

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        //controls.handleResize();

        render();
    }

    function animate() {

        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000 / 90);

        controls.update();

        render();

        stats.update();
    }

    function render() {

        if (tag != meshs.length) {
            let renderMeshs = meshs.slice(tag, tag + renderCount);
            // let tempGroup = new THREE.Group();

            group.children.length = 0
            renderMeshs.forEach(element => {

                group.add(element);
            });
            tag += renderCount;
        }
        renderer.render(scene, camera);
    }
}