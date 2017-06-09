import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

const PIXEL_SIZE = 1;
const NEURON_SIZE = 0.5;

let mouse: THREE.Vector2 = new THREE.Vector2();
let isDrawing: boolean = false;

function main() {
    let scene: THREE.Scene = new THREE.Scene();
    let raycaster: THREE.Raycaster = new THREE.Raycaster();

    let camera: THREE.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 30);
    camera.lookAt(scene.position);

    let renderer: THREE.Renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // THREEx.WindowResize(renderer, camera);    // automatically resize renderer
    // THREEx.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});

    let light: THREE.Light = new THREE.PointLight(0xffffff);
    light.position.set(100, 250, 100);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x111111));

    drawAsSquare(scene, drawPixel, 400, 0);
    drawAsSquare(scene, drawNeuron, 400, 0);
    drawAsSquare(scene, drawNeuron, 25, -10);
    drawAsLine(scene, drawNeuron, 10, -20);

    let controls: THREE.OrbitControls = new OrbitControls(camera, renderer.domElement);

    let update = () => {
        window.requestAnimationFrame(update);

        raycaster.setFromCamera(mouse, camera);

        if (isDrawing) {
            let intersects: THREE.Intersection[] = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) controls.enabled = false;
            for (let i = 0; i < intersects.length; i++) {
                let mesh: THREE.Mesh = intersects[i].object as THREE.Mesh;
                let material: THREE.MeshLambertMaterial = mesh.material as THREE.MeshLambertMaterial;
                material.color.set(0xff0000);
            }
        }

        renderer.render(scene, camera);
    };

    document.addEventListener('mousedown', () => {isDrawing = true; }, false);
    document.addEventListener('mouseup', () => {isDrawing = false; controls.enabled = true;}, false);
    document.addEventListener('mousemove', mouseMove, false);
    update();
}

function mouseMove(event: any) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function drawAsSquare(scene: THREE.Scene, callback: Function, count: number, z: number) {
    let side: number = Math.sqrt(count);
    let offset: number = -side * PIXEL_SIZE / 2; // todo PIXEL_SIZE -> VOXEL_SIZE?
    for (let i: number = 0 ; i < count ; i++) {
        let x: number = i % (side);
        let y: number = Math.floor(i / side);
        scene.add(callback(x * (NEURON_SIZE * 2) + offset, y * (NEURON_SIZE * 2) + offset, z));
    }
}

function drawAsLine(scene: THREE.Scene, callback: Function, count: number, z: number) {
    let offset: number = -count * PIXEL_SIZE / 2; // todo PIXEL_SIZE -> VOXEL_SIZE?
    for (let x: number = 0 ; x < count ; x++) {
        scene.add(callback(x * (NEURON_SIZE * 2) + offset, 0, z));
    }
}

function drawPixel(x: number, y: number, z: number) {
    let geometry: THREE.Geometry = new THREE.BoxGeometry(PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE / 10);
    let material: THREE.Material = new THREE.MeshLambertMaterial({color: 0xaaaaaa, transparent: true, opacity: 0.8});
    let pixel: THREE.Mesh = new THREE.Mesh(geometry, material);
    pixel.position.set(x, y, z);

    return pixel;
}

function drawNeuron(x: number, y: number, z: number) {
    let geometry: THREE.Geometry = new THREE.SphereGeometry(NEURON_SIZE, 32, 32);
    let material: THREE.Material = new THREE.MeshLambertMaterial({color: 0x3333ff, transparent: true, opacity: 0.8});
    let neuron: THREE.Mesh = new THREE.Mesh(geometry, material);
    neuron.position.set(x, y, z);

    return neuron;
}

window.onload = () => main();
