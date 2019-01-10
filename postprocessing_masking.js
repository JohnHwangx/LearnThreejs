start();
function start() {
    var composer,renderer;
    var box;

    init();
    animate();

    function init() {
        var camera=new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,100);
        camera.position.z=10;

        var scene=new THREE.Scene();

        box=new THREE.Mesh(new THREE.BoxBufferGeometry(4,4,4));
        scene.add(box);

        renderer=new THREE.WebGLRenderer();
        renderer.setClearColor(0xe0e0e0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth,window.innerHeight);
        renderer.autoClear=false;
        document.body.appendChild(renderer.domElement);

        var clearPass=new THREE.ClearPass();
        var clearMaskPass=new THREE.ClearMaskPass();
        var maskPass=new THREE.MaskPass(scene,camera);

        var texture=new THREE.TextureLoader().load('textures/758px-Canestra_di_frutta_(Caravaggio).jpg');
        var texturePass=new THREE.TexturePass(texture);

        var outputPass=new THREE.ShaderPass(THREE.CopyShader);
        outputPass.renderToScreen=true;

        var parameters={
            minFilter:THREE.LinearFilter,
            magFilter:THREE.LinearFilter,
            format:THREE.RGBFormat,
            stencilBuffer:true
        }

        var renderTarget =new THREE.WebGLRenderTarget(window.innerWidth,window.innerHeight,parameters);

        composer=new THREE.EffectComposer(renderer,renderTarget);
        composer.addPass(clearPass);
        composer.addPass(maskPass);
        composer.addPass(texturePass);
        composer.addPass(clearMaskPass);
        composer.addPass(outputPass);
    }

    function animate() {
        requestAnimationFrame(animate);
        var time=performance.now()*0.001;

        box.position.x=Math.cos(time/1.5)*2;
        box.position.y=Math.sin(time)*2;
        box.rotation.x=time;
        box.rotation.y=time/2;

        renderer.clear();
        composer.render(time);
    }
}