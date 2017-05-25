const PIXEL_SIZE = 1;
const NEURON_SIZE = 0.5;

let mouse = new THREE.Vector2();
let isDrawing = false;

function main() {
    let scene = new THREE.Scene();
    let raycaster = new THREE.Raycaster();

    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 30);
    camera.lookAt(scene.position);

    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // THREEx.WindowResize(renderer, camera);    // automatically resize renderer
    // THREEx.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});

    let light = new THREE.PointLight(0xffffff);
    light.position.set(100, 250, 100);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x111111));

    drawAsSquare(scene, drawPixel, 400, 0);
    drawAsSquare(scene, drawNeuron, 400, 0);
    drawAsSquare(scene, drawNeuron, 25, -10);
    drawAsLine(scene, drawNeuron, 10, -20);

    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    let update = () => {
        window.requestAnimationFrame(update);

        raycaster.setFromCamera(mouse, camera);

        if (isDrawing) {
            let intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) controls.enabled = false;
            for (let i = 0; i < intersects.length; i++) {
                intersects[i].object.material.color.set(0xff0000);
            }
        }

        renderer.render(scene, camera);
    };

    document.addEventListener('mousedown', () => {isDrawing = true; }, false);
    document.addEventListener('mouseup', () => {isDrawing = false; controls.enabled = true;}, false);
    document.addEventListener('mousemove', mouseMove, false);
    update();
}

function mouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function drawAsSquare(scene, callback, count, z) {
    let side = Math.sqrt(count);
    let offset = -side * PIXEL_SIZE / 2; // todo PIXEL_SIZE -> VOXEL_SIZE?
    for (let i = 0 ; i < count ; i++) {
        let x = i % (side);
        let y = Math.floor(i / side);
        scene.add(callback(x * (NEURON_SIZE * 2) + offset, y * (NEURON_SIZE * 2) + offset, z));
    }
}

function drawAsLine(scene, callback, count, z) {
    let offset = -count * PIXEL_SIZE / 2; // todo PIXEL_SIZE -> VOXEL_SIZE?
    for (let x = 0 ; x < count ; x++) {
        scene.add(callback(x * (NEURON_SIZE * 2) + offset, 0, z));
    }
}

function drawPixel(x, y, z) {
    let geometry = new THREE.BoxGeometry(PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE / 10);
    let material = new THREE.MeshLambertMaterial({color: 0xaaaaaa, transparent: true, opacity: 0.8});
    let pixel = new THREE.Mesh(geometry, material);
    pixel.position.set(x, y, z);

    return pixel;
}

function drawNeuron(x, y, z) {
    let geometry = new THREE.SphereGeometry(NEURON_SIZE, 32, 32);
    let material = new THREE.MeshLambertMaterial({color: 0x3333ff, transparent: true, opacity: 0.8});
    let neuron = new THREE.Mesh(geometry, material);
    neuron.position.set(x, y, z);

    return neuron;
}

window.onload = () => main();
