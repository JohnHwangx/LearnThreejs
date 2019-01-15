start();
function start() {
    var camera, scene, composer, renderer;
    var box;

    var readBuffer, writeBuffer;

    init();
    animate();

    function init() {
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.z = 10;

        scene = new THREE.Scene();

        box = new THREE.Mesh(new THREE.BoxBufferGeometry(4, 4, 4));
        scene.add(box);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xe0e0e0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;
        document.body.appendChild(renderer.domElement);

        var clearPass = new THREE.ClearPass();
        var clearMaskPass = new THREE.ClearMaskPass();
        var maskPass = new THREE.MaskPass(scene, camera);

        var texture = new THREE.TextureLoader().load('textures/758px-Canestra_di_frutta_(Caravaggio).jpg');
        var texturePass = new THREE.TexturePass(texture);

        // readBuffer = new THREE.WebGLRenderTarget(container.clientWidth, container.clientHeight, offscreenOpt);
        // // readBuffer.depthTexture = depthTexture;
        // readBuffer.texture.generateMipmaps = false;

        // writeBuffer = new THREE.WebGLRenderTarget(container.clientWidth, container.clientHeight, offscreenOpt);
        // writeBuffer.texture.generateMipmaps = false;

        var outputPass = new THREE.ShaderPass(THREE.CopyShader);
        outputPass.renderToScreen = true;

        var parameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: true
        }

        readBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);
        writeBuffer = readBuffer.clone();

        var renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);

        composer = new THREE.EffectComposer(renderer, renderTarget);
        composer.addPass(clearPass);
        composer.addPass(maskPass);
        composer.addPass(texturePass);
        composer.addPass(clearMaskPass);
        composer.addPass(outputPass);
    }

    function render() {
        //=====================clearpass=====================
        renderer.setRenderTarget(readBuffer);
        renderer.clear();

        //=====================maskPass=========================
        var context = renderer.context;
        var state = renderer.state;

        // don't update color or depth

        state.buffers.color.setMask(false);
        state.buffers.depth.setMask(false);

        // lock buffers

        state.buffers.color.setLocked(true);
        state.buffers.depth.setLocked(true);

        // set up stencil

        var writeValue, clearValue;
        writeValue = 1;
        clearValue = 0;

        state.buffers.stencil.setTest(true);
        state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
        state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
        state.buffers.stencil.setClear(clearValue);

        // draw into the stencil buffer

        renderer.render(scene, camera, readBuffer, true);
        renderer.render(scene, camera, writeBuffer, true);

        // unlock color and depth buffer for subsequent rendering

        state.buffers.color.setLocked(false);
        state.buffers.depth.setLocked(false);

        // only render where stencil is set to 1

        state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);  // draw if == 1
        state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);

        //maskActive=true;

        //==============texturePass====================
        texturePass.render(renderer, writeBuffer, readBuffer, undefined, true);

        //===============clearMaskPass==========
        renderer.state.buffers.stencil.setTest(false);

        //=============outputPass===============
        outputPass.render(renderer, writeBuffer, readBuffer);

        let temp = readBuffer;
        readBuffer = writeBuffer;
        writeBuffer = temp;
    }

    function animate() {
        requestAnimationFrame(animate);
        var time = performance.now() * 0.001;

        box.position.x = Math.cos(time / 1.5) * 2;
        box.position.y = Math.sin(time) * 2;
        box.rotation.x = time;
        box.rotation.y = time / 2;

        renderer.clear();
        composer.render(time);
    }
}