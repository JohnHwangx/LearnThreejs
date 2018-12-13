var camera, scene, renderer, mesh;
var container;

var targetIndex;//当前相机观察的物体的编号
var originIndex;//相机起始点物体的索引
var meshCount = 4;//模型数量

var positionDistance;//相机起点和终点的距离

var originDirection = new THREE.Vector3();//相机移动的方向，到达目标点后作为原始方向
var targetDirection = new THREE.Vector3();//在相机旋转时使用，旋转的目标向量

var positions = new Array();
var speed = 5;
var rotateAngle = 0;
var rotateSpeed = Math.PI / 152;
var totalAngle;

var isMove = false;
var isRotate = false;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    //camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);
    scene.add(new THREE.AmbientLight(0x444444));
    scene.add(camera);

    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    let colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];

    let distance = 500;
    let meshPositions = [[distance, 0, distance], [-distance, 0, distance], [-distance, 0, -distance], [distance, 0, -distance]];
    meshPositions=[[0,40,0],[-400,-40,200],[-400,40,-400],[0,-40,600],[400,40,-400],[400,-40,200]];
    for (let i = 0; i < meshCount; i++) {

        var material = new THREE.MeshLambertMaterial({ color: colors[i] });
        var object = new THREE.Mesh(geometry, material);

        object.position.x = meshPositions[i][0];
        object.position.y = meshPositions[i][1];
        object.position.z = meshPositions[i][2];

        positions.push(object.position);

        scene.add(object);
    }


    let planematerial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa, specular: 0xffffff, shin: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    });
    let planeGeometry = createPlane();
    let planeMesh = new THREE.Mesh(planeGeometry, planematerial);
    scene.add(planeMesh);

    initGUI();

    targetIndex = 1;
    originIndex = 0;
    isMove = true;
    isRotate = false;
    originDirection.subVectors(positions[targetIndex], positions[originIndex]);
    positionDistance = positions[targetIndex].distanceTo(positions[originIndex]);

    camera.position.set(positions[0].x, positions[0].y, positions[0].z);//设置相机初始位置在第一个cube处
    camera.lookAt(positions[1]);

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    requestAnimationFrame(animate);

    render();
}

function initGUI() {
    var params = {
        MoveSpeed: 1,
        RotateSpeed: 2
    }

    var gui = new dat.GUI();
    var floder = gui.addFolder("Speed Manager");
    floder.add(params, 'MoveSpeed', 1, 10).step(1).onChange(function (value) {
        speed = value;
        render();
    });

    floder.add(params, 'RotateSpeed', 2, 300).step(2).onChange(function (value) {
        rotateSpeed = Math.PI / value;
        render();
    });

    floder.open();
}

function render() {

    let targetPosition = positions[targetIndex].clone();
    //判断相机是否移动到Mesh处
    targetPosition.sub(camera.position);
    let distance = targetPosition.length();

    //计算目标点的索引
    if (distance == 0 || isRotate) {
        // isRotate = true;
        // isMove = false;

        if (!isRotate) {

            originDirection = new THREE.Vector3();
            originDirection.subVectors(positions[targetIndex], positions[originIndex]);
            // originDistance = originDirection.length();

            //计算目标点的索引
            if (targetIndex == meshCount - 1) {
                targetIndex = 0;
            } else {
                targetIndex++;
            }
            //计算起始点的索引
            originIndex = targetIndex - 1;
            if (targetIndex == 0) {
                originIndex = meshCount - 1;
            }

            isRotate = true;
            isMove = false;

            targetDirection.subVectors(positions[targetIndex], positions[originIndex]);

            totalAngle = originDirection.angleTo(targetDirection);
            positionDistance = positions[targetIndex].distanceTo(positions[originIndex]);
        }

        rotateAngle += rotateSpeed;

        if (totalAngle <= rotateAngle) {
            rotateAngle = totalAngle;
        }

        //let tempDirection = originDirection.clone();
        //设置相机旋转
        let lookArDirection = new THREE.Vector3();
        lookArDirection.x = originDirection.x * Math.cos(rotateAngle) - originDirection.z * Math.sin(rotateAngle);
        lookArDirection.y = 0;
        lookArDirection.z = originDirection.x * Math.sin(rotateAngle) + originDirection.z * Math.cos(rotateAngle);

        lookArDirection.add(camera.position);
        camera.lookAt(lookArDirection);

        //如果旋转到目标方向，就开始移动
        if (lookArDirection.distanceTo(positions[targetIndex]) <= 0.00001) {
            isRotate = false;
            isMove = true;
            rotateAngle = 0;
        }

    }

    //相机移动
    if (isMove) {

        let direction = new THREE.Vector3();

        direction.subVectors(positions[targetIndex], positions[originIndex]);
        direction.normalize();
        var moveDistance = direction.multiplyScalar(speed);//相机移动距离
        let position = moveDistance.add(camera.position);//相机的移动位置

        let currentDistance = position.distanceTo(positions[originIndex]);//相机实际移动距离
        if (currentDistance >= positionDistance) {
            camera.position.set(positions[targetIndex].x, positions[targetIndex].y, positions[targetIndex].z);
        }
        else {
            camera.position.set(position.x, position.y, position.z);
        }

        if (positions[targetIndex].distanceTo(camera.position) == 0) {//到达目标点，相机与目标点位置重合
            let tempPosition = positions[targetIndex].clone();//需要将目标点沿移动方向移动，否则相机会自动转向下一个目标点
            let lookAtPosition = tempPosition.add(originDirection);
            camera.lookAt(lookAtPosition)
        }
        else {
            camera.lookAt(positions[targetIndex]);
        }
    }

    renderer.render(scene, camera);
}

function createPlane() {
    let planeGeometry = new THREE.BufferGeometry();
    let positions = [];
    positions.push(500, -10, 500);
    positions.push(-500, -10, 500);
    positions.push(-500, -10, -500);
    positions.push(-500, -10, -500);
    positions.push(500, -10, 500);
    positions.push(500, -10, -500);


    var color = new THREE.Color();
    color.setRGB(0.2, 0.8, 0.6);
    let colors = [];
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);

    planeGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    planeGeometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return planeGeometry;
}