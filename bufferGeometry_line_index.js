(function () {
    var camera, mesh, scene, renderer;

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

    function snowflake(points, x_offset) {
        add_vertex(points[0]);

        for (let i = 0; i != points.length - 1; i++) {

        }

    }

    function snowflake_iteration(p0,p4,depth) {
        
    }

    function add_vertex(v) {
        positions.push(v.x, v.y, v.z);
        colors.push(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);
        return next_positions_index++;
    }

    function createLins() {
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

        var indices = [];
        var positions = [];
        var colors = [];

        var next_positions_index = 0;

        var iteration_count = 4;
        var rangle = 60 * Math.PI / 180.0;


    }
})()