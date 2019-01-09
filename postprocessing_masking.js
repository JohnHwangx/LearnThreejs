start();
function start() {
    var composer,renderer;
    var box,torus;

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

        
    }
}