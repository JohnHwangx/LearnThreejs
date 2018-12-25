(function () {
    var camera, scene, renderer;

    var mesh, parent_node;

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

        let material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        let geometry = createLines();
        // mesh = new THREE.Line(geometry, material);
        mesh = new THREE.LineSegments(geometry, material);
        mesh.position.x -= 1200;
        // mesh.position.y -= 1200;

        parent_node = new THREE.Object3D();
        parent_node.add(mesh);

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
        let geometry = new THREE.BufferGeometry();

        let indices = [];
        let positions = [];
        let colors = [];

        let next_positions_index = 0;

        let iteration_count = 2;
        let rangle = 60 * Math.PI / 180.0;

        function snowflake(points, loop, x_offset) {
            for (let i = 0; i != iteration_count; i++) {
                add_vertex(points[0]);

                for (let p_index = 0; p_index != points.length - 1; p_index++) {
                    snowflake_iteration(points[p_index], points[p_index + 1], i)
                }

                if (loop) {
                    snowflake_iteration(points[points.length - 1], points[0], i);
                }

                for (let p_index = 0; p_index != points.length; p_index++) {
                    points[p_index].x += x_offset;
                }
            }
        }

        function snowflake_iteration(p0, p4, depth) {
            if (--depth < 0) {
                let i = next_positions_index - 1;
                add_vertex(p4);
                indices.push(i, i + 1);

                return;
            }

            let v = p4.clone().sub(p0);
            let v_tier = v.clone().multiplyScalar(1 / 3);
            let p1 = p0.clone().add(v_tier);

            let angle = Math.atan2(v.y, v.x) + rangle;
            let length = v_tier.length();
            let p2 = p1.clone();
            p2.x += Math.cos(angle) * length;
            p2.y += Math.sin(angle) * length;

            let p3 = p0.clone().add(v_tier).add(v_tier);

            snowflake_iteration(p0, p1, depth);
            snowflake_iteration(p1, p2, depth);
            snowflake_iteration(p2, p3, depth);
            snowflake_iteration(p3, p4, depth);
        }

        function add_vertex(v) {
            positions.push(v.x, v.y, v.z);
            colors.push(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);
            return next_positions_index++;
        }

        snowflake(
            [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(500, 0, 0)],
            false, 600 //每个物体间距600
        );

        geometry.setIndex(indices);
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        return geometry;
    }
})()