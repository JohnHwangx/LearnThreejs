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

    init();
    animate();

    function init() {

        container = document.createElement('div');
        document.body.appendChild(container);

        tag = 0;

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 2000;

        controls = new THREE.TrackballControls(camera);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [65, 83, 68];

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcccccc);

        let group = createMesh();
        //scene.add(group);

        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);

        let ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        stats=new Stats();
        container.appendChild(stats.dom);

        controls.addEventListener('change', onControlsChanged, false);

        window.addEventListener('resize', onWindowResize, false);
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

    function createMesh() {
        createGeometry();
        let typeCount = 10;//5000个mesh
        let group = new THREE.Group();
        for (let i = 0; i < materials.length; i++) {
            for (let j = 0; j < typeCount; j++) {
                for (let k = 0; k < 5; k++) {

                    let mesh = new THREE.Mesh(geometries[i + k], materials[i]);
                    mesh.position.x = Math.random() * 2000 - 1000;//-1000 ~ +1000
                    mesh.position.y = Math.random() * 2000 - 1000;//-1000 ~ +1000
                    mesh.position.z = Math.random() * 2000 - 1000;//-1000 ~ +1000

                    mesh.rotation.x = Math.random() * 2 * Math.PI;
                    mesh.rotation.y = Math.random() * 2 * Math.PI;

                    meshs.push(mesh);

                    group.add(mesh);
                }
            }
        }

        return group;
    }

    function initGUI(){
        var param={
            FragmentRate:30,
            MeshCount:1000,
        };

        var gui=new dat.GUI();
        var folder=gui.addFolder('')
    }

    function onControlsChanged() {
        //if (tag === meshs.length) {
        tag = 0;

        scene.children.splice(2);
        //}
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.handleResize();

        render();
    }

    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        render();

        stats.update();
    }

    function render() {

        if (tag != meshs.length) {
            let renderMeshs = meshs.slice(tag, tag + 100);
            let group = new THREE.Group();
            renderMeshs.forEach(element => {

                group.add(element);
            });
            scene.add(group);
            tag += 100;
        }

        renderer.render(scene, camera);
    }
}