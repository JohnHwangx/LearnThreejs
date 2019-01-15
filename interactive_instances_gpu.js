start();

function start() {

    var vertMaterial = ["#define SHADER_NAME vertMaterial",

        "precision highp float;",

        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",

        "attribute vec3 position;",

        "#ifndef PICKING",
        "    varying vec3 vPosition;",
        "#endif",

        "void main() {",

        "vec3 positionEye = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;",

        "#ifndef PICKING",
        "    vPosition = positionEye;",
        "#endif",

        "gl_Position = projectionMatrix * vec4( positionEye, 1.0 );",

        "}"].join("\n");

    var fragMaterial = ["#define SHADER_NAME fragMaterial",

        "#extension GL_OES_standard_derivatives : enable",

        "precision highp float;",

        "#ifdef PICKING",
        "    uniform vec3 pickingColor;",
        "#else",
        "    uniform vec3 color;",
        "    varying vec3 vPosition;",
        "#endif",

        "void main()	{",

        "    #ifdef PICKING",
        "        gl_FragColor = vec4( pickingColor, 1.0 );",
        "    #else",
        "        vec3 fdx = dFdx( vPosition );",
        "        vec3 fdy = dFdy( vPosition );",
        "        vec3 normal = normalize( cross( fdx, fdy ) );",
        "        float diffuse = dot( normal, vec3( 0.0, 0.0, 1.0 ) );",

        "        gl_FragColor = vec4( diffuse * color, 1.0 );",
        "    #endif",

        "}"].join("\n");

    var container, stats;
    var camera, controls, scene, renderer;
    var pickingData, pickingRenderTarget, pickingScene;
    var useOverrideMaterial = true;
    var singleMaterial, singlePickingMaterial;
    var highlightBox;
    var materialList = [];
    var geometryList = [];
    var objectCount = 0;
    var geometrySize = new THREE.Vector3();
    var mouse = new THREE.Vector2();
    var scale = 1.03;

    var loader = new THREE.BufferGeometryLoader();

    var pixelBuffer = new Uint8Array(4);

    var instanceCount, method, doAnimate;

    gui();
    init();
    initMesh();
    animate();

    function gui() {

        var instanceCountElem = 1000;//模型数量
        instanceCount = parseInt(instanceCountElem);

        doAnimate = true;
        useOverrideMaterial = true;

    }

    function clean() {
        THREE.Cache.clear();

        materialList.forEach(function (m) {
            m.dispose();
        });

        geometryList.forEach(function (g) {
            g.dispose();
        });

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        scene.add(camera);
        scene.add(highlightBox);

        pickingScene = new THREE.Scene();
        pickingData = {};
        materialList = [];
        geometryList = [];
        objectCount = 0;

        singleMaterial = undefined;
        singlePickingMaterial = undefined;
    }

    function initMesh() {
        clean();

        var geo = new THREE.SphereBufferGeometry(1, 4, 4);
        makeSingleMaterial(geo);

        render();

    }

    function makeSingleMaterial(geo) {

        // material

        var vert = vertMaterial;
        var frag = fragMaterial;

        var material = new THREE.RawShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
                color: {
                    value: new THREE.Color()
                }
            }
        });
        materialList.push(material);

        var pickingMaterial = new THREE.RawShaderMaterial({
            vertexShader: "#define PICKING\n" + vert,
            fragmentShader: "#define PICKING\n" + frag,
            uniforms: {
                pickingColor: {
                    value: new THREE.Color()
                }
            }
        });
        materialList.push(pickingMaterial);

        if (useOverrideMaterial) {

            // make globally available
            singleMaterial = material;
            singlePickingMaterial = pickingMaterial;

        }

        // geometry / mesh

        var matrix = new THREE.Matrix4();

        function onBeforeRender(renderer, scene, camera, geometry, material) {

            var updateList = [];
            var u = material.uniforms;
            var d = this.userData;

            if (u.pickingColor) {

                u.pickingColor.value.setHex(d.pickingColor);
                updateList.push("pickingColor");

            }

            if (u.color) {

                u.color.value.setHex(d.color);
                updateList.push("color");

            }

            if (updateList.length) {

                var materialProperties = renderer.properties.get(material);

                if (materialProperties.program) {

                    var gl = renderer.getContext();
                    var p = materialProperties.program;
                    gl.useProgram(p.program);
                    var pu = p.getUniforms();

                    updateList.forEach(function (name) {

                        pu.setValue(gl, name, u[name].value);

                    });

                }

            }

        }

        var randomizeMatrix = function () {

            var position = new THREE.Vector3();
            var rotation = new THREE.Euler();
            var quaternion = new THREE.Quaternion();
            var scale = new THREE.Vector3();

            return function (matrix) {

                position.x = Math.random() * 40 - 20;
                position.y = Math.random() * 40 - 20;
                position.z = Math.random() * 40 - 20;

                rotation.x = Math.random() * 2 * Math.PI;
                rotation.y = Math.random() * 2 * Math.PI;
                rotation.z = Math.random() * 2 * Math.PI;

                quaternion.setFromEuler(rotation, false);

                scale.x = scale.y = scale.z = Math.random() * 1;

                matrix.compose(position, quaternion, scale);

            };

        }();

        for (var i = 0; i < instanceCount; i++) {

            var object = new THREE.Mesh(geo, material);
            objectCount++;
            randomizeMatrix(matrix);
            object.applyMatrix(matrix);

            var pickingObject;
            if (!useOverrideMaterial) {

                pickingObject = object.clone();
                objectCount++;

            }

            object.material = material;
            object.userData["color"] = Math.random() * 0xffffff;

            if (useOverrideMaterial) {

                object.userData["pickingColor"] = i + 1;
                object.onBeforeRender = onBeforeRender;

            } else {

                pickingObject.material = pickingMaterial;
                pickingObject.userData["pickingColor"] = i + 1;
                pickingObject.onBeforeRender = onBeforeRender;

            }

            pickingData[i + 1] = object;

            scene.add(object);
            if (!useOverrideMaterial) pickingScene.add(pickingObject);

        }

    }

    function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.z = 40;

        pickingRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        pickingRenderTarget.texture.generateMipmaps = false;
        pickingRenderTarget.texture.minFilter = THREE.NearestFilter;

        highlightBox = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1, 1, 1),
            new THREE.MeshLambertMaterial({
                emissive: 0xffff00,
                transparent: true,
                opacity: 0.5
            })
        );
        container = document.createElement('div');
        document.body.appendChild(container);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        if (renderer.extensions.get("ANGLE_instanced_arrays") === null) {
            document.getElementById("notSupported").style.display = "";
            return;
        }
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        if (renderer.extensions.get("ANGLE_instanced_arrays") === null) {
            throw "ANGLE_instanced_arrays not supported";
        }

        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.staticMoving = true;

        renderer.domElement.addEventListener("mousemove", onMouseMove);
        window.addEventListener("resize", onWindowResize, false);
    }

    function onMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        controls.update();
        requestAnimationFrame(render);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        pickingRenderTarget.setSize(window.innerWidth, window.innerHeight);
    }

    function pick() {
        highlightBox.visible = false;

        if (singlePickingMaterial) {
            scene.overrideMaterial = singlePickingMaterial;
            renderer.render(scene, camera, pickingRenderTarget);
            scene.overrideMaterial = null;
        } else {
            renderer.render(pickingScene, camera, pickingRenderTarget);
        }

        renderer.readRenderTargetPixels(
            pickingRenderTarget,
            mouse.x,
            pickingRenderTarget.height - mouse.y,
            1,
            1,
            pixelBuffer
        );

        var id =
            (pixelBuffer[0] << 16) |
            (pixelBuffer[1] << 8) |
            (pixelBuffer[2]);

        let object = pickingData[id];

        if (object) {
            if (object.position && object.rotation && object.scale) {
                highlightBox.position.copy(object.position);
                highlightBox.position.copy(object.rotation);

                highlightBox.scale.copy(object.scale).multiply(geometrySize).multiplyScalar(scale);

                highlightBox.visible = true;
            }
        } else {
            highlightBox.visible = false;
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        render();

    }

    function render() {
        pick();
        renderer.render(scene, camera);
    }
}