// import './js/postprocessing/EffectComposer.js';
// import './js/postprocessing/ShaderPass.js';
// import './js/postprocessing/RenderPass.js';

// import './js/shaders/CopyShader.js';
// import './js/shaders/DotScreenShader.js';
// import './js/shaders/RGBShiftShader.js';

start();
function start() {
    var camera, scene, renderer, composer, container;
    var object, light;
    var effect;

    var colortarget, posttarget;

    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 400;

        scene = new THREE.Scene();
        object = new THREE.Object3D();
        scene.add(object);

        var geometry = new THREE.SphereBufferGeometry(1, 4, 4);

        for (let i = 0; i < 100; i++) {

            var material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), flatShading: true });

            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            mesh.position.multiplyScalar(Math.random() * 400);
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
            object.add(mesh);
        }

        scene.add(new THREE.AmbientLight(0x222222));

        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        scene.add(light);

        let offscreenOpt = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false,
            // depthBuffer:true
        }

        let depthTexture = new THREE.DepthTexture();
        depthTexture.type = THREE.UnsignedShortType;

        colortarget = new THREE.WebGLRenderTarget(container.clientWidth, container.clientHeight, offscreenOpt);
        colortarget.depthTexture = depthTexture;
        colortarget.texture.generateMipmaps = false;

        posttarget = new THREE.WebGLRenderTarget(container.clientWidth, container.clientHeight, offscreenOpt);
        posttarget.texture.generateMipmaps = false;

        effect = new THREE.ShaderPass(THREE.DotScreenShader);

        // composer = new THREE.EffectComposer(renderer);
        // composer.addPass(new THREE.RenderPass(scene, camera));
        // effect.renderToScreen = true;
        // composer.addPass(effect);

        window.addEventListener('resize', onWindowResize, false);

        initGUI();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        // composer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        object.rotation.x += 0.005;
        object.rotation.y += 0.01;

        // composer.render();
        // renderer.render(scene,camera);

        // effect.render(renderer, posttarget, colortarget);
    }

    function render(){
        
    }


    function initGUI() {
        var param = {

            greyscale: effect.uniforms.greyscale.value,
        };

        let gui = new dat.GUI();
        // let folder = gui.addFolder('test');
        gui.add(param, 'greyscale').onChange(function () {
            effect.uniforms.greyscale.value = param.greyscale;
        });
        // folder.open();
    }
}