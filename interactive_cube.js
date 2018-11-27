var container,stats;
var camera, scene, raycaster, renderer;

var mouse=new THREE.Vector2(), INTERSCTED;
var radius=100,theta=0;

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    var info=document.createElement('div');
    info.style.position= 'absolute';
    info.style.top='10px';
    info.style.width='100%';
    info.style.textAlign='center';
    info.innerHTML='<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - interactive cubes';
    container.appendChild(info);

    camera=new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight,1,1000);
    
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0xf0f0f0);

    var light=new THREE.DirectionalLight(0xffffff,1);
    light.position.set(1,1,1).normalize();
    scene.add(light);

    var geometry=new THREE.BoxBufferGeometry(20,20,20);

    for (let i = 0; i < 2000; i++) {
        var object=new THREE.Mesh(geometry,new THREE.MeshLambertMaterial)
        
    }
}