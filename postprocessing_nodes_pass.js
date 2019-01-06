//change on branch
import './js/nodes/THREE.Nodes.js';
import { NodePass } from './js/nodes/postprocessing/NodePass.js';
// import './js/loaders/NodeMaterialLoader.js';

start();
function start() {
    var camera, scene, renderer, composer;
    var object, light, nodepass;
    var gui;

    var clock = new THREE.Clock();
    var frame = new THREE.NodeFrame();

    var param = { example: 'color_adjustment' };

    init();
    animate();

    function init() {

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 400;

        scene = new THREE.Scene();

        object = new THREE.Object3D();
        scene.add(object);

        var geometry = new THREE.SphereBufferGeometry(1, 4, 4);

        for (var i = 0; i < 100; i++) {

            var material = new THREE.MeshPhongMaterial({ color: 0x888888 + (Math.random() * 0x888888), flatShading: true });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            mesh.position.multiplyScalar(Math.random() * 400);
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = 10 + (Math.random() * 40);
            object.add(mesh);

        }

        scene.add(new THREE.AmbientLight(0x999999));

        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        scene.add(light);

        // postprocessing

        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));

        nodepass = new NodePass();
        nodepass.renderToScreen = true;

        composer.addPass(nodepass);

        updateMaterial();

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {

        requestAnimationFrame(animate);

        var delta = clock.getDelta();

        object.rotation.x += 0.005;
        object.rotation.y += 0.01;

        frame.update(delta).updateNode(nodepass.material);

        composer.render();

    }

    function updateMaterial() {

        gui = new dat.GUI();
        
        var screen = new THREE.ScreenNode();

        // var hue = new THREE.FloatNode();
        // var sataturation = new THREE.FloatNode(1);
        // var vibrance = new THREE.FloatNode();
        // var brightness = new THREE.FloatNode(0);
        var contrast = new THREE.FloatNode(1);

        // var hueNode = new THREE.ColorAdjustmentNode(screen, hue, THREE.ColorAdjustmentNode.HUE);
        // var satNode = new THREE.ColorAdjustmentNode(hueNode, sataturation, THREE.ColorAdjustmentNode.SATURATION);
        // var vibranceNode = new THREE.ColorAdjustmentNode(satNode, vibrance, THREE.ColorAdjustmentNode.VIBRANCE);
        // var brightnessNode = new THREE.ColorAdjustmentNode(vibranceNode, brightness, THREE.ColorAdjustmentNode.BRIGHTNESS);
        // var contrastNode = new THREE.ColorAdjustmentNode(brightnessNode, contrast, THREE.ColorAdjustmentNode.CONTRAST);
        var contrastNode = new THREE.ColorAdjustmentNode(screen, contrast, THREE.ColorAdjustmentNode.CONTRAST);

        nodepass.input = contrastNode;

        // GUI

        // addGui('hue', hue.value, function (val) {

        //     hue.value = val;

        // }, false, 0, Math.PI * 2);

        // addGui('saturation', sataturation.value, function (val) {

        //     sataturation.value = val;

        // }, false, 0, 2);

        // addGui('vibrance', vibrance.value, function (val) {

        //     vibrance.value = val;

        // }, false, - 1, 1);

        // addGui('brightness', brightness.value, function (val) {

        //     brightness.value = val;

        // }, false, 0, .5);

        addGui('contrast', contrast.value, function (val) {

            contrast.value = val;

        }, false, 0, 2);
    }

    function addGui( name, value, callback, isColor, min, max ) {

        var node;

        param[ name ] = value;

        if ( isColor ) {

            node = gui.addColor( param, name ).onChange( function () {

                callback( param[ name ] );

            } );

        } else if ( typeof value == 'object' ) {

            param[ name ] = value[ Object.keys( value )[ 0 ] ];

            node = gui.add( param, name, value ).onChange( function () {

                callback( param[ name ] );

            } );

        } else {

            node = gui.add( param, name, min, max ).onChange( function () {

                callback( param[ name ] );

            } );

        }

        return node;

    }
}